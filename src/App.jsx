import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SendGameToAdmin from './pages/SendGameToAdmin'
function showMyName() {
  alert("My name is Hoang Vu")
}
function App() {
  return (
    <>
     <SendGameToAdmin></SendGameToAdmin>
    </>
  )
}

export default App
