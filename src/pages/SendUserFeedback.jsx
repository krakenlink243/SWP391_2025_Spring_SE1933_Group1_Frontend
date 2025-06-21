import React, { useEffect } from 'react'
import { useState,useRef } from 'react'
import "./SendUserFeedback.css"
import Button from '../components/Button/Button'
import { PhotoProvider,PhotoView } from 'react-photo-view'
import { trimValue } from '../utils/validators'
import axios from 'axios'
function SendUserFeedback() {
    const [userName,setUserName] = useState("");
    const [formData,setFormData] = useState({
        subject: "",
        message: "",
        mediaUrls: [],
    });
    useEffect(() => {
        const userName = localStorage.getItem("username");
        setUserName(userName);
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'subject' && value.length > 256){
            alert("Subject must be less than 256 characters");
            setFormData(prev => ({
                ...prev,
                subject: value.slice(0,256),
            }));
            return;
        }
        if(name === 'message' && value.length > 2048){
            alert("Feedback must be less than 2048 characters");
            setFormData(prev => ({
                ...prev,
                message: value.slice(0,2048),
            }));
            return;
        }
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
    }
    const normalizeValue = (e) =>{
        const{name,value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: trimValue(value),
        }));
    }
    const [arr,setArr] = useState([]);
    const mediaFileRef = useRef(null);
    const [files,setFiles] = useState([]);
    const handleFileSelect = (e) =>{
        const selectFile = Array.from(e.target.files);
        setFiles(prev => [...prev,...selectFile]);
        const mediaPreview = selectFile.map(file => URL.createObjectURL(file));
        setArr(prev => [...prev,...mediaPreview]);
      
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!formData.subject || !formData.message){
            alert("Please fill in all fields!");
            return;
        }
        try{
            const uploadImage = new FormData();
            files.forEach(file => uploadImage.append('files',file));
            const responseMedia = await axios.post('http://localhost:8080/request/image/upload',uploadImage,{
              header:{"Content-Type": "multipart/form-data"},
            });
            console.log(files.length)
            console.log(responseMedia.data.imageUrls);
            setFormData(prev => ({...prev,mediaUrls: responseMedia.data.imageUrls}));
            const response = await axios.post('http://localhost:8080/request/feedback/send',{...formData,mediaUrls: responseMedia.data.imageUrls});
            console.log(response);
            alert(response.data.message);
            window.location.href="/";
      
          }catch(error){
            console.log(error);
          }
    }
  return (
    <div className='sendfeedback-container'>
        <div className='sendfeedback-title'>
            <h1>SEND FEEDBACK</h1>
            <h2>Hi, {userName}</h2>
            <p style={{fontStyle: "italic"}}>If you have any thing to tell us to improve our products or any question, please tell us below. </p>
        </div>
        <div className='feedback-content'>
            Subject
            <input type="text" name="subject" id="" value={formData.subject} onChange={handleChange} onBlur={normalizeValue} />
            <br />
            Your Feedback
            <textarea name="message" id="" onChange={handleChange} onBlur={normalizeValue} value={formData.message}></textarea>
        </div>
        <div className='inner-image'>
        <PhotoProvider>
          {arr.map((item, index) => (
            <PhotoView key={index} src={item}>
              <img src={item} alt="" style={{ cursor: "pointer", width: "150px" }} />
            </PhotoView>
          ))}
        </PhotoProvider>
            <input type="file" multiple style={{ display: "none" }} accept=".jpg,.png" ref={mediaFileRef} onChange={handleFileSelect}/>
            <Button className='upload-media' label='+' onClick={() => mediaFileRef.current.click()} color='blue-button'/>
        </div>
        <div className='feedback-button'>
            <Button label="SEND" color='blue-button' onClick={handleSubmit}/>
            <Button label="CANCEL" color='grey-button'/>
        </div>
    </div>
  )
}

export default SendUserFeedback
