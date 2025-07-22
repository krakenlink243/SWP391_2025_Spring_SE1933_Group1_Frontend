import { useState, useEffect } from 'react';
import axios from 'axios';
import './MostRecommend.css'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function MostRecommend() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [chunkedSlides, setChunkedSlides] = useState([]);

    const handleGetNewPublish = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/game/most-rated`)
            .then((resp) => {
                console.log("Fetched games:", resp.data.data);
                setGames(resp.data.data)
            })
            .catch((err) => console.log("Error: ", err));
    }

    useEffect(() => {
        handleGetNewPublish();
    }, [])

    useEffect(() => {
        setChunkedSlides(divideGames(games));

    }, [games])



    const divideGames = (games) => {
        if (games.length === 16) {
            const first4 = games.slice(0, 4);
            const second4 = games.slice(4, 8);
            const last8 = games.slice(8, 16);
            const last8Split = [last8.slice(0, 4), last8.slice(4, 8)];
            return [first4, second4, last8Split];
        }

        // fallback: chia từng 4 game 1 slide
        const fallback = [];
        for (let i = 0; i < games.length; i += 4) {
            fallback.push(games.slice(i, i + 4));
        }

        return fallback;
    };




    return (
        <div className='most-recommend-container'>
            <div className='title'>Most Recommend Games</div>
            <div className="conent-hub-carousel">
                <div id="mostRecommend" className="carousel-container carousel-fade carousel slide" data-ride="false" data-pause="true">
                    <div className="carousel-items carousel-inner">
                        {chunkedSlides.map((group, index) => (
                            <div
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                key={index}
                            >
                                <div className="d-flex justify-content-around">
                                    {Array.isArray(group[0]) ? ( // slide cuối (8 games, 2 hàng)
                                        group.map((row, rowIndex) => (
                                            <div className="d-flex justify-content-around" key={rowIndex}>
                                                {row.map((game) => (
                                                    <div
                                                        key={game.id}
                                                        onClick={() => navigate(`/game/${game.id}`)}
                                                        className="capsule-cnt"
                                                    >
                                                        <img src={game.medias[0].url} />
                                                        <div className='label-ctn'>
                                                            <div className='price'>
                                                                {game.price.toLocaleString("en-US", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="d-flex justify-content-around">
                                            {group.map((game) => (
                                                <div
                                                    key={game.id}
                                                    onClick={() => navigate(`/game/${game.id}`)}
                                                    className="capsule-cnt"
                                                >
                                                    <img src={game.medias[0].url} />
                                                    <div className='label-ctn'>
                                                        <div className='price'>
                                                            {game.price.toLocaleString("en-US", {
                                                                style: "currency",
                                                                currency: "USD",
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#mostRecommend" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#mostRecommend" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}