//@author: Vu Hoang
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './SendGameToAdmin.css'
import PartHeading from '../components/PartHeading/PartHeading'
import Button from '../components/Button/Button'
import axios from 'axios'
import { validatePrice, validateEmty, validateMemory, trimValue, validateMedia } from '../utils/validators'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import "react-photo-view/dist/react-photo-view.css";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
function SendGameToAdmin() {
  const [fileName, setFileName] = useState('Upload');
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = [
    { value: 18, label: 'Action' },
    { value: 17, label: 'Adventure' },
    { value: 29, label: 'Anime' },
    { value: 31, label: 'Casual' },
    { value: 12, label: 'Choices Matter' },
    { value: 4, label: 'Classic' },
    { value: 27, label: 'Co-op' },
    { value: 23, label: 'Crafting' },
    { value: 15, label: 'Exploration' },
    { value: 20, label: 'Fantasy' },
    { value: 28, label: 'FPS' },
    { value: 16, label: 'Free to Play' },
    { value: 10, label: 'Great Soundtrack' },
    { value: 3, label: 'Historical' },
    { value: 14, label: 'Horror' },
    { value: 8, label: 'Indie' },
    { value: 6, label: 'Multiplayer' },
    { value: 19, label: 'Open World' },
    { value: 11, label: 'Pixel Graphics' },
    { value: 25, label: 'Platformer' },
    { value: 26, label: 'Puzzle' },
    { value: 30, label: 'Racing' },
    { value: 7, label: 'RPG' },
    { value: 1, label: 'RTS' },
    { value: 21, label: 'Sci-fi' },
    { value: 24, label: 'Simulation' },
    { value: 5, label: 'Singleplayer' },
    { value: 9, label: 'Story Rich' },
    { value: 2, label: 'Strategy' },
    { value: 13, label: 'Surreal' },
    { value: 22, label: 'Survival' },
  ];
  const [formData, setFormData] = useState({
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
    iconUrl:''
  })
  const fileRef = useRef(null);
  const mediaFileRef = useRef(null);
  // const inputRef = useRef(null);
  const fileInputRef = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({
  unit: '%',
  x: 25,
  y: 25,
  width: 50,
  height: 50,
});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const imgRef = useRef();
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [arr, setArr] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);       // KB/s
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && !validatePrice(value)) {
      alert('Price of games must follow these rules:\n1. Only numbers\n2. No space\n3. No special characters\n4. No empty string\n5. No negative number\n6. 2 digits after decimal point');
      return;
    }
    if (value.length > 32 && (name === 'gameName' || name === 'os' || name === 'processor' || name === 'graphics' || name === 'storage')) {
      alert("32 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 32), // Truncate without trimming spaces
      }));
      return;
    }
    if (value.length > 1024 && (name === 'additionalNotes' || name === 'shortDescription')) {
      alert("1024 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 1024), // Truncate without trimming spaces
      }));
      return;
    }
    if (value.length > 10000 && name === 'fullDescription') {
      alert("10000 characters limit exceeded!");
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 10000), // Truncate without trimming spaces
      }));
      return;
    }
    if (value > 1000 && name === 'price') {
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

  const handleFileSelect = (e) => {
    const selectFile = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectFile]);
    const mediaPreview = selectFile.map(file => URL.createObjectURL(file));
    setArr(prev => [...prev, ...mediaPreview]);
  }
  const handleSubmit = async () => {
    for (const key in formData) {
      if (!validateEmty(formData.memory) || !validateEmty(formData.processor) || !validateEmty(formData.storage) || !validateEmty(formData.graphics) || !validateEmty(formData.shortDescription) || !validateEmty(formData.fullDescription) || !validateEmty(formData.gameName) || !validateEmty(formData.price) || !validateEmty(formData.os) || !validateEmty(formData.gameUrl) || !validateEmty(arr) ||!croppedUrl) {
        alert(`Please fill in the required field.`);
        return;
      }
    }
    console.log(formData);
    try {
      const uploadImage = new FormData();
      files.forEach(file => uploadImage.append('files', file));
      const responseMedia = await axios.post(`${import.meta.env.VITE_API_URL}/request/image/upload`, uploadImage, {
        header: { "Content-Type": "multipart/form-data" },
      });
      const croppedUpload = new FormData();
      croppedUpload.append('files', croppedFile);
      const croppedResponse = await axios.post(`${import.meta.env.VITE_API_URL}/request/image/upload`, croppedUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/request/game/add`, { ...formData, mediaUrls: responseMedia.data.imageUrls,iconUrl: croppedResponse.data.imageUrls[0] });
      console.log(response);
      alert(response.data.message);
      navigate("/");

    } catch (error) {
      console.log(error);
    }
  }
  const validMemory = (e) => {
    const { name, value } = e.target;
    if (!validateMemory(value)) {
      alert('Memory of games must follow this rule: Number + (GB/MB)');
      setFormData(prev => ({ ...prev, [name]: '' }));
      return;
    } else {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    }
  };
  const handleDelete = async () => {
    try {
      if (formData.gameUrl === "") {
        return;
      }
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/request/file/delete/${formData.gameUrl}`);
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  const handleGameUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    await handleDelete();
    setUploadProgress(0);
    setUploadSpeed(0);
    setTimeRemaining(null);

    const startTime = Date.now();

    try {
      // 🔐 Step 1: Get presigned upload URL + fileId + fileName
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/request/file/upload`,
        new URLSearchParams({
          fileName: selectedFile.name,
          contentType: selectedFile.type
        })
      );

      const { uploadUrl, fileId, fileName } = response.data;

      // 🚀 Step 2: Upload to R2 directly using XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", selectedFile.type);

      xhr.upload.onprogress = (event) => {
        const percent = (event.loaded / selectedFile.size) * 100;
        setUploadProgress(percent);

        const elapsed = (Date.now() - startTime) / 1000;
        const speedKBps = (event.loaded / elapsed) / 1024;
        const remainingBytes = selectedFile.size - event.loaded;
        const remainingTime = remainingBytes / (speedKBps * 1024);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.round(remainingTime % 60);

        setUploadSpeed(speedKBps.toFixed(2));
        setTimeRemaining(`${minutes}m ${seconds}s`);
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadProgress(100);
          setTimeRemaining(`0m 0s`);

          setFormData((prev) => ({
            ...prev,
            gameUrl: fileId
          }));

          setFileName(fileName);
          console.log("Uploaded successfully:", { fileId, fileName });
        } else {
          console.error("Upload failed with status:", xhr.status);
        }
      };

      xhr.onerror = () => {
        console.error("Upload failed due to network or CORS.");
      };

      xhr.send(selectedFile);
    } catch (error) {
      console.error("Upload setup failed:", error);
    }
  };


  const handleCancel = async () => {
    await handleDelete();
    navigate("/");
  }
  const normalizeValue = async (e) => {
    const { name, value } = e.target;
    if (name === 'gameName') {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/game/exist/check`, { params: { gameName: value } });
      console.log(response.data.message)
      console.log(response.data.debug)
      if (response.data.message === true) {
        alert('Game name already exists!');
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: trimValue(value) }));
  }
  const handleRemove = (indexToRemove) => {
    setArr(prev => prev.filter((_, i) => i !== indexToRemove));
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };
  const handleChangeTags = (e) => {
    const tagId = e.map((tag) => tag.value);
    setFormData(prev => ({ ...prev, tags: tagId || [] }));
    console.log(formData.tags)
    setSelectedTags(prev => e);
    console.log(selectedTags)
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    setCroppedUrl(null); // clear old result
  };
  const confirmCrop = () => {
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const previewUrl = URL.createObjectURL(blob);
      setCroppedUrl(previewUrl);
      setImageSrc(null); // Hide cropper

      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
      setCroppedFile(file); 
    }, 'image/jpeg');
  };
  return (
    <>
      <div className='form-border' style={{width:'60%',marginTop:'5%',marginBottom:'5%'}}>
        <h1 >Game Application</h1>
        <div className='game-mandatory-information'>
          <div className='game-icon'style={{margin:'0 auto'}}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            {/* Show "+" button only when no image is loaded or already cropped */}
            {!imageSrc && !croppedUrl && (
              <Button
                label="+"
                color="grey-button"
                onClick={() => fileInputRef.current.click()}
              />
            )}

            {/* Show crop UI when an image is selected */}
            {imageSrc && (
              <div >
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    src={imageSrc}
                    onLoad={(e) => {
                      imgRef.current = e.currentTarget;
                      onImageLoad?.(e); // optional: center crop
                    }}
                    alt="Crop me"
                  />
                </ReactCrop>
                <br />
                <button onClick={confirmCrop}>Confirm Crop</button>
              </div>
            )}

            {/* Show final cropped image */}
            {croppedUrl && (
              <img
                className='final-cropped'
                src={croppedUrl}
                alt="Final result"
                style={{ cursor: 'pointer', maxWidth: '250px' }}
                onClick={() => fileInputRef.current.click()} // click to restart flow
              />
            )}
          </div>
          {!(imageSrc && !croppedUrl) && (

          <div className='name-price'>
            Name(*)
            <input type="text" name="gameName" id="" value={formData.gameName} onChange={handleChange} onBlur={normalizeValue} />
            Price(*)
            <div>
              $ <input className='price-input' type="text" name="price" id="" value={formData.price} onChange={handleChange} />
            </div>
            Tags(*)
            <div className="tag-selector">
              <Select
                options={tags}
                isMulti
                value={selectedTags}
                onChange={handleChangeTags}
                closeMenuOnSelect={true}
                hideSelectedOptions={true}
                isSearchable={true}
                menuPlacement="bottom"
                classNamePrefix="my-select"
              // menuIsOpen={true}
              />
            </div>
          </div>
          )}
        </div>
        <div className='sys-req'>
          <PartHeading content='System Requirements' />
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
          <PartHeading content='Summary(*)' />
          <textarea name="shortDescription" id="" cols="30" rows="10" value={formData.shortDescription} onChange={handleChange} onBlur={normalizeValue}></textarea>
        </div>
        <div className='summary'>
          <PartHeading content='Description(*)' />
          <textarea name="fullDescription" id="" cols="30" rows="10" value={formData.fullDescription} onChange={handleChange}></textarea>
        </div>
        <div className='game-assets'>
          <PartHeading content='Assets(*)' />
          <div className='inner-image'>
            <input type="file" multiple style={{ display: "none" }} accept=".jpg,.png" ref={mediaFileRef} onChange={handleFileSelect} />
            <Button className='upload-media' label='+' onClick={() => mediaFileRef.current.click()} color='grey-button' />
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
          <PartHeading content='Files(*)' />
          <input type="file" accept='.zip' style={{ display: "none" }} ref={fileRef} onChange={handleGameUpload} />
          <Button className='upload-button' label={fileName} onClick={() => fileRef.current.click()} color='blue-button' />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <>
              <progress value={uploadProgress} max="100" />
              <div>Speed: {uploadSpeed} KB/s</div>
              <div>
                Time Remaining: {timeRemaining ? timeRemaining : 'Calculating...'}
              </div>
            </>
          )}
        </div>
        <div className='send-request-cancel'>
          <Button className='cancel-button' label='Cancel' onClick={handleCancel} color='grey-button' />
          <Button className='send-button' label='Send Request' isApprove={'true'} onClick={handleSubmit} color='blue-button' />
        </div>
      </div>
    </>
  )
}

export default SendGameToAdmin
