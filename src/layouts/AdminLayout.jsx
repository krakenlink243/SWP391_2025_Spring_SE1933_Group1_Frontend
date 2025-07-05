import { Outlet } from "react-router-dom";
import AdminHeader from "../pages/Admin/AdminHeader";
import { Link } from "react-router-dom";

export default function AdminLayout() {

    const items = [
        { title: "Dashboard", url: "/admin/" },
        { title: "Request", url: "/admin/request" },
        { title: "Ban Users", url: "" }
    ]

    return (
        <div className="admin-layout">
            <AdminHeader />
            <div className="admin-container d-flex flex-row h-100">
                <div className="left-col d-flex flex-column w-25">
                    {
                        items.map((item, idx) => (
                            <Link key={idx} to={item.url} className="admin-menu-item">
                                {item.title}
                            </Link>
                        ))
                    }
                </div>
                <div className="right-col w-75">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}