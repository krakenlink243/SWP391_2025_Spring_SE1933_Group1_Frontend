//@author: Vu Hoang
import React from 'react'
import './RequestItem.css'
function RequestItem({requestName,from,date,onApprove,onDecline,onCheckChange,requestId,isTicked,onClicked,reverseButton}) {

  return (
    <div className='request-item'>
      <img
                src={isTicked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
                alt="Checkbox"
                onClick={() => onCheckChange(requestId)} // ✅ Dynamically update check state from parent
      />
      <div style={{cursor:"pointer"}} className='request-name' onClick={onClicked}>{requestName} </div>
      <div className='from-user'>{from}</div>
      <div className='feedback-date'>{date}</div>
      {reverseButton ? (
        <>
          <img src="/icons/Approve.png" alt="" onClick={onApprove} />
          <img src="/icons/Decline.png" alt="" onClick={onDecline} />
        </>
      ) : (
        <>
          <img src="/icons/Decline.png" alt="" onClick={onDecline} />
          <img src="/icons/Approve.png" alt="" onClick={onApprove} />
        </>
      )}
    </div>
  )
}

export default RequestItem
