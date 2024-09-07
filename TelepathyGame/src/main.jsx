import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Homepage from './pages/Homepage.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import InvertoryPage from './pages/InvertoryPage.jsx'
import { LoadingScreen } from './pages/LoadingScreen.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <Homepage/>,
  errorElement: <div className='relative text-center justify-center content-center text-3xl text-white font-black'>404 NOT founds</div>
  },
  {
    path:"/Inventory",
    element: <InvertoryPage/>,
  },
  {
    path:'/LoadingPage',
    element: <LoadingScreen/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
