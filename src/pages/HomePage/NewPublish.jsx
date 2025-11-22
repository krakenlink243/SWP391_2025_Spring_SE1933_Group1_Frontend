import { useState, useEffect } from 'react';
import axios from 'axios';
import './NewPublish.css'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


export default function NewPublish() {

    const [games, setGames] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleGetNewPublish = () => {
        axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/new-publish`)
            .then((resp) => { setGames(resp.data.data) })
            .catch((err) => console.log("Error: ", err));
    }

    useEffect(() => {
        handleGetNewPublish();
    }, [])

    const chunkedGames = [];
    for (let i = 0; i < games.length; i += 4) {
        chunkedGames.push(games.slice(i, i + 4));
    }

    return (
        <div className='new-publish-container'>
            <div className='title'>New Released Games</div>
            <div className="conent-hub-carousel">
                <div id="newPublishGame" className="carousel-container carousel-fade carousel slide" data-ride="false" data-pause="true">
                    <div className="carousel-items carousel-inner">
                        {chunkedGames.map((group, index) => (
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

                    <button className="carousel-control-prev" type="button" data-bs-target="#newPublishGame" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#newPublishGame" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}