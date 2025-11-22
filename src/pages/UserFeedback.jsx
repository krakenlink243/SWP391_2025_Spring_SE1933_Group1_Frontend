import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import "./SendUserFeedback.css"
import Button from '../components/Button/Button'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { useParams } from 'react-router'
import axios from 'axios'
import PartHeading from '../components/PartHeading/PartHeading'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function UserFeedback() {
    const {t}=useTranslation();
    const feedbackId = useParams().feedbackId;
    const [arr, setArr] = useState([]);
    const [userName, setUserName] = useState("");
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        mediaUrls: [],
        response: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFeedbackDetails() {
            try {
                const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/user/details/${feedbackId}`);
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
        if (window.confirm(t(t("Are you sure you want to delete this feedback?")))) {
            try {
                await axios.delete(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/user/${feedbackId}`);
                navigate(`/feedbackhub`);
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };
    return (
        <div className='sendfeedback-container'>
            <div className='sendfeedback-title'>
                <h1>{t('FEEDBACK')}</h1>
                <h2>{t('your feedback')}</h2>
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
            <div>
                <PartHeading content="Response" />
                <div>
                    {formData.response !== null
                        ? <pre>{formData.response}</pre>
                        : t('Not yet answered')}
                </div>
            </div>
            <div className='feedback-button'>
                {/* <Button label="UPDATE" color='blue-button' /> */}
                <Button label={t("Delete")} color='red-button' onClick={() => handleDeleteClick(feedbackId)} />
            </div>
        </div>
    )
}

export default UserFeedback
