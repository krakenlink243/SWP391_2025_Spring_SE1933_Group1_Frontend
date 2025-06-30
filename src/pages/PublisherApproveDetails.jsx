// hoangvq
import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router'
import { CountryDropdown } from 'react-country-region-selector'
import Button from '../components/Button/Button'
import { trimValue } from '../utils/validators'
import ImageUploading from 'react-images-uploading'
import './ApplyToPublisher.css'
import axios from 'axios'
function PublisherApproveDetails() {
  const publisherId = useParams().publisherId
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
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/request/publisher/details/${publisherId}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching publisher data:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleApprove = async (requestId) => {
    try {
      const response = await axios.patch(`http://localhost:8080/request/publisher/approve/${requestId}`);
      console.log("Approved request:", response.data);
      alert("Publisher Approved")
      window.location.href=`/approvepublisher/`
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };
  const handleDecline = async (requestId) =>{
    try {
      const response = await axios.patch(`http://localhost:8080/request/publisher/reject/${requestId}`);
      console.log("Approved request:", response.data);
      alert("Publisher Declined")
      window.location.href=`/approvepublisher/`
    } catch (err) {
      console.error("Error approving request:", err);
    }
  }
  return (
    <>
    <div className='apply-publisher-title'><h1>Publisher Application</h1></div>
    <div className='apply-publisher-container'>
      <div className='publisher-info'>
        Legal Name
        <input type="text" name="legalName" value={formData.legalName} readOnly/>
        Publisher Name
        <input type="text" name="publisherName" id=""  value={formData.publisherName} readOnly />
        Address
        <input type="text" name='address' readOnly value={formData.address}  />
        Social ID
        <input type="number" name="socialNumber" id=""  value={formData.socialNumber} readOnly/>
        Country      
        <input type="text" name="country" id="" value={formData.country} readOnly />
        <div className="publisher-button">
          <Button label="Decline" color="grey-button" onClick={()=>handleDecline(publisherId)} />
          <Button label="Approve" color="blue-button" onClick={()=>handleApprove(publisherId)} />
        </div>
      </div>
      <div className="publisher-image">
        <img src={formData.imageUrl} alt="preview" style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
      </div>
    </div>
    </>
  )
}

export default PublisherApproveDetails
