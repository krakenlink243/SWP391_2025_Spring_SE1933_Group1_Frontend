import React from 'react'
import './Button.css'
function Button({ label, onClick, disabled, isApprove }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={isApprove ? 'approve-button' : 'button'}
    >
      {label}
    </button>
  );
}

export default Button
