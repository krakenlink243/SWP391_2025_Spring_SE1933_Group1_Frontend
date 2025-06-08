import React from 'react'
import { useState } from 'react';
import './RequestItem.css'
function RequestItem({requestName,onApprove,onDecline,onCheckChange,requestId,isTicked}) {
    const [isChecked,setIsChecked] = useState(false);
    const handleCheckChange = () => {
      setIsChecked(!isChecked);
      onCheckChange(requestId);
  };
  return (
    <div className='request-item'>
      <img
                src={isTicked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
                alt="Checkbox"
                onClick={() => onCheckChange(requestId)} // ✅ Dynamically update check state from parent
      />
      <div className='request-name'>{requestName}</div>
      <img src="/icons/Decline.png" alt="" onClick={onDecline} />
      <img src="/icons/Approve.png" alt="" onClick={onApprove}/>
    </div>
  )
}

export default RequestItem
