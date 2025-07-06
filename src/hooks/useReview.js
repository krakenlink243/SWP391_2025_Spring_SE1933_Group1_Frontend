import { useEffect, useState } from "react";
import SocketService from "../services/SocketService";
import { useAuth } from "../context/AuthContext";
import { isTokenExpired } from "../utils/validators";

export function useReview(gameId) {
    const [dto, setDto] = useState();
    const channel = `/topic/review.${gameId}`;
    const { token } = useAuth();

    useEffect(() => {
        if (!token || isTokenExpired()) return;
        SocketService.connect(token)
            .then(() => {
                SocketService.subscribe(channel, setDto);
            })
            .catch((err) => {
                console.log("Error socket [Review hook socket]: ", err);
            });
        return () => SocketService.unsubscribe(channel);
    }, [token, gameId]);

    return dto;
}