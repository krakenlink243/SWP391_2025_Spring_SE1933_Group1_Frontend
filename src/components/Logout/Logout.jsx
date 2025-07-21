import "./Logout.css";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
/**
 * @author Phan NT Son
 * @returns 
 */
function Logout({onClose}) {
    const {t} = useTranslation();
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="logout-overlay">
            <div className="logout-modal">
                <h2>{t('Do you want to logout?')}</h2>
                <div className="logout-buttons">
                    <Button label={t("Cancel")} color={'grey-button'} onClick={onClose}/>
                    <Button label={t("Logout")} color={'red-button'} onClick={handleLogout}/>
                </div>
            </div>
        </div>
    );
}

export default Logout;