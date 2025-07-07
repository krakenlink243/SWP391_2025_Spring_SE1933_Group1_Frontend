// hoangvq
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CountryDropdown } from 'react-country-region-selector'
import Button from '../components/Button/Button'
import { trimValue } from '../utils/validators'
import ImageUploading from 'react-images-uploading'
import './ApplyToPublisher.css'
import axios from 'axios'
import { validateEmty } from '../utils/validators'

function ApplyToPublisher() {
  const publisherId = localStorage.getItem('userId')
  const [formData, setFormData] = useState(
    {
      legalName: "",
      publisherName: "",
      address: "",
      socialNumber: "",
      country: "",
      imageUrl: ""
    }
  )
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (publisherId)
      fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/publisher/user/details/${publisherId}`);
      setFormData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching publisher data:", error);
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData.legalName)
    if (name === 'socialNumber' && value.length > 12) {
      alert("12 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 12), // Truncate without trimming spaces
      }));
      return;
    } else if (name === 'socialNumber' && value[0] === '-') {
      alert("Social ID must be a positive number!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(1, 12), // Truncate without trimming spaces
      }));
      return;
    }
    if (value.length > 64) {
      alert("64 characters limit exceeded!")
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 64), // Truncate without trimming spaces
      }));
      return;
    } else {
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
    if (!image && !formData.imageUrl) {

      alert("Please select an image first!");
      return;
    }
    if (!validateEmty(formData.legalName) || !validateEmty(formData.publisherName) || !validateEmty(formData.address) || !validateEmty(formData.socialNumber) || !validateEmty(formData.country)) {
      alert("Please fill in all fields!");
      return;
    }
    const confirmSubmit = window.confirm("Are you sure you want to submit this application?");
    if (!confirmSubmit) {
      return;
    }
    try {
      if (image) {
        const imgData = new FormData();
        imgData.append("files", image.file); // Use actual file object
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/request/image/upload`, imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Uploaded image URL:", res.data);
        setFormData(prev => ({ ...prev, imageUrl: res.data.imageUrls }));
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/request/publisher/send`, { ...formData, imageUrl: res.data.imageUrls[0] });
        alert(response.data.message)
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/request/publisher/send`, formData);
        alert(response.data.message)
      }
      navigate("/");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };
  const handleCancel = () => {
    navigate("/");
  }
  return (
    <>
      <div className='apply-publisher-title'>
        <h1>Publisher Application</h1>
        <div className='apply-publisher-container'>
          <div className='publisher-info'>
            Legal Name(*)
            <input type="text" name="legalName" id="" onChange={handleChange} value={formData.legalName} onBlur={normalizeValue} />
            Publisher Name(*)
            <input type="text" name="publisherName" id="" onChange={handleChange} value={formData.publisherName} onBlur={normalizeValue} />
            Address(*)
            <input type="text" name='address' onChange={handleChange} value={formData.address} onBlur={normalizeValue} />
            Social ID(*)
            <input type="number" name="socialNumber" id="" onChange={handleChange} value={formData.socialNumber} />
            Country(*)
            <CountryDropdown value={formData.country} onChange={(e) => setFormData(prev => ({ ...prev, country: e }))}></CountryDropdown>
            <div className="publisher-button">
              <Button label="Cancel" color="grey-button" onClick={handleCancel} />
              <Button label="Apply" color="blue-button" onClick={handleUpload} />
            </div>
          </div>
          <div className="publisher-image">
            <ImageUploading value={image ? [image] : []} onChange={(list) => setImage(list[0])} dataURLKey="data_url">
              {({ onImageUpload }) => (
                <div onClick={onImageUpload} style={{ cursor: "pointer" }}>
                  {image?.data_url ? (
                    <img
                      src={image.data_url}
                      alt="preview"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  ) : formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  ) : (
                    <Button label="+" color="grey-button" />
                  )}
                </div>
              )}
            </ImageUploading>
          </div>
        </div>
      </div>
    </>
  )
}
export default ApplyToPublisher
