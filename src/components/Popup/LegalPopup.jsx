// LegalPopup.jsx
import { useEffect, useState } from "react";

const LegalPopup = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const agreed = localStorage.getItem("agreedToPolicy");
        if (!agreed) setVisible(true);
    }, []);

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
                <p>This website is built for educational purposes only. It does not perform real transactions or represent ownership of any game. No real money is used.</p>
                <button onClick={handleAgree} style={{ marginTop: "2rem", padding: "10px 30px", fontSize: "1rem" }}>
                    I Understand
                </button>
            </div>
        </div>
    );
};

export default LegalPopup;
