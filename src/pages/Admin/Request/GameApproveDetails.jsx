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

function GameApproveDetails() {
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
    iconUrl:''
  })
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
  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/game/details/${gameId}`);
        console.log(response.data);
        setFormData(response.data);
        // Get download link after formData is updated
        if (response.data.gameUrl) {
          try {
            const downloadResponse = await axios.get(`${import.meta.env.VITE_API_URL}/request/file/download/${response.data.gameUrl}`);
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
    const confirmApprove = window.confirm("Are you sure you want to approve this game?");
    if (!confirmApprove) {
      return;
    }
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/game/approve/${gameId}`);
      console.log(response.data);
      alert("Game Approved");
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
          <h2>Decline Game Request</h2>
          <p>To: {formData.publisherName}</p>
          <textarea
            rows={5}
            style={{ width: '100%', marginBottom: '1rem' }}
            onChange={(e) => (answer = e.target.value)}
            placeholder="Type your decline reason..."
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
                    `${import.meta.env.VITE_API_URL}/request/game/reject/${gameId}`
                  );
                  console.log("Declined request:", response.data);
                  navigate("/admin/request/game");
                } catch (err) {
                  console.error("Error declining request:", err);
                }
                onClose();
              } else {
                alert('Please enter answer');
              }
            }}
          >
            Submit
          </button>
        </div>
      )
    });
  };

  const handleGetLinkDownload = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/file/download/${formData.gameUrl}`);
      console.log(response.data);
      setDownloadLink(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className='form-border'>
        <h1 >{formData.publisherName}'s  Game Application</h1>
        <div className='game-mandatory-information'>
          <img className='game-avatar' src={formData.iconUrl} alt="" />
          <div className='name-price'>
            Name(*)
            <input type="text" name="gameName" id="" value={formData.gameName} readOnly />
            Price(*)
            <div>
              <input type="text" name="price" id="" value={'$'+formData.price} readOnly />
            </div>
            Tags(*)
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
              OS(*)
              <input type="text" name="os" id="" value={formData.os} readOnly />
              Processor(*)
              <input type="text" name="processor" id="" value={formData.processor} readOnly />
              Memory(*)
              <input type="text" name="memory" id="" value={formData.memory} readOnly />
            </div>
            <div className='sys-req-col2'>
              Graphics(*)
              <input type="text" name="graphics" id="" value={formData.graphics} readOnly />
              Storage(*)
              <input type="text" name="storage" id="" value={formData.storage} readOnly />
              Additional Notes
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
            <Button className='upload-button' label="Download Game File" onClick={handleGetLinkDownload} color='blue-button'/>
          </a>
        </div>
        {localStorage.getItem("role") !== "Publisher" && (
          <div className='send-request-cancel'>
            <Button className='cancel-button' label='Decline' onClick={handleDecline} color='red-button' />
            <Button className='send-button' label='Approve' isApprove='true' onClick={handleApprove} color='green-button' />
          </div>
        )}
      </div>
    </>
  )
}

export default GameApproveDetails
