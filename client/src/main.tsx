import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Reader from '@/Pages/Reader.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'reader',
    element: <Reader />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
