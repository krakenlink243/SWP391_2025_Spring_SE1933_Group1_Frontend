import React from 'react'
import UserItem from '../../../components/UserItem/UserItem'
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../services/notification';
function ActiveUser() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const size = 10;
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/active`, {
                params: {
                    page,
                    size,
                    name: searchTerm.trim()
                }
            });
            console.log(response.data);
            const newUsers = response.data.content;
            setUsers(prev => (page===0? newUsers : [...prev, ...newUsers]));
            setHasMore(!response.data.last);
            setPage(page + 1);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
      fetchUsers();
  }, []);
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      setUsers([]);
      fetchUsers();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);
  const handleSearch = (term) => {
    setSearchTerm(term);
    setUsers([]);
    setPage(0);
    console.log(term)
  };
  const handleBan = async (userId) => {
    const confirm = window.confirm('Are you sure you want to ban this user?');
    if (!confirm) {
      return;
    }
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/user/ban/${userId}`, {
      });
      createNotification(userId,"User Management","Someone reported that you have violated the Term of Service.To object this report, send feedback to us.")
      setUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };
  const redirect = (userId) => {
    navigate(`/profile/${userId}`);
  }
  return (
    <div className='active-user-container'>
      <SearchBarPublisher onSearch={handleSearch} />

      <InfiniteScroll
        dataLength={users.length}
        next={fetchUsers}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scroll-area"
      >
        {users.map((user) => (
          <UserItem
            key={user.userId}
            avatar={user.avatarUrl}
            username={user.username}
            action1="View"
            action2="Ban"
            onAction2Click={() => handleBan(user.userId)}
            onAction1Click={() => redirect(user.userId)}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default ActiveUser
