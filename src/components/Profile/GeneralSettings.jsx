import React from "react";

const GeneralSettings = ({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  error,
  successMessage,
}) => {
  return (
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

        <div className="form-group">
          <label htmlFor="country">COUNTRY</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="">(Do not display)</option>
            <option value="Vietnam">Vietnam</option>
            <option value="USA">United States</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gender">GENDER</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">(Unknown)</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
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

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {error && <p className="feedback-error">{error}</p>}
        {successMessage && <p className="feedback-success">{successMessage}</p>}
      </div>
    </form>
  );
};

export default GeneralSettings;
