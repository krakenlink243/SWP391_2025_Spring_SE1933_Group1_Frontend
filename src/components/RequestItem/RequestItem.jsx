import React from 'react'
import './RequestItem.css'
function RequestItem({requestName,onApprove,onDecline,onCheckChange,requestId,isTicked,onClicked}) {

  return (
    <div className='request-item'>
      <img
                src={isTicked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
                alt="Checkbox"
                onClick={() => onCheckChange(requestId)} // ✅ Dynamically update check state from parent
      />
      <div style={{cursor:"pointer"}} className='request-name' onClick={onClicked}>{requestName} </div>
      <img src="/icons/Decline.png" alt="" onClick={onDecline} />
      <img src="/icons/Approve.png" alt="" onClick={onApprove}/>
    </div>
  )
}

export default RequestItem
