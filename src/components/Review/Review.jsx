import { useState, useEffect, useMemo } from "react";
import ReviewForm from "./ReviewForm";
import ReviewListItem from "./ReviewListItem";
import ReviewUpdateForm from "./ReviewUpdateForm";
import axios from "axios";
import './Review.css';
import { useReview } from "../../hooks/useReview";

/**
 * @author Phan NT Son
 * @description Component for displaying and managing game reviews.
 * @param {*} param0 
 * @returns 
 */
function Review({ game }) {
  const [reloadSignal, setReloadSignal] = useState(0);
  const triggerReload = () => setReloadSignal(prev => prev + 1);
  const CUR_USERID = Number(localStorage.getItem("userId"));
  const [reviewList, setReviewList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const shownReviews = reviewList.slice(0, visibleCount);
  const dto = useReview(game.gameId);

  useEffect(() => {
    console.log("[State] reviewList changed:", reviewList);
  }, [reviewList]);

  // Init review list
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/review/list/${game.gameId}`)
      .then((response) => {
        setReviewList(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));

  }, [reloadSignal]);


  useEffect(() => {
    if (!dto) return;

    switch (dto.type) {
      case 'UPDATE_REACTION':
        handleUpdateReaction(dto);
        break;
      case 'UPDATE_CONTENT':
        handleUpdateContent(dto);
        break;
      case 'NEW_REVIEW':
      case 'DELETE_REVIEW':
        triggerReload();
        break;
      default:
        console.warn("Unknown DTO type:", dto);
    }
  }, [dto]);

  function handleUpdateReaction(dto) {
    setReviewList(prev => {
      return prev.map(r =>
        r.authorId === dto.authorId && r.gameId === dto.gameId
          ? { ...r, helpful: dto.newLikeCount, notHelpful: dto.newUnLikeCount }
          : r
      );
    });
  }


  function handleUpdateContent(dto) {
    setReviewList(prev =>
      prev.map(r =>
        r.authorId === dto.authorId && r.gameId === dto.gameId
          ? { ...r, content: dto.newContent, recommended: dto.newRecommended }
          : r
      )
    );

  }

  const { recommendPct, notRecommendPct } = useMemo(() => {
    const total = reviewList.length;
    if (total === 0) return { recommendPct: 0, notRecommendPct: 0 };
    const rec = reviewList.filter(r => r.recommended).length;
    const pct = Math.round((rec / total) * 100);
    return { recommendPct: pct, notRecommendPct: 100 - pct };
  }, [reviewList]);

  const isHavingReview = useMemo(() => {
    return reviewList.some((review) => review.authorId === CUR_USERID);
  }, [reviewList, CUR_USERID]);



  return (
    <div className="review-container w-100">
      <h2>CUSTOMER REVIEWS FOR {game.name}</h2>
      <div className="line-seperate w-100"></div>

      {CUR_USERID && !isHavingReview && (
        <ReviewForm
          onReload={triggerReload}
          game={game} />

      )}

      {reviewList.length > 0 ? (
        <div className="d-flex align-items-center flex-column text-white pt-5 pb-3 review-summary-bar" >
          <div className="d-flex flex-row justify-content-between w-100">
            <div>Recommended {recommendPct}%</div>
            <div>Not recommended {notRecommendPct}%</div>
          </div>
          <div className="w-100">
            <progress className="w-100" value={recommendPct} max={100} style={{ flexGrow: 1 }} />
          </div>
        </div>
      ) : (
        <div className="text-white py-3">No Reviews have been made.</div>
      )}

      <div className="reviews d-flex flex-column gap-2">
        {shownReviews.map((review) => (
          <div key={`${review.authorId}-${review.gameId}`} className="review">

            {editingId === review.authorId ? (
              <ReviewUpdateForm
                originalReview={review}
                onCancel={() => setEditingId(null)}
                onReload={triggerReload}
                gameId={game.gameId}
                userId={CUR_USERID}
              />
            ) : (
              <ReviewListItem
                review={review}
                game={game}
                CUR_USERID={CUR_USERID}
                setEditingId={setEditingId}
              />
            )}
          </div>
        ))}
      </div>

      {visibleCount < reviewList.length && (
        <p className="text-white" ><u onClick={() => setVisibleCount(v => v + 5)} style={{ cursor: "pointer" }}>Show more</u></p>
      )}
      {visibleCount >= reviewList.length && reviewList.length > 5 && (
        <p className="text-white" ><u onClick={() => setVisibleCount(5)} style={{ cursor: "pointer" }}>Show less</u></p>
      )}
    </div>
  );
}

export default Review;
