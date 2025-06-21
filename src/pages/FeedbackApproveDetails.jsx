import React, { useEffect } from 'react'
import { useState,useRef } from 'react'
import "./SendUserFeedback.css"
import Button from '../components/Button/Button'
import { PhotoProvider,PhotoView } from 'react-photo-view'
import { trimValue } from '../utils/validators'
import { useParams } from 'react-router'
import axios from 'axios'
function FeedbackApproveDetails() {
    const feedbackId = useParams().feedbackId;
    const [arr,setArr] = useState([]);
    const [formData,setFormData] = useState({
        subject: "",
        message: "",
        mediaUrls: [],
    });
    useEffect(() => {
        async function fetchFeedbackDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/request/feedback/details/${feedbackId}`);
                setFormData(response.data);
                // setArr(response.data.mediaUrls);
            } catch (error) {
                console.error('Error fetching feedback details:', error);
            }
        }
        fetchFeedbackDetails();
    }, []);
  return (
    <div className='sendfeedback-container'>
        <div className='sendfeedback-title'>
            <h1>FEEDBACK</h1>
            <h2>from </h2>
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
        <div className='feedback-button'>
            <Button label="ANSWER" color='blue-button'/>
            <Button label="DECLINE" color='grey-button'/>
        </div>
    </div>
  )
}

export default FeedbackApproveDetails
