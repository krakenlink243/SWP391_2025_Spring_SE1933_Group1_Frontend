//@author: Vu Hoang
import React from 'react'
import './PartHeading.css'
function PartHeading({content}) {
  return (
    <div className="overview-container">
        <div className="overview-title">{content}</div>
        <div className="overview-line"></div>
    </div>

  )
}

export default PartHeading
