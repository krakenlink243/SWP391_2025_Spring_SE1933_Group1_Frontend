import React, { useEffect } from "react";
import { useState, useRef } from "react";
import "./SendUserFeedback.css";
import Button from "../components/Button/Button";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { trimValue } from "../utils/validators";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SendUserFeedback() {
  const {t}=useTranslation();
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    mediaUrls: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("username");
    setUserName(userName);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject" && value.length > 256) {
      alert(t("Subject must be less than 256 characters"));
      setFormData((prev) => ({
        ...prev,
        subject: value.slice(0, 256),
      }));
      return;
    }
    if (name === "message" && value.length > 2048) {
      alert(t("Feedback must be less than 2048 characters"));
      setFormData((prev) => ({
        ...prev,
        message: value.slice(0, 2048),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const normalizeValue = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: trimValue(value),
    }));
  };
  const [arr, setArr] = useState([]);
  const mediaFileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const handleFileSelect = (e) => {
    const selectFile = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectFile]);
    const mediaPreview = selectFile.map((file) => URL.createObjectURL(file));
    setArr((prev) => [...prev, ...mediaPreview]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      alert(t("Please fill in all fields!"));
      return;
    }
    try {
      let responseMedia;
      if (files.length > 0) {
        const uploadImage = new FormData();
        files.forEach((file) => uploadImage.append("files", file));
        responseMedia = await axios.post(
          `${import.meta.env.VITE_API_URL}/request/image/upload`,
          uploadImage,
          {
            header: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(files.length);
        console.log(responseMedia.data.imageUrls);
        setFormData((prev) => ({
          ...prev,
          mediaUrls: responseMedia.data.imageUrls,
        }));
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/request/feedback/send`,
        {
          ...formData,
          mediaUrls: responseMedia?.data?.imageUrls || [],
        }
      );
      console.log(response);
      alert(response.data.message);
      navigate("/feedbackhub");
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = (indexToRemove) => {
    setArr((prev) => prev.filter((_, i) => i !== indexToRemove));
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  return (
    <div className="sendfeedback-container">
      <div className="sendfeedback-title">
        <h1>{t('Send Feedback')}</h1>
        <h2>{t('Hi,')} {userName}</h2>
        <p style={{ fontStyle: "italic" }}>
          {t('If you have any thing to tell us to improve our products or any question, please tell us below.')}
          {" "}
        </p>
      </div>
      <div className="feedback-content">
        {t('Subject(*)')}
        <input
          type="text"
          name="subject"
          id=""
          value={formData.subject}
          onChange={handleChange}
          onBlur={normalizeValue}
        />
        <br />
        {t('Your Feedback(*)')}
        <textarea
          name="message"
          id=""
          onChange={handleChange}
          onBlur={normalizeValue}
          value={formData.message}
        ></textarea>
      </div>
      <div className="inner-image">
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          accept=".jpg,.png"
          ref={mediaFileRef}
          onChange={handleFileSelect}
        />
        <Button
          className="upload-media"
          label="+"
          color="grey-button"
          onClick={() => mediaFileRef.current.click()}
        />
        <PhotoProvider>
          {arr
            .map((item, index) => (
              <div className="image-wrapper" key={index}>
                <PhotoView src={item}>
                  <img
                    src={item}
                    alt=""
                    style={{ cursor: "pointer", width: "150px" }}
                  />
                </PhotoView>
                <span
                  className="remove-icon"
                  onClick={() => handleRemove(index)}
                >
                  −
                </span>
              </div>
            ))
            .reverse()}
        </PhotoProvider>
      </div>
      <div className="feedback-button">
        <Button label={t("Send")} color="blue-button" onClick={handleSubmit} />
        <Button
          label={t("Cancel")}
          color="grey-button"
          onClick={() => navigate("/feedbackhub")}
        />
      </div>
    </div>
  );
}

export default SendUserFeedback;
