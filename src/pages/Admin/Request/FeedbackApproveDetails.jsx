import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import "../../SendUserFeedback.css"
import Button from '../../../components/Button/Button'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { useParams } from 'react-router'
import axios from 'axios'
import { createNotification } from '../../../services/notification'
import { trimValue } from '../../../utils/validators'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Required for default styles
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next' // translation


function FeedbackApproveDetails() {
  const feedbackId = useParams().requestId;
  const [senderId, setSenderId] = useState("");
  const [arr, setArr] = useState([]);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    mediaUrls: [],
    response: ""
  });
  const navigate = useNavigate();
  //Author: Ba thanh
  const { t } = useTranslation(); //translation


  useEffect(() => {
    async function fetchFeedbackDetails() {
      try {
        const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/details/${feedbackId}`);
        setFormData(response.data);
        setArr(response.data.mediaUrls);
        setUserName(response.data.userName);
        setSenderId(response.data.userId);
      } catch (error) {
        console.error('Error fetching feedback details:', error);
      }
    }
    fetchFeedbackDetails();
  }, []);
  // const handleAnswer = async() =>{
  //   const answer = window.prompt("Send answer to" + " " + userName)
  //   if(answer.trim() !== ""){
  //     try {
  //       createNotification(senderId,"Feedback Answer","Answer for your feedback "+formData.subject+": " + answer)
  //       const response = await axios.patch(`http://localhost:8080/request/feedback/approve/${feedbackId}`,{
  //         response: trimValue(answer)
  //       });
  //       console.log("Approved request:", response.data)
  //     } catch (err) {
  //       console.error("Error approving request:", err);
  //     }
  //     window.location.href=`/approvefeedback`
  //   }else{
  //     alert('Please enter answer')
  //   }
  // }
  const handleAnswer = () => {
    let answer = '';

    confirmAlert({
      title: `Send answer to ${userName}`,
      customUI: ({ onClose }) => (
        <div className="custom-ui">
          <h2> {t('Answer Feedback')} </h2>
          <p>{t('Answer for')}: {userName}</p>
          <textarea
            rows={5}
            style={{ width: '100%', marginBottom: '1rem' }}
            onChange={(e) => (answer = e.target.value)}
            placeholder={t('Type your answer here...')}
          />
          <button className='blue-button'
            onClick={async () => {
              if (answer.trim() !== '') {
                try {
                  createNotification(senderId, 'Feedback Answer', `Answer for your feedback ${formData.subject}: ${answer}`);
                  const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/approve/${feedbackId}`, {
                    response: trimValue(answer)
                  });
                  console.log('Approved request:', response.data);
                  navigate('/admin/request/feedback');
                } catch (err) {
                  console.error('Error approving request:', err);
                }
                onClose();
              } else {
                alert(t('Please enter answer'));
              }
            }}
          >
            {t('Submit')}
          </button>
        </div>
      )
    });
  };
  const handleDecline = async () => {
    const confirmDecline = window.confirm(t('Are you sure you want to decline this feedback?'));
    if (!confirmDecline) {
      return;
    }
    try {
      const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/reject/${feedbackId}`);
      console.log("Approved request:", response.data);
      createNotification(
        senderId,
        "Feedback Answer",
        `Your feedback ${formData.subject} has been dissmissed`
      )
    } catch (err) {
      console.error("Error approving request:", err);
    }
    navigate('/admin/request/feedback');
  }
  return (
    <div className='sendfeedback-container'>
      <div className='sendfeedback-title'>
        <h1>{t('FEEDBACK')}</h1>
        <h2>{t('from')} {userName} </h2>
      </div>
      <div className='feedback-content'>
        {t('Subject')}
        <input type="text" name="subject" id="" value={formData.subject} readOnly />
        <br />
        {t('Feedback')}
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
        <Button label={t('Dismiss')} color='red-button' onClick={handleDecline} />
        <Button label={t('Answer')} color='blue-button' onClick={handleAnswer} />
      </div>
    </div>
  )
}

export default FeedbackApproveDetails
