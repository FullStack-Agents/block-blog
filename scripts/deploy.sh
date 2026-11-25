#!/usr/bin/env bash
# Deploy the built site to the gh-pages branch, then verify it is live.
#
# Why this exists: the gh-pages branch is written by more than one method
# (the `gh-pages` npm package, and manual copies). A local branch goes stale
# the moment anything else pushes, so a plain `git push origin gh-pages` is
# rejected non-fast-forward. This script always syncs with origin first, and
# it does not trust the push — it polls the live bundle hash and fails loudly
# if the site stays stale.
#
# Usage:
#   scripts/deploy.sh                 # build, deploy, verify
#   scripts/deploy.sh -m "message"    # custom commit message
#   scripts/deploy.sh --no-build      # deploy the existing dist/
#   scripts/deploy.sh --timeout 600   # seconds to wait for the live bundle
#   scripts/deploy.sh --url https://.../   # site base URL to poll
#
# Exit: 0 deployed and live; 1 build/deploy/verification failure.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

BRANCH="gh-pages"
MSG="deploy: static build"
DO_BUILD=1
TIMEOUT=600
SITE_URL="https://fullstack-agents.github.io/block-blog/"

while [ $# -gt 0 ]; do
  case "$1" in
    -m|--message) MSG="${2:?--message needs a value}"; shift 2 ;;
    --no-build)   DO_BUILD=0; shift ;;
    --timeout)    TIMEOUT="${2:?--timeout needs a value}"; shift 2 ;;
    --url)        SITE_URL="${2:?--url needs a value}"; shift 2 ;;
    -h|--help)    sed -n '2,24p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

say() { printf '%s %s\n' "[$(date +%H:%M:%S)]" "$*"; }
die() { printf '%s ERROR: %s\n' "[$(date +%H:%M:%S)]" "$*" >&2; exit 1; }

# --- preconditions ---------------------------------------------------------

git rev-parse --git-dir >/dev/null 2>&1 || die "not a git repository: $REPO_ROOT"

START_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[ "$START_BRANCH" = "HEAD" ] && die "detached HEAD; check out a branch first"

if [ -n "$(git status --porcelain)" ]; then
  die "working tree is dirty on $START_BRANCH — commit or stash first
$(git status --short)"
fi

# --- build -----------------------------------------------------------------

if [ "$DO_BUILD" = 1 ]; then
  say "building ($START_BRANCH)"
  npm run build >/tmp/block-blog-build.log 2>&1 || {
    tail -30 /tmp/block-blog-build.log >&2
    die "build failed (full log: /tmp/block-blog-build.log)"
  }
fi

[ -f dist/index.html ] || die "dist/index.html missing — run a build first"

# The bundle the live site must end up serving.
EXPECTED_BUNDLE="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' dist/index.html | head -1)"
[ -n "$EXPECTED_BUNDLE" ] || die "could not find the bundle name in dist/index.html"
say "expected bundle: $EXPECTED_BUNDLE"

# --- sync gh-pages with origin --------------------------------------------

say "fetching origin/$BRANCH"
git fetch --quiet origin "$BRANCH"

# Recreate the local branch from origin: gh-pages is a build artifact, so
# local commits on it are never worth keeping.
git checkout --quiet -B "$BRANCH" "origin/$BRANCH"

say "copying dist/ onto $BRANCH"
rm -rf assets images
cp -r dist/* .
touch .nojekyll

NEED_PUSH=0
if [ -z "$(git status --porcelain)" ]; then
  say "no changes in dist/ — nothing to commit"
else
  git add -A
  git commit --quiet -m "$MSG"
  say "committed: $(git log -1 --format='%h %s')"
  NEED_PUSH=1
fi

# --- push (retry once if the branch moved under us) ------------------------

push_branch() {
  git push --quiet origin "$BRANCH"
}

if [ "$NEED_PUSH" = 1 ]; then
  if ! push_branch; then
    say "push rejected — re-syncing with origin and retrying once"
    git fetch --quiet origin "$BRANCH"
    git reset --hard --quiet "origin/$BRANCH"
    rm -rf assets images
    cp -r dist/* .
    touch .nojekyll
    git add -A
    git commit --quiet -m "$MSG" || true
    push_branch || die "push failed twice; nothing deployed"
  fi
  say "pushed $BRANCH: $(git rev-parse --short HEAD)"
else
  say "nothing pushed (gh-pages already matches dist/)"
fi

git checkout --quiet "$START_BRANCH"
say "back on $START_BRANCH"

# --- verify the live bundle -----------------------------------------------

say "waiting up to ${TIMEOUT}s for $SITE_URL to serve $EXPECTED_BUNDLE"
deadline=$(( $(date +%s) + TIMEOUT ))
live=""
while [ "$(date +%s)" -lt "$deadline" ]; do
  live="$(curl -fsS --max-time 15 "$SITE_URL" 2>/dev/null \
          | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1 || true)"
  if [ "assets/$live" = "$EXPECTED_BUNDLE" ]; then
    say "LIVE: $live"
    exit 0
  fi
  sleep 15
done

die "live site still serves '${live:-nothing}' after ${TIMEOUT}s (expected $EXPECTED_BUNDLE).
The push succeeded, so this is a Pages build problem, not a deploy problem.
Do NOT re-push blindly; check https://github.com/FullStack-Agents/block-blog/deployments
and tell Chris if it is stuck."
