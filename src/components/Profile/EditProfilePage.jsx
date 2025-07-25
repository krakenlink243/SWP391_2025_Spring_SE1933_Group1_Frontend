import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./EditProfilePage.css";
import AvatarSettings from "./AvatarSettings/AvatarSettings";
import { useTranslation } from "react-i18next";

// Component con cho form "General", giờ đây nó nhận thêm prop `errors`

const GeneralSettings = ({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  error,
  successMessage,
  errors,
  
}) => {
  const {t} = useTranslation();
  return (
    
    <form onSubmit={handleSubmit}>
      <div className="settings-section">
        <h2>{t('About')}</h2>
        <p className="section-description">
          {t('Set your profile name and details. This information is public.')}
        </p>
      </div>

      <div className="settings-section">
        <h3>{t('General')}</h3>
        <div className="form-group">
          <label htmlFor="profileName">{t('PROFILE NAME')}</label>
          <input
            type="text"
            id="profileName"
            name="profileName"
            value={formData.profileName}
            onChange={handleInputChange}
          />
          {/* Hiển thị lỗi nếu có */}
          {errors.profileName && (
            <p className="form-error-message">{errors.profileName}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">{t('COUNTRY')}</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="">(Do not display)</option>
            <option value="Vietnam">{t('Vietnam')}</option>
            <option value="USA">{t('United States')}</option>
            <option value="Japan">{t('Japan')}</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gender">{t('GENDER')}</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">({t('Unknown')})</option>
            <option value="M">{t('Male')}</option>
            <option value="F">{t('Female')}</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dob">{t('DATE OF BIRTH')}</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && <p className="form-error-message">{errors.dob}</p>}
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('About')}</h3>
        <div className="form-group">
          <label htmlFor="summary">{t('SUMMARY')}</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
          ></textarea>
          {errors.summary && (
            <p className="form-error-message">{errors.summary}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? t("Saving...") : t("Save")}
        </button>
        {error && <p className="feedback-error">{error}</p>}
        {successMessage && <p className="feedback-success">{successMessage}</p>}
      </div>
    </form>
  );
};

const EditProfilePage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    
    profileName: "",
    country: "",
    dob: "",
    gender: "",
    summary: "",
  });
const {t} = useTranslation();
  // State mới để lưu các lỗi của form
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${userId}`
        );
        setCurrentUser(response.data);
        const { profileName, country, dob, gender, summary } = response.data;
        setFormData({
          profileName: profileName || "",
          country: country || "",
          dob: dob || "",
          gender: gender || "",
          summary: summary || "",
        });
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường đang được sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Hàm để kiểm tra dữ liệu form
  const validateForm = () => {
    
    const newErrors = {};
    if (!formData.profileName || formData.profileName.trim() === "") {
      newErrors.profileName = t("Profile Name cannot be empty.");
    }
    if (formData.summary && formData.summary.length > 25) {
      newErrors.summary = t("Summary cannot exceed 500 characters.");
    }
    if (formData.dob && new Date(formData.dob) > new Date()) {
      newErrors.dob = t("Date of Birth cannot be in the future.");
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bước 1: Validate form trước khi gửi
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Nếu có lỗi, hiển thị lỗi và không submit
      return;
    }

    // Nếu không có lỗi, tiếp tục submit
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile/${userId}/edit/info`,
        formData
      );
      setFormData(response.data);
      setSuccessMessage(t("Your profile has been saved successfully!"));
    } catch (err) {
      setError(t("Failed to save profile. Please try again."));
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;

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
            errors={errors} // <-- Truyền state lỗi xuống cho form
          />
        );
      case "avatar":
        return <AvatarSettings currentUser={currentUser} />;
      default:
        return <h2>{t('Select a setting')}</h2>;
    }
  };

  if (loading && !currentUser) {
    return <div className="edit-profile-status">{t('Loading...')}</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
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
                {t('General')}
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
                {t('Avatar')}
              </a>
            </li>
            {/* ... */}
          </ul>
        </aside>
        <main className="settings-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default EditProfilePage;
