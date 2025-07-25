import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import './AdminLayout.css';

export default function AdminLayout() {

    const headerRef = useRef(null);

    const items = [
        { title: "Dashboard", url: "/admin/" },
        { title: "Request", url: "/admin/request/game" },
        { title: "Users Management", url: "/admin/user-management/active" },
        { title: "Game Management", url: "/admin/game-management/listed" }
    ]

    return (
        <div className="admin-layout">
            <Header ref={headerRef} />
            <div
                className="admin-container d-flex flex-row"
                style={{
                    height: `calc(100vh - ${headerRef.current ? headerRef.current.offsetHeight : 0}px)`
                }}
            >
                <div className="left-col d-flex flex-column w-25">
                    {items.map((item, idx) => (
                        <Link key={idx} to={item.url} className="admin-menu-item">
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="right-col w-75" id="scroll-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}