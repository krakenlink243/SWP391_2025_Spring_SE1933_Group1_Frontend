import React, { useEffect } from 'react'
import { useState,useRef } from 'react'
import "./SendUserFeedback.css"
import Button from '../components/Button/Button'
import { PhotoProvider,PhotoView } from 'react-photo-view'
import { useParams } from 'react-router'
import axios from 'axios'
import PartHeading from '../components/PartHeading/PartHeading'
function UserFeedback() {
    const feedbackId = useParams().feedbackId;
    const [arr,setArr] = useState([]);
    const [userName,setUserName] = useState("");
    const [formData,setFormData] = useState({
        subject: "",
        message: "",
        mediaUrls: [],
        response:""
    });
    useEffect(() => {
        async function fetchFeedbackDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/request/feedback/user/details/${feedbackId}`);
                setFormData(response.data);
                setArr(response.data.mediaUrls);
                setUserName(response.data.userName);
            } catch (error) {
                console.error('Error fetching feedback details:', error);
            }
        }
        fetchFeedbackDetails();
    }, []);
    const handleDeleteClick = async (feedbackId) => {
        if(window.confirm("Are you sure you want to delete this feedback?")){
            try {
                await axios.delete(`http://localhost:8080/request/feedback/user/${feedbackId}`);
                window.location.href=`/feedbackhub`;
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };
  return (
    <div className='sendfeedback-container'>
        <div className='sendfeedback-title'>
            <h1>FEEDBACK</h1>
            <h2>your feedback</h2>
        </div>
        <div className='feedback-content'>
            Subject
            <input type="text" name="subject" id="" value={formData.subject} readOnly />
            <br />
            Feedback
            <textarea name="message" id="" readOnly value={formData.message}></textarea>
        </div>
        <div className='inner-image'>
        <PhotoProvider>
          {arr.map((item, index) => (
            <PhotoView key={index} src={item}>
              <img src={item} alt="" style={{ cursor: "pointer", width: "150px" }} />
            </PhotoView>
          ))}
        </PhotoProvider>
        </div>
        <div>
            <PartHeading content="Response" />
            <div>
                {formData.response !== null
                    ? <pre>{formData.response}</pre>
                    : 'Not yet answered'}
            </div>
        </div>
        <div className='feedback-button'>
            {/* <Button label="UPDATE" color='blue-button' /> */}
            <Button label="Delete" color='red-button' onClick={() => handleDeleteClick(feedbackId)} />
        </div>
    </div>
  )
}

export default UserFeedback
