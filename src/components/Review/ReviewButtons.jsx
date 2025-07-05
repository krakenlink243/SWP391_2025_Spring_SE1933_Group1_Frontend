import { useEffect, useState } from "react";
import { createNotification } from "../../services/notification";
import axios from "axios";
import './ReviewButtons.css';
import { useNavigate } from "react-router-dom";

/**
 * @author Phan NT Sons
 * @param {*} param0 
 * @returns 
 */
function ReviewButtons({ reivewHelpful, reivewNotHelpful, authorId, game }) {

    const [helpfulCount, setHelpfulCount] = useState(reivewHelpful);
    const [notHelpfulCount, setNotHelpfulCount] = useState(reivewNotHelpful);
    const [userOption, setUserOption] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const CUR_USERNAME = localStorage.getItem("username");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (CUR_USERNAME)
                await checkUserOption();
            setIsReady(true);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setHelpfulCount(reivewHelpful);
        setNotHelpfulCount(reivewNotHelpful);
    }, [reivewHelpful, reivewNotHelpful]);

    const checkUserOption = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/review/${game.gameId}/${authorId}/check`);
            const result = response.data;
            setUserOption(result === 1 ? 1 : result === -1 ? -1 : 0);
        } catch (error) {
            console.error("Error checking user option:", error);
        }
    };

    const handleVote = (isHelpful) => {
        if (!CUR_USERNAME) {
            navigate("login");
            return;
        }

        const PATHS = {
            HELPFUL: `${import.meta.env.VITE_API_URL}/review/vote/helpful`,
            NOT_HELPFUL: `${import.meta.env.VITE_API_URL}/review/vote/unhelpful`,
            CLEAN: `${import.meta.env.VITE_API_URL}/review/vote/clean`
        };


        const RESP_OK = "SUCCESS";

        if (userOption === 0) {
            const path = isHelpful ? PATHS.HELPFUL : PATHS.NOT_HELPFUL;
            const countSetter = isHelpful ? setHelpfulCount : setNotHelpfulCount;
            const newOption = isHelpful ? 1 : -1;

            countSetter(prev => prev + 1);
            setUserOption(newOption);

            axios.patch(path, { gameId: game.gameId, authorId }).then(resp => {
                if (resp.data === RESP_OK) {
                    const status = isHelpful ? "helpful" : "not helpful";
                    createNotification(authorId, "Community", `${CUR_USERNAME} vote your Review about ${game.name} ${status}`);
                }
            }).catch(err => {
                console.error("Error while voting:", err);
            });

        } else {
            if ((isHelpful === true && userOption === 1) || (isHelpful === false && userOption === -1)) {
                const countSetter = isHelpful ? setHelpfulCount : setNotHelpfulCount;
                countSetter(prev => prev - 1);
                setUserOption(0);

                axios.patch(PATHS.CLEAN, {
                    gameId: game.gameId,
                    authorId: authorId
                }).catch((err) => {
                    console.log("Error Internal Clean Vote. " + err);
                });
            }
        }

    }

    if (!isReady) {
        return <div className="btn-spinner"></div>;
    }

    return (
        <div className="vote-button">
            <div onClick={() => handleVote(true)} className={`${userOption === 1 ? 'active' : ''} cus-btn`}>
                {/* <p>Yes {helpfulCount}</p> */}
                <span>Yes {helpfulCount}</span>
            </div>
            <div onClick={() => handleVote(false)} className={`${userOption === -1 ? 'active' : ''} cus-btn`}>
                {/* <p>No {notHelpfulCount}</p> */}
                <span>No {notHelpfulCount}</span>
            </div>
        </div>
    );
}

export default ReviewButtons