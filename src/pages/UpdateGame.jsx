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
import { useNavigate, useParams } from 'react-router-dom'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';

function UpdateGame() {
  const [fileName, setFileName] = useState('Upload');
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = [
    { value: 18, label: 'Action' }, { value: 17, label: 'Adventure' }, { value: 29, label: 'Anime' },
    { value: 31, label: 'Casual' }, { value: 12, label: 'Choices Matter' }, { value: 4, label: 'Classic' },
    { value: 27, label: 'Co-op' }, { value: 23, label: 'Crafting' }, { value: 15, label: 'Exploration' },
    { value: 20, label: 'Fantasy' }, { value: 28, label: 'FPS' }, { value: 16, label: 'Free to Play' },
    { value: 10, label: 'Great Soundtrack' }, { value: 3, label: 'Historical' }, { value: 14, label: 'Horror' },
    { value: 8, label: 'Indie' }, { value: 6, label: 'Multiplayer' }, { value: 19, label: 'Open World' },
    { value: 11, label: 'Pixel Graphics' }, { value: 25, label: 'Platformer' }, { value: 26, label: 'Puzzle' },
    { value: 30, label: 'Racing' }, { value: 7, label: 'RPG' }, { value: 1, label: 'RTS' },
    { value: 21, label: 'Sci-fi' }, { value: 24, label: 'Simulation' }, { value: 5, label: 'Singleplayer' },
    { value: 9, label: 'Story Rich' }, { value: 2, label: 'Strategy' }, { value: 13, label: 'Surreal' },
    { value: 22, label: 'Survival' },
  ];
  const [formData, setFormData] = useState({
    gameName: '', price: '', os: '', processor: '', memory: '', graphics: '', storage: '',
    additionalNotes: '', shortDescription: '', fullDescription: '', mediaUrls: [], tags: [], gameUrl: '', iconUrl: '',gameId:''
  });

  const fileRef = useRef(null);
  const mediaFileRef = useRef(null);
  const fileInputRef = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', x: 25, y: 25, width: 50, height: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const imgRef = useRef();
  const [croppedUrl, setCroppedUrl] = useState(null); // This is for the *icon*
  const [files, setFiles] = useState([]); // For new media files (File objects)
  const [arr, setArr] = useState([]); // For displaying media previews (mix of original URLs and new Blob URLs)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0); // KB/s
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const {requestId} = useParams();
  const [originalMediaUrls, setOriginalMediaUrls] = useState([]); // Stores original *string* URLs from backend
  const [originalIconUrl, setOriginalIconUrl] = useState(null); // Assuming this already stores string URL
  const [loadingGameData, setLoadingGameData] = useState(true);

  // Effect to load game data if gameId is present
  useEffect(() => {
    if (gameId||requestId) {
      const fetchGameData = async () => {
        setLoadingGameData(true);
        try {
          let response;
          if(gameId){
            response = await axios.get(`${import.meta.env.VITE_API_URL}/game/detail/${gameId}`);
          }else{
            response = await axios.get(`${import.meta.env.VITE_API_URL}/request/game/details/${requestId}`);
          }
          const gameData = response.data;
          console.log("Fetched Game Data (raw from BE):", gameData); // IMPORTANT: Check this in console

          // === THE CRITICAL CHANGE FOR MEDIA ASSETS ===
          // If gameData.media is an array of objects like [{ url: '...', id: '...' }]
          let fetchedMediaUrlStrings;
          if(gameId){
          fetchedMediaUrlStrings = gameData.media ? gameData.media.map(item => item.url) : [];
          // ===========================================
          }else{
            fetchedMediaUrlStrings = gameData.mediaUrls;
          }
          // (Icon related logic - keeping your existing, working logic here)
          const fetchedIconUrl = gameData.iconUrl; // Assuming gameData.iconUrl is already a string URL
          if(gameId){
            setFormData({
              gameName: gameData.name,
              price: gameData.price.toString(),
              os: gameData.os,
              processor: gameData.processor,
              memory: gameData.memory,
              graphics: gameData.graphics,
              storage: gameData.storage,
              additionalNotes: gameData.additionalNotes,
              shortDescription: gameData.shortDescription,
              fullDescription: gameData.fullDescription,
              mediaUrls: fetchedMediaUrlStrings, // Store only the string URLs
              tags: gameData.tags.map(tag => tag.tagId),
              gameUrl: gameData.gameUrl,
              iconUrl: fetchedIconUrl, // Use the directly fetched iconUrl
              gameId: gameId,
            });
          }else{
            setFormData(response.data);
            const { requestId, ...cleanedData } = response.data;
            setFormData(cleanedData);
          }
          if(gameId){
            setSelectedTags(gameData.tags.map(tag => ({ value: tag.tagId, label: tag.tagName })));
          }else{
            const mappedSelectedTags = gameData.tags
              .map(tagIdFromGameData => {
                  // Tìm đối tượng tag đầy đủ từ bảng 'tags' cố định của bạn
                  const foundTag = tags.find(option => option.value === tagIdFromGameData);
                  // Trả về dạng { value, label } mà react-select cần
                  return foundTag ? { value: foundTag.value, label: foundTag.label } : null;
              })
              .filter(Boolean); // Lọc bỏ bất kỳ tag nào không tìm thấy (tránh lỗi)

            setSelectedTags(mappedSelectedTags);
          }

          // Set original media URLs and display them
          setOriginalMediaUrls(fetchedMediaUrlStrings); // Make sure this is also array of strings
          setArr(fetchedMediaUrlStrings); // Display existing media directly (array of strings)

          // Set original icon URL and display it (keeping your existing working logic)
          setOriginalIconUrl(fetchedIconUrl);
          setCroppedUrl(fetchedIconUrl);

          if (gameData.gameUrl) {
            setFileName(`Game ID: ${gameData.gameUrl.substring(0, 8)}...`);
          }

        } catch (error) {
          console.error("Error fetching game data:", error);
          alert("Failed to load game data. Please try again.");
          navigate("/");
        } finally {
          setLoadingGameData(false);
        }
      };
      fetchGameData();
    } else {
      setLoadingGameData(false);
    }
  }, [gameId, navigate]);


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
        [name]: value.slice(0, 32),
      }));
      return;
    }
    if (value.length > 1024 && (name === 'additionalNotes' || name === 'shortDescription')) {
      alert("1024 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 1024),
      }));
      return;
    }
    if (value.length > 10000 && name === 'fullDescription') {
      alert("10000 characters limit exceeded!");
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 10000),
      }));
      return;
    }
    if (parseFloat(value) > 1000 && name === 'price') {
      alert("Game price must be under or equals $1000!")
      setFormData(prev => ({
        ...prev,
        [name]: "",
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    setFiles(prev => [...prev, ...imageFiles]); // Add actual File objects for upload

    const mediaPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setArr(prev => [...prev, ...mediaPreviews]); // Add to arr for immediate preview
  }

  const handleSubmit = async () => {
    if(requestId){
      await axios.delete(`${import.meta.env.VITE_API_URL}/request/delete/${requestId}`);
    }
    for (const key in formData) {
      if (!validateEmty(formData.memory) || !validateEmty(formData.processor) || !validateEmty(formData.storage) ||
        !validateEmty(formData.graphics) || !validateEmty(formData.shortDescription) || !validateEmty(formData.fullDescription) ||
        !validateEmty(formData.gameName) || !validateEmty(formData.price.toString()) || !validateEmty(formData.os) ||
        !validateEmty(formData.gameUrl) || (!arr.length && !originalMediaUrls.length) || (!croppedUrl && !originalIconUrl)
      ) {
        alert(`Please fill in all required fields marked with (*).`);
        return;
      }
    }

    try {
      let finalMediaUrls = [...originalMediaUrls]; // This should now correctly hold string URLs
      let finalIconUrl = originalIconUrl; // This is working fine

      // Upload new media files if any
      if (files.length > 0) {
        const uploadImage = new FormData();
        files.forEach(file => uploadImage.append('files', file));
        const responseMedia = await axios.post(`${import.meta.env.VITE_API_URL}/request/image/upload`, uploadImage, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Assuming responseMedia.data.imageUrls is already an array of string URLs
        finalMediaUrls = [...finalMediaUrls, ...responseMedia.data.imageUrls];
      }

      // Icon upload logic (keeping it as is, since it works)
      if (croppedFile) {
        const croppedUpload = new FormData();
        croppedUpload.append('files', croppedFile);
        const croppedResponse = await axios.post(`${import.meta.env.VITE_API_URL}/request/image/upload`, croppedUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalIconUrl = croppedResponse.data.imageUrls[0];
      } else if (originalIconUrl && !croppedUrl) {
         finalIconUrl = '';
      }


      const payload = {
        ...formData,
        mediaUrls: finalMediaUrls, // This should now correctly send string URLs
        iconUrl: finalIconUrl,
        gameId: gameId||formData.gameId,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/request/game/add`, payload);

      console.log(response);
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit game data. Please check the console for details.");
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
      console.error("Error deleting file:", error);
    }
  }

  const handleGameUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploadProgress(0);
    setUploadSpeed(0);
    setTimeRemaining(null);

    const startTime = Date.now();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/request/file/upload`,
        new URLSearchParams({
          fileName: selectedFile.name,
          contentType: selectedFile.type
        })
      );

      const { uploadUrl, fileId, fileName: uploadedFileName } = response.data;

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

          setFileName(uploadedFileName);
          console.log("Uploaded successfully:", { fileId, uploadedFileName });
        } else {
          console.error("Upload failed with status:", xhr.status);
          alert("Game file upload failed. Please try again.");
        }
      };

      xhr.onerror = () => {
        console.error("Upload failed due to network or CORS.");
        alert("Game file upload failed due to network error. Please check your connection.");
      };

      xhr.send(selectedFile);
    } catch (error) {
      console.error("Upload setup failed:", error);
      alert("Failed to get upload URL for game file. Please try again.");
    }
  };


  const handleCancel = async () => {
    if (!gameId && formData.gameUrl !== '') {
      await handleDelete();
    }
    navigate("/");
  }

  const normalizeValue = async (e) => {
    const { name, value } = e.target;
    if (name === 'gameName') {
      if (!gameId || (gameId && value !== formData.gameName)) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/game/exist/check`, { params: { gameName: value } });
        console.log(response.data.message)
        console.log(response.data.debug)
        if (response.data.message === true) {
          alert('Game name already exists!');
          setFormData(prev => ({ ...prev, [name]: '' }));
          return;
        }
      }
    }
    setFormData(prev => ({ ...prev, [name]: trimValue(value) }));
  }

  const handleRemove = (indexToRemove) => {
    const removedItemUrl = arr[indexToRemove];

    // Check if it's a Blob URL created from a new file (starts with 'blob:')
    if (removedItemUrl.startsWith('blob:')) {
      URL.revokeObjectURL(removedItemUrl); // Revoke to prevent memory leak
      // If `files` only contains the actual File objects, this removal is tricky.
      // If `files` stores {file, previewUrl}, then this would be easier.
      // For now, if you are not using the more robust `handleFileSelect` from previous answers,
      // `setFiles` might need to be adjusted or kept as is if its internal order matches.
      // A simple filter might remove the wrong file if `files` and `arr` get out of sync due to originalMediaUrls.
    } else {
      // It's an original, already uploaded URL. Remove it from originalMediaUrls.
      setOriginalMediaUrls(prev => prev.filter(url => url !== removedItemUrl));
    }

    // Always remove from the display array
    setArr(prev => prev.filter((_, i) => i !== indexToRemove));
  };


  const handleChangeTags = (selectedOptions) => {
    const tagIds = selectedOptions ? selectedOptions.map((tag) => tag.value) : [];
    setFormData(prev => ({ ...prev, tags: tagIds }));
    setSelectedTags(selectedOptions || []);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    setCroppedUrl(null);
    setCroppedFile(null);
  };

  const confirmCrop = () => {
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    if (!completedCrop || !image) {
      return;
    }

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
      setImageSrc(null);

      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
      setCroppedFile(file);
    }, 'image/jpeg');
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: '%',
      x: (100 - (100 * crop.width) / width) / 2,
      y: (100 - (100 * crop.height) / height) / 2,
      width: crop.width,
      height: crop.height,
    });
  };

  return (
    <>
      <div className='form-border' style={{ width: '60%', marginTop: '5%', marginBottom: '5%' }}>
        <h1>{gameId ? 'Update Game Application' : 'Game Application'}</h1>
        <div className='game-mandatory-information'>
          <div className='game-icon' style={{ margin: '0 auto' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            {!loadingGameData && !imageSrc && !croppedUrl && (
              <Button
                label="+"
                color="grey-button"
                onClick={() => fileInputRef.current.click()}
              />
            )}

            {imageSrc && (
              <div>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    src={imageSrc}
                    onLoad={onImageLoad}
                    ref={imgRef}
                    alt="Crop me"
                  />
                </ReactCrop>
                <br />
                {completedCrop && (
                  <button onClick={confirmCrop}>Confirm Crop</button>
                )}
              </div>
            )}

            {!imageSrc && croppedUrl && (
              <img
                className='final-cropped'
                src={croppedUrl}
                alt="Final result"
                style={{ cursor: 'pointer', maxWidth: '250px' }}
                onClick={() => fileInputRef.current.click()}
              />
            )}
          </div>
          {!imageSrc && (
            <div className='name-price'>
              Name(*)
              <input type="text" name="gameName" id="" value={formData.gameName} onChange={handleChange} onClick={()=>{console.log(formData)}} readOnly />
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
                    {/* The `item` here MUST be a direct string URL */}
                    <img src={item} alt={`Game asset ${index}`} style={{ cursor: "pointer", width: "150px" }} />
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
          <Button className='send-button' label={gameId ? 'Update Request' : 'Send Request'} isApprove={'true'} onClick={handleSubmit} color='blue-button' />
        </div>
      </div>
    </>
  )
}

export default UpdateGame;