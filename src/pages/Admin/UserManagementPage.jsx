import { useState, useEffect } from "react";
import axios from 'axios';
import RequestItem from '../../components/RequestItem/RequestItem'
import './GameApprovePage.css'
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/banned-users/${page}`);
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

    };

    const handleDecline = async (requestId) => {

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

    };

    const handleDeclineSelected = async () => {

    };

    const handleRedirect = (requestId) => {
        // window.location.href = `/admin/approvegame/${requestId}`
    }


    return (
        <div className='game-approve-container'>
            <div>
                <div style={{ cursor: "pointer" }}>{t('Banned User')}</div>
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
                    key={request.userID}
                    requestId={request.userID}
                    requestName={request.username}
                    onApprove={() => handleApprove(request.userID)}
                    onDecline={() => handleDecline(request.userID)}
                    onCheckChange={handleCheckChange}
                    isTicked={selectedRequests.includes(request.userID)}
                    onClicked={() => handleRedirect(request.userID)}
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