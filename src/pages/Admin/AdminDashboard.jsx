import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/**
 * @author Phan NT Son
 * @returns {JSX.Element} Admin Dashboard component
 */
function AdminDashboard({ tab }) {
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" replace />;
    } else {
        return (
            <div className='d-flex flex-column align-items-center justify-content-center text-white h-100 w-100'>
                <h1>{t('DASHBOARD CONTENT HERE')}</h1>
            </div>
        )
    }

}

export default AdminDashboard;