import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import UpdateProduct from './pages/UpdateProduct'
import { socket } from './axios/url'

function App() {

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket conectado:", socket.id)
    }
    socket.on("connect", handleConnect)

    return () => {
      socket.off("connect", handleConnect)
    }
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
