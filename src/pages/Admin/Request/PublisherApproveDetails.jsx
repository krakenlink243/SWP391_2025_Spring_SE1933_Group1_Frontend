// hoangvq
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { CountryDropdown } from 'react-country-region-selector'
import Button from '../../../components/Button/Button'
import { trimValue } from '../../../utils/validators'
import ImageUploading from 'react-images-uploading'
import '../../ApplyToPublisher.css'
import axios from 'axios'
import { createNotification } from '../../../services/notification'
import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

function PublisherApproveDetails() {
  const { t } = useTranslation();
  const publisherId = useParams().requestId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    {
      legalName: "",
      publisherName: "",
      address: "",
      socialNumber: "",
      country: "",
      imageUrl: "",
      userId: "",
      userName: "",
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
    const confirmApprove = window.confirm(t('Are you sure you want to approve this publisher?'));
    if (!confirmApprove) {
      return;
    }
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/approve/${requestId}`);
      console.log("Approved request:", response.data);
      alert(t('Publisher Approved'))
      navigate("/admin/request/publisher");
      
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };
  const handleDecline = (requestId) => {
    let answer = '';

    confirmAlert({
      title: `Send answer to ${formData.legalName} (${publisherId})`,
      customUI: ({ onClose }) => (
        <div className="custom-ui">
          <h2>{t('Decline Publisher Request')}</h2>
          <p>{t('Answer for')}: {formData.userName}</p>
          <textarea
            rows={5}
            style={{ width: '100%', marginBottom: '1rem' }}
            onChange={(e) => (answer = e.target.value)}
            placeholder={t('Type your decline reason...')}
          />
          <button className="blue-button"
            onClick={async () => {
              if (answer.trim() !== '') {
                try {
                  createNotification(
                    formData.userId,
                    "Publisher Apply Response",
                    `Answer for your publisher apply ${formData.publisherName}: ${answer}`
                  );
                  const response = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/request/publisher/reject/${requestId}`
                  );
                  console.log("Declined request:", response.data);
                  navigate("/admin/request/publisher");
                } catch (err) {
                  console.error("Error declining request:", err);
                }
                onClose();
              } else {
                alert(t('Please enter answer'));
              }
            }}
          >
            {t('Submit')}
          </button>
        </div>
      )
    });
  };

  return (
    <>
      <div className='apply-publisher-title'>
        <h1>{t('Publisher Application')}</h1>
        <div className='apply-publisher-container'>
          <div className='publisher-info'>
            {t('Legal Name')}
            <input type="text" name="legalName" value={formData.legalName} readOnly />
            {t('Publisher Name')}
            <input type="text" name="publisherName" id="" value={formData.publisherName} readOnly />
            {t('Address')}
            <input type="text" name='address' readOnly value={formData.address} />
            {t('Social ID')}
            <input type="number" name="socialNumber" id="" value={formData.socialNumber} readOnly />
            {t('Country')}
            <input type="text" name="country" id="" value={formData.country} readOnly />
            <div className="publisher-button">
              <Button label={t('Decline')} color="red-button" onClick={() => handleDecline(publisherId)} />
              <Button label={t('Approve')} color="green-button" onClick={() => handleApprove(publisherId)} />
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
