import { useState } from "react";
import axios from "axios";

export default function CreateThreadModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        await axios.post(`${import.meta.env.VITE_API_URL}/api/discussions`, {
            title,
            content
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Thread</h2>
                <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="Content"
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
