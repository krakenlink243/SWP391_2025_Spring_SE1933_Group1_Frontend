import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "./BrowseByPublisher.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTranslation } from "react-i18next";

/**
 * @author Phan NT Son
 * @returns
 */
function BrowseByPublisher() {
  const [data, setData] = useState([]);
  const [cachedPublishers, setCachedPublishers] = useLocalStorage(
    "publisher",
    []
  );
  const { t } = useTranslation();
  useEffect(() => {
    if (cachedPublishers) setData(cachedPublishers);
    getPublishersList();
  }, []);

  const [itemSize, setItemSize] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setItemSize(ref.current.offsetWidth);
    }
    // console.log("Pub", data)
  }, [data]);

  const getPublishersList = async () => {
    try {
<<<<<<< Updated upstream
      await axios
        .get(`${import.meta.env.VITE_API_URL}/publisher/list`)
=======
      await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/publisher/list`)
>>>>>>> Stashed changes
        .then((response) => {
          setData(response.data);
          setCachedPublishers(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const chunkedPublishers = [];
  for (let i = 0; i < data.length; i += 4) {
    chunkedPublishers.push(data.slice(i, i + 4));
  }

  const handlePublisherClick = (publisherId) => {
    window.location.href = `/publisher/${publisherId}`;
  };

  return (
    <div className="browse-publishers">
      <div className="title">{t("Browse by Publisher")}</div>
      <div className="conent-hub-carousel">
        <div
          id="browseCarousel1"
          className="carousel-container carousel-fade carousel slide"
          data-ride="false"
          data-pause="true"
        >
          <div className="carousel-items carousel-inner">
            {chunkedPublishers.map((group, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div className="d-flex justify-content-around">
                  {group.map((publisher) => (
                    <a
                      key={publisher.publisherId}
                      className="capsule-cnt"
                      onClick={() =>
                        handlePublisherClick(publisher.publisherId)
                      }
                      ref={index === 0 ? ref : null}
                      style={{ cursor: "pointer", height: `${itemSize}px` }}
                    >
                      <img
                        src={publisher.imageUrl}
                        alt={publisher.publisherName}
                        className="publisher-image"
                      />
                      <div className="gradient"></div>
                      <div className="label-ctn">
                        <span className="label">{publisher.publisherName}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {chunkedPublishers.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#browseCarousel1"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
              ></button>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#browseCarousel1"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">{t("Previous")}</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#browseCarousel1"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">{t("Next")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default BrowseByPublisher;
