import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./AvatarSettings.css";
import { useTranslation } from "react-i18next";

// Hàm helper để tạo ảnh đã được crop (giữ nguyên)
function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  const {t}=useTranslation();
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        blob.name = fileName;
        resolve(blob);
      }
    }, "image/jpeg");
  });
}

const AvatarSettings = ({ currentUser }) => {
  console.log(
    "AvatarSettings component rendered with currentUser:",
    currentUser
  );
  const [currentAvatar, setCurrentAvatar] = useState(
    currentUser?.avatarUrl || ""
  );
  const [avatarLibrary, setAvatarLibrary] = useState([]);

  // State cho việc crop ảnh
  const [upImgSrc, setUpImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // State cho loading và thông báo
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch thư viện avatar của user khi component được tải
  useEffect(() => {
    async function fetchAvatars() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/${currentUser}`
      );
      const placeholderLibrary = [...response.data.avatarUrl].filter(Boolean);
      setCurrentAvatar(response.data.avatarUrl || ""); 
    }
    fetchAvatars();
  }, [currentUser]);

  // Xử lý khi người dùng chọn file
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setUpImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Xử lý khi upload ảnh đã được crop
  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const croppedImageBlob = await getCroppedImg(
      imgRef.current,
      completedCrop,
      "new-avatar.jpg"
    );
    const formData = new FormData();
    formData.append("file", croppedImageBlob);

    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please log in.");
      }

      // SỬ DỤNG API POST DUY NHẤT MÀ BẠN CUNG CẤP
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/profile/${userId}/avatar/upload`, // URL từ controller của bạn
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newAvatarUrl = response.data.url;
      localStorage.setItem("avatarUrl", newAvatarUrl); // Cập nhật avatar trong localStorage
      setCurrentAvatar(newAvatarUrl);
      window.location.reload();
      // Thêm avatar mới vào thư viện để hiển thị
      if (!avatarLibrary.includes(newAvatarUrl)) {
        setAvatarLibrary((prev) => [newAvatarUrl, ...prev]);
      }
      setUpImgSrc(""); // Đóng giao diện crop
      setSuccessMessage(t("Avatar updated successfully!"));
    } catch (error) {
      setError(t("Upload failed. Please try another image."));
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div>
      <div className="settings-section">
        <h2>{t('Avatar')}</h2>
        <p className="section-description">
          {t('Choose your avatar image. Your profile will be updated immediately')}
          after upload.
        </p>
      </div>

      {/* Giao diện Crop */}
      {upImgSrc && (
        <div className="cropper-container section-box">
          <h3>{t('Crop Your New Avatar')}</h3>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            minWidth={184}
          >
            <img ref={imgRef} src={upImgSrc} alt="Crop preview" />
          </ReactCrop>
          <div className="cropper-actions">
            <button
              onClick={handleUploadCroppedImage}
              className="save-btn"
              disabled={isUploading}
            >
              {isUploading ? t("Uploading...") : t("Confirm & Upload")}
            </button>
            <button onClick={() => setUpImgSrc("")} className="cancel-btn">
              {t('Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Vùng xem trước và upload */}
      <div className="form-group">
        <label>{t('CURRENT AVATAR')}</label>
        <div className="avatar-preview-area">
          <img
            src={currentAvatar || "https://i.imgur.com/83ba2ki.png"}
            alt="Current Avatar"
            className="avatar-preview"
          />
          <div className="avatar-upload-actions">
            <p>{t('Upload a new image to change your avatar.')}</p>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              className="action-btn secondary"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
            >
              {t('Upload Image')}
            </button>
          </div>
        </div>
      </div>

      {/* Thư viện avatar cũ */}
      <div className="settings-section">
        <h3>Your Library</h3>
        <div className="avatar-grid">
          {avatarLibrary.map((avatarUrl, index) => (
            <div key={index} className="avatar-option-readonly">
              <img src={avatarUrl} alt={`Avatar option ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Không cần nút Save/Cancel nữa, chỉ hiển thị thông báo */}
      <div className="form-actions">
        {error && <p className="feedback-error">{error}</p>}
        {successMessage && <p className="feedback-success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default AvatarSettings;
