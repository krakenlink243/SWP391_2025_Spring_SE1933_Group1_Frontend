import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Thêm Link cho breadcrumb
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Scrollbar } from "swiper/modules";
import { useTranslation } from "react-i18next"; // Thêm useTranslation
import CartPopup from "../../components/Popup/CartPopup";
import { isTokenExpired } from "../../utils/validators";
import Button from "../../components/Button/Button";
/**
 * @author Phan NT Son
 * @param {*} param0
 * @returns
 * @since 15-06-2025
 */
function DetailHeader({ game, setIsOpenPopup }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mediaUrlArr, setMediaUrlArr] = useState([]);
  const CUR_USERID = localStorage.getItem("userId");
  const [gameInCart, setGameInCart] = useState(false);
  const [gameInLib, setGameInLib] = useState(false);
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (game && Array.isArray(game.media)) {
      const urls = game.media.map((m) => m.url).filter(Boolean);
      setMediaUrlArr(Array.from(new Set(urls)));
    } else {
      setMediaUrlArr([]);
    }

    if (game?.gameId && CUR_USERID) {
      checkGameInCart();
      checkGameInLib();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, CUR_USERID]);

  const addCartHandler = async () => {
    if (!CUR_USERID || isTokenExpired()) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/cart/add?gameId=${game.gameId}`
      );

      if (response?.data?.success) {
        setShowPopup(game);
        setIsOpenPopup(true);
        checkGameInCart();
        checkGameInLib();
      } else {
        alert(t("Failed to add game to cart."));
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(t("Failed to add game to cart."));
    }
  };
  const handleTagClick = (tagId) => {
    window.location.href = `/tags/${tagId}`;
  };

  const checkGameInCart = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/cart/contain/${game.gameId}`)
      .then((response) => {
        if (response.data === true) setGameInCart(true);
        else setGameInCart(false);
      })
      .catch((error) => {
        console.error("Error checking cart:", error);
        setGameInCart(false);
      });
  };

  const checkGameInLib = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/user/library/contain/${game.gameId}`
      )
      .then((response) => {
        if (response.data === true) setGameInLib(true);
      })
      .catch((error) => {
        console.error("Error checking library:", error);
        setGameInLib(false);
      });
  };

  return (
    <div>
      <div className="row" style={{ position: "relative", zIndex: 1 }}>
        <div className="background-image">
          <img src={mediaUrlArr[0]} className="img" />
        </div>
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <div className="game-detail-header-container my-3 text-white">
            {showPopup && (
              <CartPopup
                game={showPopup}
                mediaUrlArr={mediaUrlArr}
                onClose={() => {
                  setShowPopup(null);
                  setIsOpenPopup(false);
                }}
                onViewCart={() => navigate("/cart")}
                onRemoveSuccess={() => checkGameInCart()}
              />
            )}
            <div className="d-flex justify-content-between">
              <h1 className="game-name">{game.name}</h1>
              <div className="d-flex">
                <Button
                  className="btn-cart"
                  label={"To News Page"}
                  onClick={() =>
                    navigate(`/news/${game.gameId}`, {
                      state: { mode: "customer" },
                    })
                  }
                  color="white-grey-button"
                ></Button>
              </div>
            </div>
            <div className="content d-flex my-3">
              <div className="left-col d-flex flex-column">
                {/** 1) Big slider container **/}
                <div className="highlight-player-area">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    className="main-swiper"
                    style={{ width: "100%", height: "100%" }} // whatever height you need
                  >
                    {mediaUrlArr.map((url, i) => (
                      <SwiperSlide key={i}>
                        {url.endsWith(".mp4") ? (
                          <div className="media-with-caption">
                            <video
                              src={url}
                              controls
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="media-with-caption">
                            <img
                              src={url}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
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
                    slidesPerView={5} // how many thumbs are visible
                    spaceBetween={8} // gap between thumbs
                    scrollbar={{ draggable: true }}
                    className="thumbs-swiper"
                    style={{ height: "100%" }}
                  >
                    {mediaUrlArr.map((url, i) => (
                      <SwiperSlide key={i} style={{ cursor: "pointer" }}>
                        <div className="media-with-caption">
                          <img
                            src={url}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              <div className="right-col d-flex flex-column align-items-start justify-content-between">
                <div className="content-row mt-0">
                  <div className="gameHeaderImgCtn w-100">
                    <div className="media-with-caption">
                      <img
                        // src={coverImageUrl}
                        src={mediaUrlArr[0]}
                        alt="Game cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="content-row">
                  <div className="game-description-snippet">
                    {game.shortDescription}
                  </div>
                </div>
                <div className="content-row">
                  <strong className="info-label">{t("RELEASE DATE")}:</strong>
                  <span className="info-value">
                    {new Date(game.releaseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="content-row">
                  <strong className="info-label">{t("PUBLISHER")}:</strong>
                  <span className="info-value">
                    {game.publisher?.publisherName || "N/A"}
                  </span>
                </div>
                <div className="content-row">
                  <p>{t("Reviews stuff")}</p>
                </div>
                <div className="content-row mb-0">
                  <div className="game-tags">
                    {game.tags.map((tag) => (
                      <Link
                        onClick={() => handleTagClick(tag.tagId)}
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
          </div>
        </div>
      </div>
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <div className="purchase-area my-3 text-white">
            <div className="purchase-box">
              <h2>
                {t("Buy")} {game.name}
              </h2>
              <div className="game-purchase-action-bg">
                <div className="price-action">
                  {game.price > 0 ? (
                    <div className="price">${game.price.toFixed(2)}</div>
                  ) : (
                    <div className="price">{t("Free to Play")}</div>
                  )}
                  {!gameInCart && !gameInLib ? (
                    <div className="btn-add-to-cart" onClick={addCartHandler}>
                      <a className="btn-green-ui">
                        <span>{t("Add to Cart")}</span>
                      </a>
                    </div>
                  ) : (
                    <div
                      className={`btn-add-to-cart`}
                      onClick={() =>
                        navigate(`${gameInCart ? "/cart" : "/library"}`)
                      }
                    >
                      <a className="btn-blue-ui">
                        {gameInLib && <span>{t("Already in Library")}</span>}
                        {gameInCart && !gameInLib && (
                          <span>{t("Already in Cart")}</span>
                        )}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailHeader;
