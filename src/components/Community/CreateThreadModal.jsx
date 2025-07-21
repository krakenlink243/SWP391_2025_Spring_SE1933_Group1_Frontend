// src/pages/CreateThreadPage.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

export default function CreateThreadPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        try {
            if (!title || !content) {
                alert("Title and content are required.");
                return;
            }
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/community/thread/create/${userId}`,
                {
                    title,
                    content
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Thread created successfully!");
            navigate("/community");
        } catch (error) {
            console.error("Failed to create thread:", error);
        }
    };

    return (    
            <div className="sendfeedback-container">
                <div className="sendfeedback-title">
                    <h1>Create New Thread</h1>
                    <p style={{ fontStyle: "italic" }}>
                        What's on your mind?{" "}
                    </p>
                </div>
                <div className="feedback-content">
                    Title(*)
                    <input
                        type="text"
                        placeholder="Title of your thread"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <br />
                    Content(*)
                    <textarea
                        name="content"
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                    
                <div className="feedback-button">
                    <Button label="Cancel" onClick={() => navigate("/community")} color="red-button" />
                    <Button label="Post" onClick={handleSubmit} color="blue-button" />
                </div>
            </div>

    );
}
