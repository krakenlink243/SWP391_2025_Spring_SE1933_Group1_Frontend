import axios from "axios";
import { useState, useEffect } from "react";
import "./BrowseByTag.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
/**
 * @author Phan NT Son
 * @returns 
 */
function BrowseByTag() {

    const [data, setData] = useState([]);
    const [cachedTags, setCachedTags] = useLocalStorage('tags', []);
    const {t} = useTranslation();
    useEffect(() => {

        if (cachedTags.length) setData(cachedTags);

        getTagsList();
    }, []);


    const getTagsList = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/tags`)
                .then((response) => {
                    setData(response.data);
                    setCachedTags(response.data);
                });
        } catch (error) {
            console.log(error)
        }
    };

    const chunkedTags = [];
    for (let i = 0; i < data.length; i += 4) {
        chunkedTags.push(data.slice(i, i + 4));
    }

    const handelSearchByTag = () => {
        
    }


    return (
        <div className="browse-tags">
            <div className="title">{t('Browse by Category')}</div>
            <div className="conent-hub-carousel">
                <div id="browseCarousel" className="carousel-container carousel-fade carousel slide" data-ride="false" data-pause="true">
                    <div className="carousel-items carousel-inner">
                        {chunkedTags.map((group, index) => (
                            <div
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                key={index}
                            >
                                <div className="d-flex justify-content-around">
                                    {group.map((tag) => (
                                        <a key={tag.tagId} className="capsule-cnt">
                                            <img src="https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4"></img>
                                            <div className="gradient"></div>
                                            <div className="label-ctn">
                                                <span className="label">{tag.tagName}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="carousel-indicators">
                        {chunkedTags.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#browseCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                            ></button>
                        ))}
                    </div>


                    <button className="carousel-control-prev" type="button" data-bs-target="#browseCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#browseCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">{t('Next')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default BrowseByTag;