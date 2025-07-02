import React from 'react'
import { useEffect,useState } from 'react'
import PartHeading from '../components/PartHeading/PartHeading'
import './FeedbackHub.css'
import axios from 'axios'
import Button from '../components/Button/Button'
import FeedbackItem from '../components/FeedbackItem/FeedbackItem'
function FeedbackHub() {
    const [feedbackItems, setFeedbackItems] = useState([])
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/feedback/user/${page}`);
        setFeedbackItems(response.data.content);
        console.log(response.data.content)
        setTotalPages(response.data.totalPages);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    useEffect(() => {
        fetchData();
    }, [page])
    const handlePageClick = (pageNumber) => {
      setPage(pageNumber);
    };
    const handleViewClick = (feedbackId) => {
        window.location.href = `/feedbackhub/${feedbackId}`;
    };
    const handleDeleteClick = async (feedbackId) => {
        if(window.confirm("Are you sure you want to delete this feedback?")){
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/request/feedback/user/${feedbackId}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };
  return (
    <div className='feedback-hub-container'>
        <div className='feedback-hub-title'>
            <h1>Feedback Hub</h1>
        </div>
        <div className='create-feedback-button'>
            <Button label='Write New Feedback' color='blue-button' onClick={() => window.location.href = '/sendfeedback'}/>
        </div>
        <div className='your-feedback'>
            <h2>Your Submitted Feedback</h2>
            {feedbackItems.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
            <div className='your-feedback-item'>
                {feedbackItems.map((feedback) => (
                    <FeedbackItem
                        key={feedback.requestId}
                        title={feedback.subject}
                        status={feedback.status === 0 ? 'Pending': feedback.status === 1 ? 'Answered':'Dismissed'}
                        action1={'View'}
                        action2={'Delete'}
                        time={feedback.createdDate}
                        onAction1Click={() => handleViewClick(feedback.requestId)}
                        onAction2Click={() => handleDeleteClick(feedback.requestId)}
                    />
                ))}
            </div>
            )}
            <div className="pagination-controls">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index} 
                        onClick={() => handlePageClick(index)} 
                        className={page === index ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    </div>
  )
}

export default FeedbackHub
