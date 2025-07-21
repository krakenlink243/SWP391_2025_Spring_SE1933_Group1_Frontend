import React from 'react';
import './PublisherGameItem.css';
import Button from '../Button/Button';

function PublisherGameItem({
  thumbnail,
  title,
  action1,
  action2,
  action3,
  time,
  onAction1Click,
  onAction2Click,
  onAction3Click
}) {
  return (
    <div className='publisher-game-item'>
      <div className="publisher-game-item-thumbnail">
        <img src={thumbnail} style={{ width: "120px", height: "60px", objectFit: "cover" }} />
      </div>
      <div className="publisher-game-item-title">{title}</div>
      <div className="publisher-game-item-time">{time}</div>
      <div className="publisher-game-item-actions">
        {action1 && (
          <Button label={action1} color='blue-button' onClick={onAction1Click} />
        )}
        {action2 && (
          <Button label={action2} color='red-button' onClick={onAction2Click} />
        )}
        {action3 && (
          <Button label={action3} color='green-button' onClick={onAction3Click} />
        )}
      </div>
    </div>
  );
}

export default PublisherGameItem;

