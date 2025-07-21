// EditThreadModal.jsx
import { useState } from "react";
import "./EditThreadModal.css";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
export default function EditThreadModal({ thread, onCancel, onSave }) {
    const [title, setTitle] = useState(thread.title);
    const [content, setContent] = useState(thread.content);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...thread, title, content });
    };


    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this thread?");
        if (!confirmed) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/discussions/${thread.threadId}`, {
                method: "DELETE",
            });
            alert("Thread deleted successfully.");
            navigate("/community");
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete the thread. Please try again.");
        }
    };
    return (
        <div className="edit-container">
            <div className="edit-thread-form">
                <div className="input-container">
                    <label style={{ color: "white" }}>Title(*)</label>
                    <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label style={{ color: "white" }}>Content(*)</label>
                    <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div className="edit-buttons">
                    <Button label="Cancel" type="button" onClick={onCancel} color="red-button" />
                    <Button label="Delete" type="button" onClick={handleDelete} color="red-button" />
                    <Button label="Save" disabled={!title || !content} onClick={handleSubmit} color="blue-button" />
                </div>
            </div>
        </div>
    );
}
