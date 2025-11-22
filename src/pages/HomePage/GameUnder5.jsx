import { useEffect, useState } from 'react';
import './GameUnder5.css'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


export default function GameUnder5() {

    const [games, setGames] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleGetGameUnder5 = () => {
        axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/under5`)
            .then((resp) => { setGames(resp.data.data) })
            .catch((err) => console.log("Error: ", err));
    }

    useEffect(() => {
        handleGetGameUnder5();
    }, [])

    const chunkedTags = [];
    for (let i = 0; i < games.length; i += 4) {
        chunkedTags.push(games.slice(i, i + 4));
    }

    return (
        <div className='game-under-5-container'>
            <div className='title'>Under 5$</div>
            <div className="conent-hub-carousel">
                <div id="gameUnder5Carousel" className="carousel-container carousel-fade carousel slide">
                    <div className="carousel-items carousel-inner">
                        {chunkedTags.map((group, index) => (
                            <div
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                key={index}
                            >
                                <div className="d-flex justify-content-around">
                                    {group.map((game) => {
                                        return (
                                            <div
                                                key={game.id}
                                                onClick={() => navigate(`/game/${game.id}`)}
                                                className="capsule-cnt"
                                            >
                                                <img src={game.medias[0].url}></img>
                                                <div className='label-ctn'>
                                                    <div className='price'>
                                                        {game.price.toLocaleString("en-US", {
                                                            style: "currency",
                                                            currency: "USD",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#gameUnder5Carousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#gameUnder5Carousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}