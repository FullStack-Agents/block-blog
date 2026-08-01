import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import BlogLayout from './components/Layout'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import Ask from './pages/Ask'
import Conversations from './pages/Conversations'
import NotFound from './pages/NotFound'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const router = createHashRouter([
  {
    path: '/',
    element: <BlogLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:slug', element: <PostPage /> },
      { path: 'ask', element: <Ask /> },
      { path: 'conversations', element: <Conversations /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)