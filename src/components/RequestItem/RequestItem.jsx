import React from 'react'
import { useState } from 'react';
import './RequestItem.css'
function RequestItem({requestName,onApprove,onDecline,onCheckChange}) {
    const [isChecked,setIsChecked] = useState(false);
    const handleCheckChange = () => {
        setIsChecked(!isChecked);
        onCheckChange();
    }
  return (
    <div className='request-item'>
      <img
        src={isChecked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
        alt="Checkbox" onClick={handleCheckChange}
      />


      <div className='request-name'>{requestName}</div>
      <img src="/icons/Decline.png" alt="" />
      <img src="/icons/Approve.png" alt="" />
    </div>
  )
}

export default RequestItem
