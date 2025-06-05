import React from 'react'
import { useState,useRef } from'react'
import gameicon from '../assets/gameicon.png'
import './SendGameToAdmin.css'
import PartHeading from '../components/PartHeading/PartHeading'
import Button from '../components/Button/Button'
import axios from 'axios'
import { validatePrice,validateEmty,validateMemory } from '../utils/validators'
function SendGameToAdmin() {
  const [formData,setFormData] = useState({
    gameName: '',
    price: '',
    os: '',
    processor: '',
    memory: '',
    graphics: '',
    storage: '',
    additionalNotes: '',
    shortDescription: '',
    fullDescription: '',
    mediaUrls: [],
    // files: [],
  })
  const fileInputRef = useRef(null);
  const [files,setFiles] = useState([]);
  const [mediaUrls,setMediaUrls] = useState([]);
  const [arr,setArr] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && !validatePrice(value)) {
      alert('Price of games must follow these rules:\n1. Only numbers\n2. No space\n3. No special characters\n4. No empty string\n5. No negative number\n6. 2 digits after decimal point');
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleFileSelect = (e) =>{
    const selectFile = Array.from(e.target.files);
    setFiles(prev => [...prev,...selectFile]);
    const mediaPreview = selectFile.map(file => URL.createObjectURL(file));
    setArr(prev => [...prev,...mediaPreview]);
  }
  const handleSubmit = async() => {
    for (const key in formData) {
      if (!validateEmty(formData.memory)||!validateEmty(formData.processor)||!validateEmty(formData.storage)||!validateEmty(formData.graphics)||!validateEmty(formData.shortDescription)||!validateEmty(formData.fullDescription)||!validateEmty(formData.gameName)||!validateEmty(formData.price)||!validateEmty(formData.os)) {
        alert(`Please fill in the required field.`);
        return;
      }
    }
    console.log(formData);
    try{
      const uploadImage = new FormData();
      files.forEach(file => uploadImage.append('files',file));
      const responseMedia = await axios.post('http://localhost:8080/publisher/uploadImage',uploadImage,{
        header:{"Content-Type": "multipart/form-data"},
      });
      console.log(files.length)
      console.log(responseMedia.data.imageUrls);
      setFormData(prev => ({...prev,mediaUrls: responseMedia.data.imageUrls}));
      const response = await axios.post('http://localhost:8080/publisher/addGame',{...formData,mediaUrls: responseMedia.data.imageUrls});
      console.log(response);
      alert(response.data.message);
    }catch(error){
      console.log(error);
    }
  }
  const validMemory = (e) => {
    const { name, value } = e.target;
    if(!validateMemory(value)) {
      alert('Memory of games must follow these rules:\n1. Only numbers\n2. No space\n3. No special characters\n4. No empty string\n5. No negative number\n6. 2 digits after decimal point');
      setFormData(prev => ({...prev,[name]: ''}));
      return;
    }else{
      setFormData(prev => ({...prev,[name]:value.toUpperCase() }));
    }
  };
  return (
    <>
    <div className='game-application'>
        <h1 >GAME APPLICATION</h1>
    </div>
    <div className='form-border'>
      <div className='game-mandatory-information'>
        <img className='game-avatar' src={gameicon} alt="" />
        <div className='name-price'>
            NAME(*)
            <input type="text" name="gameName" id="" value={formData.gameName}  onChange={handleChange} />
            PRICE(*)
            <div>
              <input type="text" name="price" id="" value={formData.price} onChange={handleChange} /> $
            </div>
        </div>
      </div>
      <div className='sys-req'>
        <PartHeading content='SYSTEM REQUIREMENTS'/>
        <div className='sys-req-col-container'>
            <div className='sys-req-col1'>
                OS(*)
                <input type="text" name="os" id="" value={formData.os} onChange={handleChange} />
                PROCESSOR(*)
                <input type="text" name="processor" id="" value={formData.processor} onChange={handleChange} />
                MEMORY(*)
                <input type="text" name="memory" id="" value={formData.memory} onChange={handleChange} onBlur={validMemory} />
            </div>
            <div className='sys-req-col2'>
                GRAPHICS(*)
                <input type="text" name="graphics" id="" value={formData.graphics} onChange={handleChange} />
                STORAGE(*)
                <input type="text" name="storage" id="" value={formData.storage} onChange={handleChange} onBlur={validMemory} />
                ADDITIONAL NOTES
                <textarea name="additionalNotes" id="" value={formData.additionalNotes} onChange={handleChange}></textarea>
            </div>
        </div>
      </div>
      <div className='summary'>
        <PartHeading content='SUMMARY'/>
        <textarea name="shortDescription" id="" cols="30" rows="10" value={formData.shortDescription} onChange={handleChange}></textarea>
      </div>
      <div className='summary'>
        <PartHeading content='Description'/>
        <textarea name="fullDescription" id="" cols="30" rows="10" value={formData.fullDescription} onChange={handleChange}></textarea>
      </div>
      <div className='game-assets'>
        <PartHeading content='ASSETS'/>
        <div className='inner-image'>
            {arr.map((item,index) => (
                <img src={item} alt="" key={index} />
            ))}
            <input type="file"multiple style={{ display: "none" }} ref={fileInputRef} onChange={handleFileSelect}/>
            <Button className='upload-button' label='+' onClick={() => fileInputRef.current.click()}/>
        </div>
      </div>
      <div className='game-file'>
        <PartHeading content='FILES'/>    
        <Button className='upload-button' label='UPLOAD'/>  
      </div>
      <div className='send-request-cancel'>
        <Button className='cancel-button' label='CANCEL'/>
        <Button className='send-button' label='SEND REQUEST' isApprove={'true'} onClick={handleSubmit}/>
      </div>
    </div>
    </>
  )
}

export default SendGameToAdmin
