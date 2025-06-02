import React from 'react'
import './PartHeading.css'
function PartHeading({content}) {
  return (
    <div class="overview-container">
        <div class="overview-title">{content}</div>
        <div class="overview-line"></div>
    </div>

  )
}

export default PartHeading
