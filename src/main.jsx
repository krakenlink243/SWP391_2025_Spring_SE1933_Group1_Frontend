import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Review from './Review'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Review />
  </StrictMode>,
)
