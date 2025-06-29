//@author: Vu Hoang
import React from 'react'
import './Button.css'
/**
 * This commet is created by @author Phan NT Son
 * @author Function created by HoangVuBe
 * 
 * @param {{color: 'red-button'|'grey-button'|'blue-button'|'green-button'}} this.props.color
 * @returns a button component with customizable label, click handler, disabled state, and color
 */
function Button({ label, onClick, disabled, color }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={color} // Adjusted by Phan NT Son
    >
      {label}
    </button>
  );
}

export default Button
