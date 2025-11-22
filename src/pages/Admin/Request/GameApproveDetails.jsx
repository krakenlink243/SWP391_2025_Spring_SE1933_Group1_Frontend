//@author: Vu Hoang
import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import '../../SendGameToAdmin.css'
import PartHeading from '../../../components/PartHeading/PartHeading'
import Button from '../../../components/Button/Button'
import axios from 'axios'
import { useParams } from 'react-router'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import "react-photo-view/dist/react-photo-view.css";
import { createNotification } from '../../../services/notification';
import Select, { components } from 'react-select'
import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom';
import { trimValue } from '../../../utils/validators'
import { useTranslation } from 'react-i18next'

function GameApproveDetails() {
  const { t } = useTranslation();
  const gameId = useParams().requestId;
  const [downloadLink, setDownloadLink] = useState('');
  const DropdownIndicator = () => null; // No dropdown arrow
  const MultiValueRemove = () => null; // No × icon on tags
  const IndicatorSeparator = () => null;
  const navigate = useNavigate();
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
    publisherName: '',
    publisherId: '',
    iconUrl:'',
    declineMessage:'',
    updateLog:'',
  })
  const tags = [
    { value: 18, label: t('Action') },
    { value: 17, label: t('Adventure') },
    { value: 29, label: t('Anime') },
    { value: 31, label: t('Casual') },
    { value: 12, label: t('Choices Matter') },
    { value: 4, label: t('Classic') },
    { value: 27, label: t('Co-op') },
    { value: 23, label: t('Crafting') },
    { value: 15, label: t('Exploration') },
    { value: 20, label: t('Fantasy') },
    { value: 28, label: t('FPS') },
    { value: 16, label: t('Free to Play') },
    { value: 10, label: t('Great Soundtrack') },
    { value: 3, label: t('Historical') },
    { value: 14, label: t('Horror') },
    { value: 8, label: t('Indie') },
    { value: 6, label: t('Multiplayer') },
    { value: 19, label: t('Open World') },
    { value: 11, label: t('Pixel Graphics') },
    { value: 25, label: t('Platformer') },
    { value: 26, label: t('Puzzle') },
    { value: 30, label: t('Racing') },
    { value: 7, label: t('RPG') },
    { value: 1, label: t('RTS') },
    { value: 21, label: t('Sci-fi') },
    { value: 24, label: 'Simulation' },
    { value: 5, label: t('Singleplayer') },
    { value: 9, label: t('Story Rich') },
    { value: 2, label: t('Strategy') },
    { value: 13, label: t('Surreal') },
    { value: 22, label: t('Survival') },
  ];
  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/details/${gameId}`);
        console.log(response.data);
        setFormData(response.data);
        // Get download link after formData is updated
        if (response.data.gameUrl) {
          try {
            const downloadResponse = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/file/download/${response.data.gameUrl}`);
            console.log(downloadResponse.data);
            setDownloadLink(downloadResponse.data);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    getGameDetails();

  }, [])
  useEffect(() => {
    const tagLabels = formData.tags.map(
      (val) => tags.find((tag) => tag.value === val)?.label || `Unknown (${val})`
    );
    console.log(tagLabels);
  }, [formData.tags]);
  const handleApprove = async () => {
    const confirmApprove = window.confirm(t('Are you sure you want to approve this game?'));
    if (!confirmApprove) {
      return;
    }
    try {
      const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/approve/${gameId}`);
      console.log(response.data);
      alert(t('Game Approved'));
      navigate("/admin/request/game");
    } catch (error) {
      console.log(error);
    }
  }
  const handleDecline = () => {
    let answer = '';

    confirmAlert({
      title: `Send answer to ${formData.publisherName}`,
      customUI: ({ onClose }) => (
        <div className="custom-ui">
          <h2>{t('Decline Game Request')}</h2>
          <p>{t('To')}: {formData.publisherName}</p>
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
                    formData.publisherId,
                    "Game Approval Response",
                    `Answer for ${formData.gameName}: ${answer}`
                  );
                  const response = await axios.patch(
                    `swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/reject/${gameId}`,
                    {
                      declineMessage:trimValue(answer)
                    }
                  );
                  console.log("Declined request:", response.data);
                  navigate("/admin/request/game");
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

  const handleGetLinkDownload = async () => {
    try {
      const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/file/download/${formData.gameUrl}`);
      console.log(response.data);
      setDownloadLink(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className='form-border'>
        <h1 >{t(`'s Game Application`, {publisherName: formData.publisherName})}</h1>
        <div className='game-mandatory-information'>
          <img className='game-avatar' src={formData.iconUrl} alt="" />
          <div className='name-price'>
            {t('Name(*)')}
            <input type="text" name="gameName" id="" value={formData.gameName} readOnly />
            {t('Price(*)')}
            <div>
              <input type="text" name="price" id="" value={'$'+formData.price} readOnly />
            </div>
            {t('Tags(*)')}
            <div className="tag-selector">
              <Select
                isMulti
                isDisabled
                options={tags}
                value={tags.filter(tag => formData.tags.includes(tag.value))}
                classNamePrefix="my-select"
                components={{ DropdownIndicator, MultiValueRemove, IndicatorSeparator }}
              />
            </div>
          </div>
        </div>
        <div className='sys-req'>
          <PartHeading content='System Requirements' />
          <div className='sys-req-col-container'>
            <div className='sys-req-col1'>
              {t('OS(*)')}
              <input type="text" name="os" id="" value={formData.os} readOnly />
              {t('Processor(*)')}
              <input type="text" name="processor" id="" value={formData.processor} readOnly />
              {t('Memory(*)')}
              <input type="text" name="memory" id="" value={formData.memory} readOnly />
            </div>
            <div className='sys-req-col2'>
              {t('Graphics(*)')}
              <input type="text" name="graphics" id="" value={formData.graphics} readOnly />
              {t('Storage(*)')}
              <input type="text" name="storage" id="" value={formData.storage} readOnly />
              {t('Additional Notes')}
              <textarea name="additionalNotes" id="" value={formData.additionalNotes} readOnly></textarea>
            </div>
          </div>
        </div>
        <div className='summary'>
          <PartHeading content='Summary' />
          <textarea name="shortDescription" id="" cols="30" rows="10" value={formData.shortDescription} readOnly></textarea>
        </div>
        <div className='summary'>
          <PartHeading content='Description' />
          <textarea name="fullDescription" id="" cols="30" rows="10" value={formData.fullDescription} readOnly></textarea>
        </div>
        <div className='game-assets'>
          <PartHeading content='Assets' />
          <div className='inner-image'>
            <PhotoProvider>
              {formData.mediaUrls.map((item, index) => (
                <PhotoView key={index} src={item}>
                  <img src={item} alt="" key={index} style={{ cursor: "pointer", width: "150px" }} />
                </PhotoView>
              ))}
            </PhotoProvider>
          </div>
        </div>
        <div className='game-file'>
          <PartHeading content='Files' />
          <a href={`${downloadLink}`}>
            <Button className='upload-button' label={t('Download Game File')} onClick={handleGetLinkDownload} color='blue-button'/>
          </a>
        </div>
        {formData.updateLog && (
          <div className='update-log'>
            <PartHeading content='Update Log' />
            <textarea name="updateLog" id="" value={formData.updateLog} readOnly></textarea>
          </div>
        )}
        {localStorage.getItem("role") !== "Publisher" && (
          <div className='send-request-cancel'>
            <Button className='cancel-button' label='Decline' onClick={handleDecline} color='red-button' />
            <Button className='send-button' label='Approve' isApprove='true' onClick={handleApprove} color='green-button' />
          </div>
        )}
        {localStorage.getItem("role") === "Publisher" && formData.declineMessage && (
          <div className='decline-reason'>
            <PartHeading content='Decline Reason' />
            <pre>{formData.declineMessage}</pre>
          </div>
        )}
      </div>
    </>
  )
}

export default GameApproveDetails
