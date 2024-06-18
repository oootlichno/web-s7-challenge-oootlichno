import React from 'react'
import pizza from './images/pizza.jpg'
import { BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";

export default function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}
      <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} onClick={() => navigate("/order")} />
    </div>
  )
}




