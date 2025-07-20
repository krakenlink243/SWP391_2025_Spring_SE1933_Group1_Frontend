import React from 'react';
import './UserItem.css';
import Button from '../Button/Button';

function UserItem({
  avatar,
  username,
  action1,
  action2,
  onAction1Click,
  onAction2Click,
}) {
  return (
    <div className='user-item'>
      <div className="user-item-thumbnail">
        <img src={avatar} style={{ width: "60px", height: "60px", objectFit: "cover" }} />
      </div>
      <div className="user-item-title">{username}</div>
      <div className="user-item-actions">
        {action1 && (
          <Button label={action1} color='blue-button' onClick={onAction1Click} />
        )}
        {action2 && (
          <Button label={action2} color='red-button' onClick={onAction2Click} />
        )}
      </div>
    </div>
  );
}

export default UserItem;

