import { useEffect, useState } from "react";
import SocketService from "../services/SocketService";

export function useFriendInvite(token) {
    const [invite, setInvite] = useState();
    const channel = 'user/queue/friend.invitations';

    useEffect(() => {
        if (!token || isTokenExpired()) return;
        SocketService.connect(token)
            .then(() => {
                SocketService.subscribe(channel, setInvite);

            })
            .catch((err) => {
                console.log("Error socket [Review hook socket]: ", err);

            });

        return () => SocketService.unsubscribe(channel);
    }, [token]);

    return invite;
}