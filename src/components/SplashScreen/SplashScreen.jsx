import React, { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

// Component nhận một prop là `onFinished` để báo cho App biết khi nào nó kết thúc
const SplashScreen = ({ onFinished }) => {
  // Sử dụng state để quản lý các giai đoạn của splash screen
  // 'initial': Màn hình chờ ban đầu
  // 'animating': Đang chạy hiệu ứng sóng và chuyển màu
  // 'fading': Đang mờ dần để vào app
  const [stage, setStage] = useState("initial");
  const audioRef = useRef(null);

  // Khởi tạo đối tượng Audio một lần duy nhất
  useEffect(() => {
    audioRef.current = new Audio("/sounds/boot_sound.mp3");
    audioRef.current.load();
  }, []);

  // Xử lý các hiệu ứng sau khi state thay đổi
  useEffect(() => {
    // Khi giai đoạn 'animating' bắt đầu
    if (stage === "animating") {
      // Hẹn giờ để chuyển sang giai đoạn 'fading'
      // Thời gian này phải khớp với thời gian dài nhất của animation (sóng hoặc chuyển màu)
      const fadeTimer = setTimeout(() => {
        setStage("fading");
      }, 4000); // 4 giây cho hiệu ứng sóng

      return () => clearTimeout(fadeTimer);
    }

    // Khi giai đoạn 'fading' bắt đầu
    if (stage === "fading") {
      // Hẹn giờ để kết thúc hoàn toàn và gọi onFinished
      // Thời gian này khớp với transition 'opacity' trong CSS
      const finishTimer = setTimeout(() => {
        onFinished(); // Báo cho component cha là đã xong
      }, 1000); // 1 giây để mờ dần

      return () => clearTimeout(finishTimer);
    }
  }, [stage, onFinished]);

  // Hàm xử lý khi người dùng click
  const handleStart = () => {
    // Chỉ hoạt động ở giai đoạn 'initial'
    if (stage === "initial") {
      // Phát âm thanh
      audioRef.current
        .play()
        .catch((e) => console.error("Audio play error:", e));
      // Chuyển sang giai đoạn tiếp theo
      setStage("animating");
    }
  };

  // Tạo class name động dựa trên state hiện tại
  const containerClasses = `splash-container stage-${stage}`;

  return (
    <div className={containerClasses} onClick={handleStart}>
      <div className="splash-content">
        {/* Hiệu ứng sóng PSP */}
        <div className="psp-wave"></div>
        <div className="continue-text">STEAM SYSTEM GROUP 1</div>
      </div>
    </div>
  );
};

export default SplashScreen;
