import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Homepage from './pages/Homepage.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import InvertoryPage from './pages/InvertoryPage.jsx'
import { LoadingScreen } from './pages/LoadingScreen.jsx'
import SearchingPage from './pages/SearchingPage.jsx'
import TelepathyPage from './pages/TelepathyPage.jsx'

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
  {
    path:"/SearchingPage",
    element: <SearchingPage/>
  },
  {
    path:"/Telepathy",
    element: <TelepathyPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
