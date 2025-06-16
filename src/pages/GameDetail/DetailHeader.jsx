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

/**
 * @author Phan NT Son
 * @param {*} param0 
 * @returns 
 * @since 15-06-2025
 */
function DetailHeader({ game }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mediaUrlArr, setMediaUrlArr] = useState([]);

    // const mediaUrlArr = [
    //     "https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4",
    //     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_c2baf8aada6140beee79d701d14043899e91af47.600x338.jpg?t=1748630546",
    //     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_fa6b881ef7c30522012ab2b2b83001e79baee093.116x65.jpg?t=1748630546",
    //     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_510a02cf3045e841e180f2b77fb87545e0c8b59d.600x338.jpg?t=1748630546",
    //     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_c494372930ca791bdc6221eca134f2270fb2cb9f.600x338.jpg?t=1748630546",
    //     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_ef61b771ee6b269b1f0cb484233e07a0bfb5f81b.600x338.jpg?t=1748630546",
    // ]

    useEffect(() => {
        const extractMediaUrl = () => {
            game.media.map((m) => {
                if (!mediaUrlArr.includes(m.url)) {
                    mediaUrlArr.push(m.url);
                }
            })
        }
        if (game) {
            extractMediaUrl();
        }
    }, [game])

    const addCartHandler = async () => {
        try {
            const response = await axios.post(
                //adjust add by Bathanh
                `http://localhost:8080/users/${userId}/cart/add?gameId=${gameId}`
            );
            console.log("Add to cart response:", response.data);

            // @author Phan NT Son
            // Tạo thông báo khi người dùng thêm game vào giỏ hàng
            if (response.data.success) {
                createNotification(`Game ${game.name} has been added to your cart.`);
                alert("Game added to cart successfully!");
            } else {
                alert("Failed to add game to cart.");
            }
            // ---

        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add game to cart.");
        }
    };

    return (
        <div className="game-detail-header-container my-3">
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
                            <div className="btn-add-to-cart" onClick={addCartHandler}>
                                <a className="btn-green-ui">
                                    <span>Add to Cart</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DetailHeader;