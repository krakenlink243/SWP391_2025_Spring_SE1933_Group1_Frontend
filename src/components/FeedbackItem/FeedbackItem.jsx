import React from 'react';
import './FeedbackItem.css';
import Button from '../Button/Button';
const FeedbackItem = ({title,status,action1,action2,time,onAction1Click,onAction2Click}) => {

  return (
    <div className="feedback-item">
      <div className="feedback-item-title">{title}</div>
      <div className="feedback-item-time">{time}</div>
      <div className="feedback-item-status">{status}</div>
      <div className="feedback-item-actions">
        <Button label={action1} color='blue-button' onClick={onAction1Click}/>
        <Button label={action2} color='red-button' onClick={onAction2Click}/>
      </div>
    </div>
  );
};

export default FeedbackItem;