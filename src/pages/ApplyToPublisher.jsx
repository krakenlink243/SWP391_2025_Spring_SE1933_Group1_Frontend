import React from 'react'
import { useState } from 'react'
import { CountryDropdown } from 'react-country-region-selector'
import Button from '../components/Button/Button'
import { trimValue } from '../utils/validators'
import ImageUploading from 'react-images-uploading'
import './ApplyToPublisher.css'
import axios from 'axios'
import { validateEmty } from '../utils/validators'
function ApplyToPublisher() {
  const [formData,setFormData] = useState(
    {
      legalName:"",
      publisherName:"",
      address:"",
      socialNumber:"",
      country:"",
      imageUrl:""
    }
  )
  const [image, setImage] = useState(null);
  const handleChange = (e) =>{
    const{name,value} = e.target;
    console.log(formData.legalName)
    if(name === 'socialNumber' && value.length > 12){
      alert("12 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0,12) , // Truncate without trimming spaces
      }));
      return;
    }else if(name === 'socialNumber' && value[0] === '-'){
      alert("Social ID must be a positive number!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(1,12) , // Truncate without trimming spaces
      }));
      return;
    }
    if(value.length > 64){
      alert("64 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0,64) , // Truncate without trimming spaces
      }));
      return;
    }else
    {
      setFormData(prev => ({
        ...prev,
        [name]: value, 
      }));
      return;
    }
    
  }
  const normalizeValue = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'legalName' 
        ? value.trim().split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(" ") // Join back into a full name
        : trimValue(value) // Apply normal trimming for other fields
    }));
  };
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }
    if(!validateEmty(formData.legalName) || !validateEmty(formData.publisherName) || !validateEmty(formData.address) || !validateEmty(formData.socialNumber) || !validateEmty(formData.country)){
      alert("Please fill in all fields!");
      return;
    }
    const imgData = new FormData();
    imgData.append("files", image.file); // Use actual file object
  
    try {
      const res = await axios.post("http://localhost:8080/publisher/uploadImage", imgData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded image URL:", res.data);
      setFormData(prev => ({...prev,imageUrl: res.data.imageUrls}));
      const response = await axios.post('http://localhost:8080/users/sendpublisher',{...formData,imageUrl:res.data.imageUrls[0]});
      console.log(response.data)
      alert(response.data.message)
      window.location.href = '/';
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };
  const handleCancel = () =>{
    window.location.href = '/';
  }
  return (
    <>
    <div className='apply-publisher-title'><h1>Publisher Application</h1></div>
    <div className='apply-publisher-container'>
      <div className='publisher-info'>
        Legal Name
        <input type="text" name="legalName" id="" onChange={handleChange} value={formData.legalName} onBlur={normalizeValue}/>
        Publisher Name
        <input type="text" name="publisherName" id="" onChange={handleChange} value={formData.publisherName} onBlur={normalizeValue} />
        Address
        <input type="text" name='address' onChange={handleChange} value={formData.address} onBlur={normalizeValue} />
        Social ID
        <input type="number" name="socialNumber" id="" onChange={handleChange} value={formData.socialNumber}/>
        Country      
        <CountryDropdown value={formData.country} onChange={(e) => setFormData(prev => ({...prev,country:e}))}></CountryDropdown>
        <div className="publisher-button">
          <Button label="Cancel" color="grey-button" onClick={handleCancel} />
          <Button label="Apply" color="blue-button" onClick={handleUpload} />
        </div>
      </div>
      <div className="publisher-image">
        <ImageUploading value={image ? [image] : []} onChange={(list) => setImage(list[0])} dataURLKey="data_url">
        {({ onImageUpload }) => (
          <div onClick={onImageUpload} style={{ cursor: "pointer" }}>
          {image ? (
            <img src={image.data_url} alt="preview" style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
          ) : (
            <Button label="+" color="grey-button"/>
          )}
          </div>
        )}
        </ImageUploading>
      </div>
    </div>
    </>
  )
}

export default ApplyToPublisher
