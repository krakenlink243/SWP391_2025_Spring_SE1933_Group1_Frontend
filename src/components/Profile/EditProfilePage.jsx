import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfilePage.css";
import GeneralSettings from "./GeneralSettings"; // Import component form
import AvatarSettings from "./AvatarSettings/AvatarSettings"; // Import component avatar

const EditProfilePage = () => {
  // State để quản lý tab nào đang active
  const [activeTab, setActiveTab] = useState("general");
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    profileName: "",
    country: "",
    dob: "",
    gender: "",
    summary: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch dữ liệu người dùng một lần ở component cha này
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Sử dụng API /me/profile để lấy thông tin user đã đăng nhập
        const response = await axios.get(
          `http://localhost:8080/user/profile/${userId}`
        );
        setCurrentUser(response.data);
        // Điền dữ liệu vào form
        const { profileName, country, dob, gender, summary } = response.data;
        setFormData({
          profileName: profileName || "",
          country: country || "",
          dob: dob || "",
          gender: gender || "",
          summary: summary || "",
        });
      } catch {
        setError("Failed to load user data. Please log in.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Hàm xử lý thay đổi input, sẽ được truyền xuống GeneralSettings
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `http://localhost:8080/user/profile/${userId}/edit/info`,
        formData
      );
      setFormData(response.data);
      setSuccessMessage("Your profile has been saved successfully!");
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Hàm để render nội dung chính dựa trên tab đang active
  const renderContent = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return <div className="edit-profile-status">Loading user data...</div>;
    }

    switch (activeTab) {
      case "general":
        return (
          <GeneralSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            successMessage={successMessage}
          />
        );
      case "avatar":
        return <AvatarSettings currentUser={userId} />;
      default:
        return <h2>Select a setting</h2>;
    }
  };

  if (loading && !currentUser) {
    return <div className="edit-profile-status">Loading...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* === SIDEBAR ĐIỀU HƯỚNG VỚI LOGIC onClick === */}
        <aside className="settings-sidebar">
          <ul>
            <li className={activeTab === "general" ? "active" : ""}>
              <a
                href="#general"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("general");
                }}
              >
                General
              </a>
            </li>
            <li className={activeTab === "avatar" ? "active" : ""}>
              <a
                href="#avatar"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("avatar");
                }}
              >
                Avatar
              </a>
            </li>
            <li>
              <a href="#">Profile Background</a>
            </li>
            <li>
              <a href="#">Mini Profile</a>
            </li>
            {/* ... các tab khác ... */}
          </ul>
        </aside>

        {/* === NỘI DUNG CHÍNH THAY ĐỔI THEO TAB === */}
        <main className="settings-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default EditProfilePage;
