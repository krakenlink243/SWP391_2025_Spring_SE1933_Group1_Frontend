import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './GroupAvatar.css';

export default function GroupAvatar({ groupId }) {
    const { groupChats } = useContext(AppContext);
    
    const avatars = (groupChats ?? [])
        .filter(group => group.groupId === groupId)
        .flatMap(group => group.groupAvatar ?? []);
    return (
        <div className="group-avatar-wrapper d-flex flex-row flex-wrap h-100 w-100">
            {
                avatars.map((avatar, index) => (
                    <img className='item' src={avatar} key={index} />
                ))
            }
        </div>
    );
}