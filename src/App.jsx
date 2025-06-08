import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SendGameToAdmin from './pages/SendGameToAdmin'
import RequestItem from './components/RequestItem/RequestItem'

import GameApprovePage from './pages/GameApprovePage'
function showMyName() {
  alert("My name is Hoang Vu")
}
function App() {
  return (
    <>
     {/* <SendGameToAdmin></SendGameToAdmin> */}
     <GameApprovePage></GameApprovePage>
    </>
  )
}

export default App
