import { useState, useEffect } from 'react';
import './TopSelling.css'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function TopSelling() {

    const [games, setGames] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoverImageUrl, setHoverImageUrl] = useState({});

    const handleGetTopSelling = () => {
        axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/top-selling`)
            .then((resp) => { setGames(resp.data.data) })
            .catch((err) => console.log("Error: ", err));
    }

    useEffect(() => {
        handleGetTopSelling();
    }, [])

    return (
        <div className='top-selling-container'>
            <div className='title'>Top Selling</div>
            <div className="conent-hub-carousel">
                <div id="topSellingGame" className="carousel-container carousel-fade carousel slide" data-ride="false" data-pause="true">
                    <div className="carousel-items carousel-inner">

                        {games.map((game, index) => {
                            const mainImageUrl = game.medias[0]?.url;
                            const subImages = game.medias.slice(1, 5); // 4 sub-images

                            return (
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={game.id}>
                                    <div className="d-flex justify-content-center">
                                        <div
                                            onClick={() => navigate(`/game/${game.id}`)}
                                            className="capsule-cnt d-flex flex-row"
                                        >
                                            <img
                                                src={hoverImageUrl[game.id] || mainImageUrl}
                                                alt={game.name}
                                                className='main-image'
                                            />
                                            <div className='detail-ctn d-flex flex-column justify-content-between'>
                                                <div>
                                                    <div className='name'>{game.name}</div>
                                                    <div className='other-images d-flex flex-row flex-wrap'>
                                                        {
                                                            subImages.map((media) => {
                                                                return (
                                                                    <div
                                                                        className='sub-img'
                                                                        key={media.mediaId}
                                                                    >
                                                                        <img
                                                                            src={media.url}
                                                                            onMouseEnter={() => {
                                                                                setHoverImageUrl(prev => ({ ...prev, [game.id]: media.url }));
                                                                            }}
                                                                            onMouseLeave={() => {
                                                                                setHoverImageUrl(prev => ({ ...prev, [game.id]: null }));
                                                                            }}
                                                                        ></img>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='short-description'>
                                                        {game.shortDescription}
                                                    </div>
                                                    <div className='tags d-flex flex-row flex-wrap gap-2'>
                                                        {
                                                            game.tags.map((tag) => {
                                                                return (
                                                                    <div className='tag-item' key={tag.tagId}>
                                                                        {tag.tagName}
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className='price'>
                                                    {game.price.toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#topSellingGame" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#topSellingGame" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}