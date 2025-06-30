import { useState, useEffect } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

/**
 * @author Phan NT Son
 * @description Component for displaying and managing game reviews.
 * @param {*} param0 
 * @returns 
 */
function Review({ game }) {
  const [reloadSignal, setReloadSignal] = useState(0);
  const triggerReload = () => setReloadSignal(prev => prev + 1);

  const userId = localStorage.getItem("userId");

  return (
    <div className="review-container w-100">
      <h2>CUSTOMER REVIEWS FOR {game.name}</h2>
      <div className="line-seperate w-100"></div>
      <ReviewForm
        onReload={triggerReload}
        userId={userId}
        game={game} />

      <ReviewList
        reloadSignal={reloadSignal}
        onReload={triggerReload}
        userId={userId}
        game={game} />
    </div>
  );
}

export default Review;
