import { useEffect, useContext, useState, createContext } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { isTokenExpired } from "./validators";
import axios from "axios";


const CartCountContext = createContext(0);

export function CartCountProvider({ children }) {
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || isTokenExpired()) {
            setCartItemsCount(0);
            return;
        }

        axios.get("http://localhost:8080/user/cart")
            .then((resp) => {
                setCartItemsCount(resp.data.data.length);
            })
            .catch((err) => {
                console.log("Error fetching in Navbar: " + err);
            })

        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-community?token=${token}`),
            reconnectDelay: 300,

        });

        client.onConnect = () => {
            console.log("Connect to Socket Total Cart items")

            client.subscribe("/user/queue/cart.count", (frame) => {
                const count = JSON.parse(frame.body);
                setCartItemsCount(count);
            });


        };


        client.activate();
        return () => { client.deactivate(); };
    }, [token]);

    return (
        <CartCountContext.Provider value={cartItemsCount}>
            {children}
        </CartCountContext.Provider>
    );
}

export function useCartItemsCount() {
    return useContext(CartCountContext);
}