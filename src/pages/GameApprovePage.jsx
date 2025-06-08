import React from 'react'
import { useState,useRef,useEffect } from'react'
import axios from 'axios';
import RequestItem from '../components/RequestItem/RequestItem'
function GameApprovePage() {
    const [loadedRequest,setLoadedRequest] = useState([]);
    const [isChecked,setIsChecked] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/admin/gameRequest/${page}`);
            setLoadedRequest(response.data.content);
            console.log(response.data);
          } catch (err) {
            console.error("Error fetching data:", err);
          }
        };
        fetchData();
      }, [page]);
    
      const handleApprove = async(e) =>{
        
      }
      
    
    
    
  return (
    <div>
      {loadedRequest.map((request,index) => (
      <RequestItem 
        key={index} 
        requestName={request.gameName} 
        isChecked={isChecked}  
        onApprove={() => console.log("Approved:", request.id)} 
        onDecline={() => console.log("Declined:", request.id)} 
      />
    ))}
    </div>
  )
}

export default GameApprovePage
