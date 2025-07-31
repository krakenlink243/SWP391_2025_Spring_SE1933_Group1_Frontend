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
function Button({ label, onClick, disabled, color, type, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${color} ${disabled || loading ? "disabled-button" : ""}`} // Adjusted by Phan NT Son
      type={type ? type : ""}
    >
      {loading ? (
        <span className="custom-spinner" />
      ) : (
        label
      )}
    </button>
  );
}

export default Button
