import React, { useState, useEffect } from "react";
import axios from "axios"; // Hoặc apiClient đã cấu hình
import "./EditProfilePage.css";

const EditProfilePage = () => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    profileName: "",

    country: "",
    dob: "",
    gender: "",
    summary: "",
  });

  // State để quản lý trạng thái
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // 1. Fetch dữ liệu profile hiện tại để điền vào form
  useEffect(() => {
    // Lấy userId từ localStorage ngay bên trong effect
    const userId = localStorage.getItem("userId");

    // In ra để kiểm tra
    console.log("Component mounted. User ID from localStorage:", userId);

    if (!userId) {
      setError("User ID not found in localStorage. Please login again.");
      setLoading(false);
      return;
    }

    const fetchCurrentProfile = async () => {
      setLoading(true);
      try {
        // Sử dụng userId vừa lấy được để gọi API
        const response = await axios.get(
          `http://localhost:8080/user/profile/${userId}`
        );

        const { profileName, country, dob, gender, summary } = response.data;
        setFormData({
          profileName: profileName || "",
          country: country || "",
          dob: dob || "",
          gender: gender || "",
          summary: summary || "",
        });
      } catch (err) {
        setError("Failed to load profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []); // Dependency rỗng `[]` để đảm bảo nó chỉ chạy 1 lần

  // Hàm xử lý thay đổi input không đổi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // SỬA ĐỔI 2: Sửa lại hàm handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy lại userId từ localStorage để đảm bảo luôn đúng
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Cannot save profile. User ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      // SỬA ĐỔI 3: Dùng dấu backtick (`) cho URL và thêm đường dẫn API đầy đủ
      const response = await axios.put(
        `http://localhost:8080/user/profile/${userId}/edit/info`,
        formData
      );

      setFormData(response.data);
      setSuccessMessage("Your profile has been saved successfully!");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading && !formData.profileName) {
    return <div className="edit-profile-status">Loading...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* === CỘT TRÁI - SIDEBAR ĐIỀU HƯỚNG === */}
        <aside className="settings-sidebar">
          <ul>
            <li className="active">
              <a href="#">General</a>
            </li>
            <li>
              <a href="#">Avatar</a>
            </li>
            <li>
              <a href="#">Profile Background</a>
            </li>
            <li>
              <a href="#">Mini Profile</a>
            </li>
            <li>
              <a href="#">Theme</a>
            </li>
            <li>
              <a href="#">Featured Badge</a>
            </li>
            <li>
              <a href="#">Favorite Group</a>
            </li>
            <li>
              <a href="#">Featured Showcase</a>
            </li>
            <li>
              <a href="#">Privacy Settings</a>
            </li>
          </ul>
        </aside>

        {/* === CỘT PHẢI - NỘI DUNG FORM === */}
        <main className="settings-content">
          <form onSubmit={handleSubmit}>
            <div className="settings-section">
              <h2>About</h2>
              <p className="section-description">
                Set your profile name and details. This information is public.
              </p>
            </div>

            <div className="settings-section">
              <h3>General</h3>
              <div className="form-group">
                <label htmlFor="profileName">PROFILE NAME</label>
                <input
                  type="text"
                  id="profileName"
                  name="profileName"
                  value={formData.profileName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Bạn có thể thêm các trường REAL NAME và CUSTOM URL ở đây khi DB hỗ trợ */}

              <div className="form-group">
                <label htmlFor="country">COUNTRY</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  {/* Bạn nên điền danh sách các nước vào đây */}
                  <option value="">(Do not display)</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="USA">United States</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="country">GENDER</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  {/* Bạn nên điền danh sách các nước vào đây */}
                  <option value="">(Unknown)</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Others</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dob">DATE OF BIRTH</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>About</h3>
              <div className="form-group">
                <label htmlFor="summary">SUMMARY</label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Thêm các trường khác bạn cho phép sửa */}
            <div className="settings-section"></div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              {error && <p className="feedback-error">{error}</p>}
              {successMessage && (
                <p className="feedback-success">{successMessage}</p>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProfilePage;
