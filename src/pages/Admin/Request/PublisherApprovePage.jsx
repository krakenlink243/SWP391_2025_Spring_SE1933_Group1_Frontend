//@author: Vu Hoang
import React from 'react'
import { useState,useRef,useEffect } from'react'
import axios from 'axios';
import RequestItem from '../../../components/RequestItem/RequestItem'
import './GameApprovePage.css'
import { confirmAlert } from 'react-confirm-alert';
import { createNotification } from '../../../services/notification';
function PublisherApprovePage() {
    const [totalPages, setTotalPages] = useState(1);
    const [loadedRequest,setLoadedRequest] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [isChecked,setIsChecked] = useState(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/publisher/${page}`);
        setLoadedRequest(response.data.content);
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
        const confirmApprove = window.confirm("Are you sure you want to approve this publisher?");
        if (!confirmApprove) {
          return;
        }
        try {
          const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/approve/${requestId}`);
          console.log("Approved request:", response.data);
          alert("Publisher Approved")
          fetchData();
        } catch (err) {
          console.error("Error approving request:", err);
        }
      };
      const handleDecline = (requestId,userId,userName,publisherName) => {
        let answer = '';

        confirmAlert({
          title: `Decline Publisher Request`,
          customUI: ({ onClose }) => (
            <div className="custom-ui">
              <h2>Decline Publisher</h2>
              <p>Answer for: {userName}</p>
              <textarea
                rows={5}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={(e) => (answer = e.target.value)}
                placeholder="Reason for declining..."
              />
              <button className="blue-button"
                onClick={async () => {
                  if (answer.trim() !== '') {
                    try {
                      // Send notification
                      createNotification(
                        userId,
                        "Publisher Apply Response",
                        `Answer for your publisher apply ${publisherName}: ${answer}`
                      );

                      // API call to reject request
                      const response = await axios.patch(
                        `${import.meta.env.VITE_API_URL}/request/publisher/reject/${requestId}`
                      );
                      console.log("Declined request:", response.data);

                      alert("Publisher Declined");
                      fetchData(); // Refresh list
                    } catch (err) {
                      console.error("Error declining request:", err);
                    }
                    onClose();
                  } else {
                    alert("Please enter answer");
                  }
                }}
              >
                Submit
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
        const confirmApprove = window.confirm("Are you sure you want to approve these publishers?");
        if (!confirmApprove) {
          return;
        }
        try {
            for (let i = 0; i < selectedRequests.length; i++) {
                const requestId = selectedRequests[i];
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/approve/${requestId}`);
                console.log(`Processed approve for request ID:`, requestId);
            }
            alert(`All selected publishers have been approved`);
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
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/publisher/reject/${requestId}`);
                console.log(`Processed approve for request ID:`, requestId);
            }
            alert(`All selected publishers have been declined`);
            setSelectedRequests([]);
            fetchData();
        } catch (err) {
            console.error(`Error during approve:`, err);
        }
      };
      const handleRedirect = (requestId) =>{
        window.location.href=`/approvepublisher/${requestId}`
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
          <div>Publisher Name</div>
          <div>From</div>
          <div>Date</div>
          <div>
            <img src="/icons/Approve.png" alt="" onClick={handleApproveSelected} />
          </div>
        </div>
      ) : (<p>There is no one want to be publisher at this time🥹</p>)}
      {loadedRequest.map((request) => (
      <RequestItem 
        key={request.requestId} 
        requestId={request.requestId}
        requestName={request.publisherName} 
        from={request.username}
        date={request.createdDate}
        onApprove={() => handleApprove(request.requestId)} 
        onDecline={() => handleDecline(request.requestId,request.userId,request.username,request.publisherName)} 
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

export default PublisherApprovePage
