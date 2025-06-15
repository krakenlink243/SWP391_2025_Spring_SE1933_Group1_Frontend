import GameApprovePage from "./GameApprovePage";
import UserManagementPage from "./UserManagementPage";

/**
 * @author Phan NT Son
 * @returns {JSX.Element} Admin Dashboard component
 */
function AdminDashboard({ tab }) {
    return (
        <>
            {tab === "Request Management" && <GameApprovePage />}
            {tab === "User Management" && <UserManagementPage />}
        </>
    )
}

export default AdminDashboard;