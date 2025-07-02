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
import { createNotification } from '../services/notification'
function PublisherApproveDetails() {
  const publisherId = useParams().publisherId
  const [formData,setFormData] = useState(
    {
      legalName:"",
      publisherName:"",
      address:"",
      socialNumber:"",
      country:"",
      imageUrl:"",
      userId:"",
    }
  )
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/publisher/details/${publisherId}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching publisher data:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleApprove = async (requestId) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this publisher?");
    if (!confirmApprove) {
      return;
    }
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/approve/${requestId}`);
      console.log("Approved request:", response.data);
      alert("Publisher Approved")
      window.location.href=`/approvepublisher/`
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };
  const handleDecline = async (requestId) =>{
    const answer = window.prompt("Send answer to" + " " + formData.legalName + publisherId)
      if(answer.trim() !== ""){
        try {
          createNotification(formData.userId,"Publisher Apply Response","Answer for your publisher apply "+formData.publisherName+": " + answer)
          const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/reject/${requestId}`);
          console.log("Approved request:", response.data)
        } catch (err) {
          console.error("Error approving request:", err);
        }
        window.location.href=`/approvepublisher`
      }else{
        alert('Please enter answer')
      }
  }
  return (
    <>
    <div className='apply-publisher-title'>
      <h1>Publisher Application</h1>
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
    </div>
    </>
  )
}

export default PublisherApproveDetails
