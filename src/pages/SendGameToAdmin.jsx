//@author: Vu Hoang
import React from 'react'
import { useState,useRef } from'react'
import gameicon from '../assets/gameicon.png'
import './SendGameToAdmin.css'
import PartHeading from '../components/PartHeading/PartHeading'
import Button from '../components/Button/Button'
import axios from 'axios'
import { validatePrice,validateEmty,validateMemory,trimValue,validateMedia } from '../utils/validators'
import { PhotoProvider,PhotoView } from 'react-photo-view'
import "react-photo-view/dist/react-photo-view.css";
import Select from 'react-select';

function SendGameToAdmin() {
  const [fileName,setFileName] = useState('Upload');
  const [showDropdown, setShowDropdown] = useState(false);
  const tags = [
  { value: 'rts', label: 'RTS' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'rpg', label: 'RPG' },
  { value: 'indie', label: 'Indie' },
  // ...add all your tags here
  ];
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
    tags: [],
    gameUrl: '',
  })
  const fileRef = useRef(null);
  const mediaFileRef = useRef(null);
  const inputRef = useRef(null);
  const [files,setFiles] = useState([]);
  const [arr,setArr] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && !validatePrice(value)) {
      alert('Price of games must follow these rules:\n1. Only numbers\n2. No space\n3. No special characters\n4. No empty string\n5. No negative number\n6. 2 digits after decimal point');
      return;
    }
    if(value.length > 32 && (name ==='gameName'|| name ==='os'||name ==='processor'||name==='graphics'||name==='storage')){
      alert("32 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 32), // Truncate without trimming spaces
      }));
      return;  
    }
    if(value.length > 1024 &&(name ==='additionalNotes'|| name ==='shortDescription')){
      alert("1024 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 1024), // Truncate without trimming spaces
      }));
      return;  
    }
    if(value.length > 10000 && name ==='fullDescription'){
      alert("10000 characters limit exceeded!");
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 10000), // Truncate without trimming spaces
      }));
      return;  
    }
    if(value > 1000 && name ==='price'){
      alert("Game price must be under or equals $1000!")
      setFormData(prev => ({
        ...prev,
        [name]: "", // Truncate without trimming spaces
      }));
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
      if (!validateEmty(formData.memory)||!validateEmty(formData.processor)||!validateEmty(formData.storage)||!validateEmty(formData.graphics)||!validateEmty(formData.shortDescription)||!validateEmty(formData.fullDescription)||!validateEmty(formData.gameName)||!validateEmty(formData.price)||!validateEmty(formData.os)||!validateEmty(formData.gameUrl)||!validateEmty(arr)) {
        alert(`Please fill in the required field.`);
        return;
      }
    }
    console.log(formData);
    try{
      const uploadImage = new FormData();
      files.forEach(file => uploadImage.append('files',file));
      const responseMedia = await axios.post('http://localhost:8080/request/image/upload',uploadImage,{
        header:{"Content-Type": "multipart/form-data"},
      });
      console.log(files.length)
      console.log(responseMedia.data.imageUrls);
      setFormData(prev => ({...prev,mediaUrls: responseMedia.data.imageUrls}));
      const response = await axios.post('http://localhost:8080/request/game/add',{...formData,mediaUrls: responseMedia.data.imageUrls});
      console.log(response);
      alert(response.data.message);
      window.location.href="/";

    }catch(error){
      console.log(error);
    }
  }
  const validMemory = (e) => {
    const { name, value } = e.target;
    if(!validateMemory(value)) {
      alert('Memory of games must follow this rule: Number + (GB/MB)');
      setFormData(prev => ({...prev,[name]: ''}));
      return;
    }else{
      setFormData(prev => ({...prev,[name]:value.toUpperCase() }));
    }
  };
  const handleDelete = async() =>{
    try {
      if(formData.gameUrl === ""){
        return;
      }
      const response = await axios.delete(`http://localhost:8080/request/file/delete/${formData.gameUrl}`);
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }
  const handleGameUpload = async(e) =>{
    await handleDelete();
    const selectedFile = e.target.files[0];
    const form = new FormData();
    form.append('file',selectedFile);
    try {
      const response = await axios.post('http://localhost:8080/request/file/upload',form,{header:{"Content-Type": "multipart/form-data"},});
      console.log(response.data.fileId);
      setFormData(prev =>({...prev,gameUrl:response.data.fileId}));
      setFileName(response.data.fileName);
    } catch (error) {
      console.log(error);
    }
    
  }
  const handleCancel = async() =>{
      await handleDelete();
      window.location.href="/"
  }
  const normalizeValue = async (e) => {
    const { name, value } = e.target;
    if(name ==='gameName'){
    const response = await axios.get(`http://localhost:8080/request/game/exist/check`,{params: { gameName: value }});
    console.log(response.data.message)
    console.log(response.data.debug)
      if(response.data.message === true){
        alert('Game name already exists!');
        setFormData(prev => ({...prev,[name]: ''}));
        return;
      }
    }
    setFormData(prev => ({...prev,[name]: trimValue(value)}));
  }
  const handleRemove = (indexToRemove) => {
    setArr(prev => prev.filter((_, i) => i !== indexToRemove));
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };  
  const handleChangeTags = (e) => {
    setFormData(prev => ({...prev,tags: e || []}));
    console.log(formData.tags)
  };


  return (
    <>
    <div className='form-border'>
      <h1 >Game Application</h1>
      <div className='game-mandatory-information'>
        <img className='game-avatar' src={gameicon} alt="" />
        <div className='name-price'>
            Name(*)
            <input type="text" name="gameName" id="" value={formData.gameName}  onChange={handleChange} onBlur={normalizeValue} />
            Price(*)
            <div>
              $ <input className='price-input' type="text" name="price" id="" value={formData.price} onChange={handleChange} />
            </div>
            Tags(*)
            <div className="tag-selector">
              <Select
                options={tags}
                isMulti
                value={formData.tags}
                onChange={handleChangeTags}
                closeMenuOnSelect={true}
                hideSelectedOptions={true}
                isSearchable={false}
                menuPlacement="bottom"
                classNamePrefix="my-select"
                // menuIsOpen={true}
              />
            </div>


        </div>
      </div>
      <div className='sys-req'>
        <PartHeading content='System Requirements'/>
        <div className='sys-req-col-container'>
            <div className='sys-req-col1'>
                OS(*)
                <input type="text" name="os" id="" value={formData.os} onChange={handleChange} onBlur={normalizeValue} />
                Processor(*)
                <input type="text" name="processor" id="" value={formData.processor} onChange={handleChange} onBlur={normalizeValue} />
                Memory(*)
                <input type="text" name="memory" id="" value={formData.memory} onChange={handleChange} onBlur={validMemory} />
            </div>
            <div className='sys-req-col2'>
                Graphics(*)
                <input type="text" name="graphics" id="" value={formData.graphics} onChange={handleChange} onBlur={normalizeValue} />
                Storage(*)
                <input type="text" name="storage" id="" value={formData.storage} onChange={handleChange} onBlur={validMemory} />
                Additionnal Notes
                <textarea name="additionalNotes" id="" value={formData.additionalNotes} onChange={handleChange} onBlur={normalizeValue}></textarea>
            </div>
        </div>
      </div>
      <div className='summary'>
        <PartHeading content='Summary(*)'/>
        <textarea name="shortDescription" id="" cols="30" rows="10" value={formData.shortDescription} onChange={handleChange} onBlur={normalizeValue}></textarea>
      </div>
      <div className='summary'>
        <PartHeading content='Description(*)'/>
        <textarea name="fullDescription" id="" cols="30" rows="10" value={formData.fullDescription} onChange={handleChange}></textarea>
      </div>
      <div className='game-assets'>
        <PartHeading content='Assets(*)'/>
        <div className='inner-image'>
        <input type="file" multiple style={{ display: "none" }} accept=".jpg,.png" ref={mediaFileRef} onChange={handleFileSelect}/>
        <Button className='upload-media' label='+' onClick={() => mediaFileRef.current.click()} color='gray-button'/>
        <PhotoProvider>
          {arr.map((item, index) => (
            <div className='image-wrapper' key={index}>
              <PhotoView src={item}>
                <img src={item} alt="" style={{ cursor: "pointer", width: "150px" }} />
              </PhotoView>
              <span className="remove-icon" onClick={() => handleRemove(index)}>−</span>
            </div>
          )).reverse()}
        </PhotoProvider>
        </div>
      </div>
      <div className='game-file'>
        <PartHeading content='Files(*)'/>   
        <input type="file" accept='.zip' style={{display:"none"}} ref={fileRef} onChange={handleGameUpload}  /> 
        <Button className='upload-button' label={fileName} onClick={() => fileRef.current.click()} color='blue-button'/>  
      </div>
      <div className='send-request-cancel'>
        <Button className='cancel-button' label='Cancel' onClick={handleCancel} color='grey-button'/>
        <Button className='send-button' label='Send Request' isApprove={'true'} onClick={handleSubmit} color='blue-button'/>
      </div>
    </div>
    </>
  )
}

export default SendGameToAdmin
