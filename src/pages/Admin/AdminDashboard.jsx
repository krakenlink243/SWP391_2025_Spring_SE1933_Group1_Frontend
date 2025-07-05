import { Navigate } from 'react-router-dom';
/**
 * @author Phan NT Son
 * @returns {JSX.Element} Admin Dashboard component
 */
function AdminDashboard({ tab }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" replace />;
    } else {
        return (
            <div>

            </div>
        )
    }

}

export default AdminDashboard;