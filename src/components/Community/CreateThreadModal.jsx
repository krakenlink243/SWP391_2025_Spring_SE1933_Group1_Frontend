import { useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

export default function CreateThreadModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {t}=useTranslation();
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
                <h2 className="text-xl font-bold mb-4">{t('Create New Thread')}</h2>
                <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder={t("Title")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full mb-4 p-2 border rounded"
                    placeholder={t("Content")}
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="d-flex justify-content-around gap-2">
                    <Button
                        label="Cancel"
                        onClick={onClose}
                        color="red-button"
                    />
                    <Button
                        label={t("Post")}
                        onClick={handleSubmit}
                        color="blue-button"
                    />
                </div>
            </div>
        </div>
    );
}
