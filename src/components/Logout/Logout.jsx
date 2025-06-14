import "./Logout.css";
import Button from "../Button/Button";
/**
 * @author Phan NT Son
 * @returns 
 */
function Logout({onClose}) {

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="logout-overlay">
            <div className="logout-modal">
                <h2>Do you want to logout?</h2>
                <div className="logout-buttons">
                    <Button label="Cancel" color={'grey-button'} onClick={onClose}/>
                    <Button label="Logout" color={'red-button'} onClick={handleLogout}/>
                </div>
            </div>
        </div>
    );
}

export default Logout;