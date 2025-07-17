import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LegalPopup = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const agreed = localStorage.getItem("agreedToPolicy");

        const currentPath = location.pathname;

        const isLegalPage = currentPath === "/terms-of-use" || currentPath === "/privacy-policy";

        if (!agreed && !isLegalPage) {
            setVisible(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        const isLegalPage = location.pathname === "/terms-of-use" || location.pathname === "/privacy-policy";
        if (isLegalPage) {
            setVisible(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (visible) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [visible]);


    const handleAgree = () => {
        localStorage.setItem("agreedToPolicy", "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)", color: "#fff", zIndex: 9999,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem"
        }}>
            <div style={{ maxWidth: "600px", textAlign: "center" }}>
                <h2>⚠️ Educational Project Notice</h2>
                <p>
                    This website is built for educational purposes only. It does not perform real transactions or represent ownership of any game. No real money is used. <br />
                    By clicking "I Understand", you agree to our <Link to={"/terms-of-use"} style={{ color: "#4db8ff" }}>Terms of Use </Link>
                    and <Link to={"/privacy-policy"} style={{ color: "#4db8ff" }}>Privacy Policy</Link>.
                </p>


                <button onClick={handleAgree} style={{ marginTop: "2rem", padding: "10px 30px", fontSize: "1rem" }}>
                    I Understand
                </button>
            </div>
        </div>
    );
};

export default LegalPopup;
