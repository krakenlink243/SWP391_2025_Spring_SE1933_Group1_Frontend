//@author: Vu Hoang
import React from 'react'
import { useState,useRef,useEffect } from'react'
import axios from 'axios';
import RequestItem from '../../components/RequestItem/RequestItem'
import './GameApprovePage.css'
function GameApprovePage() {
    const [totalPages, setTotalPages] = useState(1);
    const [loadedRequest,setLoadedRequest] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [isChecked,setIsChecked] = useState(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/request/game/${page}`);
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
        try {
          const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/game/approve/${requestId}`);
          console.log("Approved request:", response.data);
          alert("Game Approved")
          fetchData();
        } catch (err) {
          console.error("Error approving request:", err);
        }
      };
      const handleDecline = async (requestId) =>{
        try {
          const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/game/reject/${requestId}`);
          console.log("Approved request:", response.data);
          alert("Game Declined")
          fetchData();
        } catch (err) {
          console.error("Error approving request:", err);
        }
      }
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
        try {
            for (let i = 0; i < selectedRequests.length; i++) {
                const requestId = selectedRequests[i];
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/game/approve/${requestId}`);
                console.log(`Processed approve for request ID:`, requestId);
            }
            alert(`All selected requests have been approved`);
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
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/request/game/reject/${requestId}`);
                console.log(`Processed approve for request ID:`, requestId);
            }
            alert(`All selected requests have been declined`);
            setSelectedRequests([]);
            fetchData();
        } catch (err) {
            console.error(`Error during approve:`, err);
        }
      };
      const handleRedirect = (requestId) =>{
        
        // Adjust by Phan NT Son - fix redirect URL
        window.location.href=`/aprrovegame/${requestId}` 
      }
  

  return (
    <div className='game-approve-container'>
      <div>
        <div style={{cursor:"pointer",textDecoration:"underline",textUnderlineOffset:"5px"}} onClick={()=>{window.location.href=`/aprrovegame`}}>Game Request</div>
        <div style={{cursor:"pointer"}} onClick={()=>{window.location.href=`/approvepublisher`}}>Publisher Request</div>
        <div style={{cursor:"pointer"}} onClick={()=>{window.location.href=``}}>Review Report</div>
        <div style={{cursor:"pointer"}} onClick={()=>{window.location.href=`/approvefeedback`}}>Feedback</div>
      </div>
      {loadedRequest.length > 0 ? (
        <div className='request-item' style={{ backgroundColor: "#1B2838" }}>
          <img
            src={isChecked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
            alt="Checkbox"
            onClick={handleTick}
          />
          <div>
            <img src="/icons/Approve.png" alt="" onClick={handleApproveSelected} />
            <img src="/icons/Decline.png" alt="" onClick={handleDeclineSelected} />
          </div>
        </div>
      ) : (<p>There is no game pending for approve at this time</p>)}
      {loadedRequest.map((request) => (
      <RequestItem 
        key={request.requestId} 
        requestId={request.requestId}
        requestName={request.gameName} 
        onApprove={() => handleApprove(request.requestId)} 
        onDecline={() => handleDecline(request.requestId)} 
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
