import { useState, useEffect } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * @author Phan NT Son
 * @description Component for displaying and managing game reviews.
 * @param {*} param0 
 * @returns 
 */
function Review({ gameId }) {
  const [reloadSignal, setReloadSignal] = useState(0);
  const triggerReload = () => setReloadSignal(prev => prev + 1);

  const userId = localStorage.getItem("userId");

  return (
    <>
      <ReviewForm
        onReload={triggerReload}
        userId={userId}
        gameId={gameId} />

      <ReviewList
        reloadSignal={reloadSignal}
        onReload={triggerReload}
        userId={userId}
        gameId={gameId} />
    </>
  );
}

export default Review;
