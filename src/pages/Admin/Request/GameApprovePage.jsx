//@author: Vu Hoang
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import RequestItem from '../../../components/RequestItem/RequestItem'
import './GameApprovePage.css'
import { confirmAlert } from 'react-confirm-alert';
import { createNotification } from '../../../services/notification';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trimValue } from '../../../utils/validators';
function GameApprovePage() {
  const [totalPages, setTotalPages] = useState(1);
  const [loadedRequest, setLoadedRequest] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchData = async () => {
    try {
      const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/${page}`);
      setLoadedRequest(response.data.content);
      console.log(response.data.content)
      setTotalPages(response.data.totalPages);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };


  useEffect(() => {
    fetchData();
  }, [page]);

  const handleApprove = async (requestId) => {
    const confirmApprove = window.confirm(t('Are you sure you want to approve this game?'));
    if (!confirmApprove) {
      return;
    }
    try {
      const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/approve/${requestId}`);
      console.log("Approved request:", response.data);
      alert(t('Game Approved'))
      fetchData();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };
  const handleDecline = (requestId, publisherName, publiserId, gameName) => {
    let answer = '';

    confirmAlert({
      title: `Decline Game Request`,
      customUI: ({ onClose }) => (
        <div className="custom-ui">
          <h2>{t('Decline Game')}</h2>
          <p>{t('To')}:{publisherName}</p>
          <textarea
            rows={5}
            style={{ width: '100%', marginBottom: '1rem' }}
            onChange={(e) => (answer = e.target.value)}
            placeholder={t('Reason for declining...')}
          />
          <button className="blue-button"
            onClick={async () => {
              if (answer.trim() !== '') {
                try {
                  // Send notification
                  createNotification(
                    publiserId,
                    "Game Approval Response",
                    `Answer for ${gameName}: ${answer}`
                  );
                  // Reject the request via API
                  const response = await axios.patch(
                    `swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/reject/${requestId}`,{
                      declineMessage:trimValue(answer)
                    }
                  );
                  console.log("Declined request:", response.data);
                  alert(t('Game Declined'));
                  fetchData(); // Refresh UI
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

  const handleCheckChange = (requestId) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)  // ✅ Uncheck: Remove from array
        : [...prev, requestId]  // ✅ Check: Add to array
    );
    console.log("Updated Tick Array:", selectedRequests);
  };
  const handleTick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    // ✅ If selecting all, add all IDs to selectedRequests
    // ✅ If deselecting all, clear the array
    setSelectedRequests(newCheckedState ? loadedRequest.map(req => req.requestId) : []);
    console.log("Updated Tick Array:", selectedRequests);
  };
  const handleApproveSelected = async () => {
    console.log("ook")
    const confirmApprove = window.confirm(t('Are you sure you want to approve these selected games?'));
    if (!confirmApprove) {
      return;
    }
    try {
      for (let i = 0; i < selectedRequests.length; i++) {
        const requestId = selectedRequests[i];
        const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/approve/${requestId}`);
        console.log(`Processed approve for request ID:`, requestId);
      }
      alert(t('All selected requests have been approved'));
      setSelectedRequests([]); // Clear selection after processing
      fetchData(); // Refresh data
    } catch (err) {
      console.error(`Error during approve:`, err);
    }
  };
  const handleDeclineSelected = async () => {
    console.log("ook")
    try {
      for (let i = 0; i < selectedRequests.length; i++) {
        const requestId = selectedRequests[i];
        const response = await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/reject/${requestId}`);
        console.log(`Processed approve for request ID:`, requestId);
      }
      alert(t('All selected requests have been declined'));
      setSelectedRequests([]);
      fetchData();
    } catch (err) {
      console.error(`Error during approve:`, err);
    }
  };
  const handleRedirect = (requestId) => {

    // Adjust by Phan NT Son - fix redirect URL
    navigate(`detail/${requestId}`);
  }


  return (
    <div className='game-approve-container'>
      {loadedRequest.length > 0 ? (
        <div className='request-items' style={{ backgroundColor: "#1B2838" }}>
          <img
            src={isChecked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
            alt="Checkbox"
            onClick={handleTick}
          />
          <div>{t('Game Title')}</div>
          <div>{t('From')}</div>
          <div>{t('Date')}</div>
          <div>
            <img src="/icons/Approve.png" alt="" onClick={handleApproveSelected} />
            {/* <img src="/icons/Decline.png" alt="" onClick={handleDeclineSelected} /> */}
          </div>
        </div>
      ) : (<p>{t('There is no game pending for approve at this time')}</p>)}
      {loadedRequest.map((request) => (
        <RequestItem
          key={request.requestId}
          requestId={request.requestId}
          requestName={request.gameName}
          from={request.publisherName}
          date={request.sendDate}
          onApprove={() => handleApprove(request.requestId)}
          onDecline={() => handleDecline(request.requestId, request.publisherName, request.publisherId, request.gameName)}
          onCheckChange={handleCheckChange}
          isTicked={selectedRequests.includes(request.requestId)}
          onClicked={() => handleRedirect(request.requestId)}
        />
      ))}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={page === index ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GameApprovePage
