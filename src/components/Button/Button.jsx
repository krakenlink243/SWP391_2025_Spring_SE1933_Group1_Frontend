//@author: Vu Hoang
import React from 'react'
import './Button.css'
/**
 * This commet is created by @author Phan NT Son
 * @author Function created by HoangVuBe
 * 
 * @param {{color: 'red-button'|'grey-button'|'blue-button'|'green-button'|'white-button'|'white-grey-button'|'gradient-blue-button'|'gradient-green-button'}} this.props.color
 * @returns a button component with customizable label, click handler, disabled state, and color
 */
function Button({ label, onClick, disabled, color, type }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} ${disabled === true ? "disabled-button" : ""}`} // Adjusted by Phan NT Son
      type={type ? type : ""}
    >
      {label}
    </button>
  );
}

export default Button
