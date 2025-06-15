import React from "react";
import "./ProfilePage.css";
import ProfileHeader from "./ProfileHeader";
import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import particleConfig from "./particles.json";

// const ProfilePage = () => {
//   const particlesInit = async (main) => {
//     await loadFull(main); // Tải đầy đủ tính năng của tsparticles
//   };

//   return (
//     <div className="profile-page">
//       <div className="dynamic-background">
//         <Particles
//           id="tsparticles"
//           init={particlesInit}
//           options={particleConfig}
//           className="particles-canvas"
//         />
//       </div>
//       {/* ... phần nội dung ... */}
//     </div>
//   );
// };

// export default ProfilePage;

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="dynamic-background">
        <video src="/videos/Sequence 01.mp4" autoPlay loop muted></video>
      </div>
      <div className="profile-content">
        <ProfileHeader />
        <div className="profile-main">
          <div className="profile-left">
            <div className="profile-stats">
              <h3>Statistics</h3>
              <ul>
                <li>Posts: 120</li>
                <li>Followers: 300</li>
                <li>Following: 180</li>
              </ul>
            </div>
            <div className="profile-bio">
              <h3>Bio</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="profile-right"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
