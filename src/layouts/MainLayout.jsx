import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {

    const headerHeight = useRef(null);
    const navHeight = useRef(null);
    const footerHeight = useRef(null);
    const [minHeight, setMinHeight] = useState(0);

    useEffect(() => {
        const calc = () => {
            const h = headerHeight.current?.offsetHeight || 0;
            const n = navHeight.current?.offsetHeight || 0;
            const f = footerHeight.current?.offsetHeight || 0;
            setMinHeight(window.innerHeight - h - n - f);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    return (
        <div className="main-layout">
            <Header ref={headerHeight} />
            <Navbar ref={navHeight} />

            <div style={{ minHeight: minHeight }}>
                <Outlet />
            </div>

            <Footer ref={footerHeight} />
        </div>
    );
}