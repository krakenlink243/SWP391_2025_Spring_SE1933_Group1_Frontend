import { useState, useEffect } from "react";
import axios from 'axios';
import RequestItem from '../components/RequestItem/RequestItem'
import './GameApprovePage.css'

/**
 * @author Phan NT Son
 * @description Mostly copy from Game Approve Page of @author HoangVube
 * @returns {JSX.Element} User Management Page component
 */
function UserManagementPage() {
    const [totalPages, setTotalPages] = useState(1);
    const [loadedRequest, setLoadedRequest] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/banned-users/${page}`);
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
        try {
            const response = await axios.patch(`http://localhost:8080/admin/approve/${requestId}`);
            console.log("Approved request:", response.data);
            alert("Game Approved")
            fetchData();
        } catch (err) {
            console.error("Error approving request:", err);
        }
    };

    const handleDecline = async (requestId) => {
        try {
            const response = await axios.patch(`http://localhost:8080/admin/reject/${requestId}`);
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
                const response = await axios.patch(`http://localhost:8080/admin/approve/${requestId}`);
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
                const response = await axios.patch(`http://localhost:8080/admin/reject/${requestId}`);
                console.log(`Processed approve for request ID:`, requestId);
            }
            alert(`All selected requests have been declined`);
            setSelectedRequests([]);
            fetchData();
        } catch (err) {
            console.error(`Error during approve:`, err);
        }
    };
    const handleRedirect = (requestId) => {
        window.location.href = `/aprrovegame/${requestId}`
    }


    return (
        <div className='game-approve-container'>
            <div>
                <div style={{ cursor: "pointer" }}>Banned User</div>
            </div>
            <div className='request-item' style={{ backgroundColor: "#1B2438" }}>
                <img
                    src={isChecked ? "/icons/Approve.png" : "/icons/Checkbox.png"}
                    alt="Checkbox"
                    onClick={handleTick}
                />
                
            </div>
            {loadedRequest.map((request) => (
                <RequestItem
                    key={request.UserID}
                    requestId={request.UserID}
                    requestName={request.username}
                    onApprove={() => handleApprove(request.UserID)}
                    onDecline={() => handleDecline(request.UserID)}
                    onCheckChange={handleCheckChange}
                    isTicked={selectedRequests.includes(request.UserID)}
                    onClicked={() => handleRedirect(request.UserID)}
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
export default UserManagementPage;