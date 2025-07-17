import {useRef, useEffect, useState} from 'react'
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function ProfileLayout() {

    const headerHeight = useRef(null);
    const footerHeight = useRef(null);
    const [minHeight, setMinHeight] = useState(0);

    useEffect(() => {
        const calc = () => {
            const h = headerHeight.current?.offsetHeight || 0;
            const f = footerHeight.current?.offsetHeight || 0;
            setMinHeight(window.innerHeight - h - f);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    return (
        <div className="profile-layout">
            <Header ref={headerHeight} />

            <div style={{ minHeight: minHeight }}>
                <Outlet />
            </div>
            
            <Footer ref={footerHeight} />
        </div>
    );
}