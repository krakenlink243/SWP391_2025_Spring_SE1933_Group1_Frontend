import { useState, useEffect } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Review({ gameId }) {
  const [reloadSignal, setReloadSignal] = useState(0);
  const triggerReload = () => setReloadSignal(prev => prev + 1);

  /*
  Mock token for testing purposes.
  https://jwt.io/
  UserID = 1
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.sBcipOL7MvfpA9ytpCJ_ktqBGD65fuYuXssptIv6Gy8
  
  UserID = 2
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiaWF0IjoxNTE2MjM5MDIyfQ.obu1y19W7zLqfS5iTC5IYvuIKSfjqgoSNIgFwl0ZMJ8
  */
  useEffect(() => {
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.sBcipOL7MvfpA9ytpCJ_ktqBGD65fuYuXssptIv6Gy8"
    localStorage.setItem("token", mockToken);
  }, [])

  // Set up axios interceptor to include token in headers
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Decode token to get userId
  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  } else {
    console.error("No token found in localStorage.");
    return <div>Error: No token found.</div>;
  }

  const userId = decodedToken.userId;


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
