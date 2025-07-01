import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Thêm Link cho breadcrumb
import { createNotification } from "../../services/notification";
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Scrollbar } from 'swiper/modules';
import CartPopup from "../../components/Popup/CartPopup";
import { CartCountProvider } from "../../utils/TotalInCartContext";
import { isTokenExpired } from "../../utils/validators";

/**
 * @author Phan NT Son
 * @param {*} param0 
 * @returns 
 * @since 15-06-2025
 */
function DetailHeader({ game }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mediaUrlArr, setMediaUrlArr] = useState([]);
    const CUR_USERID = localStorage.getItem("userId");
    const [gameInCart, setGameInCart] = useState(false);
    const [gameInLib, setGameInLib] = useState(false);
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        const extractMediaUrl = () => {
            game.media.map((m) => {
                if (!mediaUrlArr.includes(m.url)) {
                    mediaUrlArr.push(m.url);
                }
            })
        }
        if (game?.gameId && Array.isArray(game.media)) {
            setMediaUrlArr(() => {
                const urls = game.media.map(m => m.url);
                return Array.from(new Set(urls)); // Loại trùng
            });

            if (CUR_USERID) {
                checkGameInCart();
                checkGameInLib();
            }
        }
    }, [game])



    const addCartHandler = async () => {
        if (!CUR_USERID || isTokenExpired()) {
            window.location.href = "/login";
            return;
        }
        try {
            const response = await axios.post(
                //adjust add by Bathanh
                `http://localhost:8080/user/cart/add?gameId=${game.gameId}`
            );
            console.log("Add to cart response:", response.data);

            // @author Phan NT Son
            // Tạo thông báo khi người dùng thêm game vào giỏ hàng
            if (response.data.success) {
                createNotification(CUR_USERID, "Cart", `Game ${game.name} has been added to your cart.`);
                setShowPopup(game);
                checkGameInCart();
                checkGameInLib();
            } else {
                alert("Failed to add game to cart.");
            }
            // ---

        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add game to cart.");
        }
    };

    const checkGameInCart = () => {
        axios.get(`http://localhost:8080/user/cart/contain/${game.gameId}`)
            .then(response => {
                if (response.data === true) setGameInCart(true)
                else setGameInCart(false);
            })
            .catch(error => {
                console.error("Error checking cart:", error);
                setGameInCart(false);
            });
    };

    const checkGameInLib = () => {
        axios.get(`http://localhost:8080/user/library/contain/${game.gameId}`)
            .then(response => {
                if (response.data === true) setGameInLib(true);
            })
            .catch(error => {
                console.error("Error checking library:", error);
                setGameInLib(false);
            });
    };

    return (
        <div className="game-detail-header-container my-3">
            {showPopup && (

                <CartCountProvider>
                    <CartPopup
                        game={showPopup}
                        mediaUrlArr={mediaUrlArr}
                        onClose={() => setShowPopup(null)}
                        onViewCart={() => window.location.href = "/cart"}
                        onRemoveSuccess={() => checkGameInCart()}
                    />
                </CartCountProvider>
            )}
            <h1 className="game-name">{game.name}</h1>
            <div className="content d-flex my-3">
                <div className="left-col d-flex flex-column">
                    {/** 1) Big slider container **/}
                    <div className="highlight-player-area">
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            className="main-swiper"
                            style={{ width: '100%', height: '100%' }} // whatever height you need
                        >
                            {mediaUrlArr.map((url, i) => (
                                <SwiperSlide key={i}>
                                    {url.endsWith('.mp4')
                                        ? <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    }
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/** 2) Thumbnail strip **/}
                    <div className="highlight-strip">
                        <Swiper
                            modules={[Thumbs, Scrollbar]}
                            onSwiper={setThumbsSwiper}
                            watchSlidesProgress
                            freeMode
                            slidesPerView={5}          // how many thumbs are visible
                            spaceBetween={8}           // gap between thumbs
                            scrollbar={{ draggable: true }}
                            className="thumbs-swiper"
                            style={{ height: '100%' }}
                        >
                            {mediaUrlArr.map((url, i) => (
                                <SwiperSlide key={i} style={{ cursor: 'pointer' }}>
                                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </div>
                </div>
                <div className="right-col d-flex flex-column align-items-start justify-content-between">
                    <div className="content-row mt-0">
                        <div className="gameHeaderImgCtn w-100">
                            <img
                                // src={coverImageUrl}
                                src={mediaUrlArr[0]}
                                alt="Game cover"
                            />
                        </div>
                    </div>
                    <div className="content-row">
                        <div className="game-description-snippet">
                            {game.shortDescription}
                        </div>
                    </div>
                    <div className="content-row">
                        <strong className="info-label">RELEASE DATE:</strong>
                        <span className="info-value">
                            {new Date(game.releaseDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="content-row">
                        <strong className="info-label">PUBLISHER:</strong>
                        <span className="info-value">
                            {game.publisher?.publisherName || "N/A"}
                        </span>
                    </div>
                    <div className="content-row">
                        <p>Reviews stuff</p>
                    </div>
                    <div className="content-row mb-0">
                        <div className="game-tags">
                            {game.tags.map((tag) => (
                                // Mỗi tag giờ là một Link trỏ đến trang game với query parameter
                                <Link
                                    to={`/games?tags=${tag.tagId}`} // URL sẽ có dạng /games?tags=17
                                    key={tag.tagId}
                                    className="tag"
                                >
                                    {tag.tagName}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="purchase-area my-3">
                <div className="purchase-box">
                    <h2>Buy {game.name}</h2>
                    <div className="game-purchase-action-bg">
                        <div className="price-action">
                            {game.price > 0 ? (
                                <div className="price">${game.price.toFixed(2)}</div>
                            ) : (
                                <div className="price">Free to Play</div>
                            )}
                            {!gameInCart && !gameInLib ? (
                                <div className="btn-add-to-cart" onClick={addCartHandler}>
                                    <a className="btn-green-ui">
                                        <span>Add to Cart</span>
                                    </a>
                                </div>
                            ) : (
                                <div className={`btn-add-to-cart`} onClick={() => window.location.href = `${gameInCart ? "/cart" : "/library"}`}>
                                    <a className="btn-blue-ui">
                                        {gameInLib && (
                                            <span>Already in Library</span>
                                        )}
                                        {gameInCart && !gameInLib && (
                                            <span>Already in Cart</span>
                                        )}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DetailHeader;