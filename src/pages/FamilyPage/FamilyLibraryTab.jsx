import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import './FamilyLibraryTab.css';
import axios from "axios";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function FamilyLibraryTab({ familyData }) {
    const { t } = useTranslation();
    const [openPopup, setOpenPopup] = useState(false);
    const navigate = useNavigate();
    const [familyLibrary, setFamilyLibrary] = useState([]);

    useEffect(() => {
        if (familyData && familyData.games) {
            setFamilyLibrary(familyData.games);
        }
    }, [familyData]);

    return (
        <div className="family-library-tab">
            <div className="family-library-wrapper">
                <div className="box-title">
                    <span className="title">{t('Library')}</span>
                    {
                        familyData.isOwner && !openPopup && (
                            <span className="vertical-dots-icon" title={t('More options')} onClick={() => setOpenPopup(!openPopup)}>
                                &#8942;
                            </span>
                        )
                    }
                </div>
                {
                    !openPopup && (
                        <div className="result">
                            {familyLibrary.length == 0 && (
                                <div className="result-not-found">
                                    {t('Sorry, there are no shared games yet.')}
                                </div>
                            )}
                            {familyLibrary.map((game) => (
                                <div className="box-item" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
                                    <div className="game-box">
                                        <div className="game-avatar">
                                            <img src={`${game.media[0].url}`} alt={`${game.name}`} />
                                        </div>
                                        <div className="game-name">
                                            {game.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

                {openPopup && <Popup setOpenPopup={setOpenPopup} familyLibrary={familyLibrary} openPopup={openPopup} t={t} />}
            </div>

        </div>
    );
}

function Popup({ openPopup, setOpenPopup, familyLibrary, t }) {
    const [curTab, setCurTab] = useState(0);
    const renderPopupTab = () => {
        if (curTab === 0) return <PopupTab1 familyLibrary={familyLibrary} setOpenPopup={setOpenPopup} />;
        if (curTab === 1) return <PopupTab2 familyLibrary={familyLibrary} setOpenPopup={setOpenPopup} />;
        return null;
    };
    return (
        <div className={`popup ${openPopup ? "open" : ""}`}>
            <div className="actions">
                <div className="close-btn" onClick={() => setOpenPopup(false)} title={t('Close')}>
                    &times;
                </div>
            </div>
            <div className="d-flex flex-row">
                <div className="left-col d-flex flex-column gap-2">
                    <div
                        className={`popup-item${curTab === 0 ? " active" : ""}`}
                        onClick={() => setCurTab(0)}
                    >
                        {t('Add Game')}
                    </div>
                    <div
                        className={`popup-item${curTab === 1 ? " active" : ""}`}
                        onClick={() => setCurTab(1)}
                    >
                        {t('Remove Game')}
                    </div>
                </div>
                <div className="right-col">
                    {renderPopupTab()}
                </div>
            </div>
        </div>
    );
}


function PopupTab1({ familyLibrary, setOpenPopup }) {

    const { library: privateLibrary } = useContext(AppContext);
    const [remainingGames, setRemainingGames] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (familyLibrary && familyLibrary.length > 0) {
            const familyGameIds = familyLibrary.map(game => game.id);
            const availableGames = privateLibrary.filter(game => !familyGameIds.includes(game.gameId));
            setRemainingGames(availableGames);
        } else {
            setRemainingGames(privateLibrary);
        }
    }, [familyLibrary, privateLibrary]);

    const handleShareGames = () => {
        if (selectedGames.length === 0) return;
        setLoading(true);

        const gameIds = selectedGames.map(game => game.gameId);
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/library/share`, {
            gameIds: gameIds
        })
            .then((res) => {
                console.log("Shared games:", res.data);
                setSelectedGames([]);
                setOpenPopup(false);
            })
            .catch(err => {
                console.error("Error sharing games:", err);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    const isSelected = (id) => selectedGames.some(g => g.gameId === id);

    return (
        <div className="popup-tab">
            <div className="form-group">
                <label>{t('Selected Games')}</label>
                <div className="selected-items d-flex flex-wrap gap-2">
                    {
                        selectedGames.map(game => (
                            <div
                                key={game.gameId}
                                className="selected-item"
                                onClick={() => setSelectedGames(prev => prev.filter(g => g.gameId !== game.gameId))}
                            >
                                {game.name} ✕
                            </div>
                        ))
                    }
                    {selectedGames.length === 0 && (
                        <div>{t('No games selected')}</div>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label>{t('Available Games')}</label>
                <div className="available-items d-flex flex-wrap">
                    {
                        remainingGames.map(game => (
                            <div
                                key={game.gameId}
                                className={`game-item ${isSelected(game.gameId) ? "selected" : ""}`}
                                onClick={() => {
                                    if (isSelected(game.gameId)) {
                                        setSelectedGames(prev => prev.filter(g => g.gameId !== game.gameId));
                                    } else {
                                        setSelectedGames(prev => [...prev, game]);
                                    }
                                }}
                            >
                                <img src={game.media[0].url} alt={game.name} />
                                <div className="game-name">{game.name}</div>
                            </div>
                        ))
                    }
                    {remainingGames.length === 0 && (
                        <div>{t('No games available')}</div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-end pt-2">
                <Button
                    label={'Share Games'}
                    color="gradient-blue-button"
                    onClick={() => handleShareGames()}
                    disabled={selectedGames.length === 0}
                    loading={loading}
                />
            </div>
        </div>
    );
}
function PopupTab2({ familyLibrary, setOpenPopup }) {
    const [selectedGames, setSelectedGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleUnshareGames = () => {
        if (selectedGames.length === 0) return;
        setLoading(true);

        const gameIds = selectedGames.map(game => game.id);
        // console.log("Unsharing games:", gameIds);
        // setLoading(false);
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/library/remove`, {
            gameIds: gameIds
        })
            .then((res) => {
                console.log("Unshared games:", res.data);
                setSelectedGames([]);
                setOpenPopup(false);
            })
            .catch(err => {
                console.error("Error unsharing games:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isSelected = (id) => selectedGames.some(g => g.id === id);
    return (
        <div className="popup-tab">
            <div className="form-group">
                <label>{t('Selected Games to Remove')}</label>
                <div className="selected-items d-flex flex-wrap gap-2">
                    {
                        selectedGames.map(game => (
                            <div
                                key={game.id}
                                className="selected-item"
                                onClick={() => setSelectedGames(prev => prev.filter(g => g.id !== game.id))}
                            >
                                {game.name} ✕
                            </div>
                        ))
                    }
                    {selectedGames.length === 0 && (
                        <div>{t('No games selected')}</div>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label>{t('Currently Shared Games')}</label>
                <div className="available-items d-flex flex-wrap">
                    {
                        familyLibrary.map(game => (
                            <div
                                key={game.id}
                                className={`game-item ${isSelected(game.id) ? "selected" : ""}`}
                                onClick={() => {
                                    if (isSelected(game.id)) {
                                        setSelectedGames(prev => prev.filter(g => g.id !== game.id));
                                    } else {
                                        setSelectedGames(prev => [...prev, game]);
                                    }
                                }}
                            >
                                <img src={game.media[0].url} alt={game.name} />
                                <div className="game-name">{game.name}</div>
                            </div>
                        ))
                    }
                    {familyLibrary.length === 0 && (
                        <div>{t('No shared games available')}</div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-end pt-2">
                <Button
                    label={t('Remove Games')}
                    color="red-button"
                    onClick={() => handleUnshareGames()}
                    disabled={selectedGames.length === 0}
                    loading={loading}
                />
            </div>
        </div>

    );
}