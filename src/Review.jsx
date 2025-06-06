import { useState } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

function Review() {
  const [reloadSignal, setReloadSignal] = useState(0);

  const triggerReload = () => setReloadSignal(prev => prev + 1);

  return (
    <>
      <ReviewForm onReload={triggerReload} />
      <ReviewList reloadSignal={reloadSignal} />
    </>
  );
}

export default Review;
