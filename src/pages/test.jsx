// src/components/AIGeneratorFrontend.js
import React, { useState } from 'react';
// Import Google Generative AI SDK
import { GoogleGenerativeAI } from '@google/generative-ai';

// *******************************************************************
// CẢNH BÁO: KHÔNG NÊN ĐẶT API KEY TRỰC TIẾP NHƯ THẾ NÀY TRONG ỨNG DỤNG SẢN XUẤT.
// Đây chỉ là ví dụ để minh họa việc gọi API trực tiếp từ frontend.
// Mọi người dùng đều có thể thấy API Key của bạn qua công cụ phát triển trình duyệt.
// *******************************************************************
const API_KEY = "YOUR_GEMINI_API_KEY"; // THAY THẾ BẰNG API KEY CỦA BẠN TẠI ĐÂY

// Khởi tạo GenAI SDK với API Key của bạn
const genAI = new GoogleGenerativeAI(API_KEY);

function AIGeneratorFrontend() {
    const [prompt, setPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAiResponse('');
        setError('');

        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            setError("Vui lòng thay thế 'YOUR_GEMINI_API_KEY' bằng API Key thật của bạn.");
            setLoading(false);
            return;
        }

        try {
            // Chọn mô hình Gemini (ví dụ: gemini-pro cho văn bản)
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Gửi yêu cầu tạo nội dung
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setAiResponse(text); // Cập nhật phản hồi từ AI
        } catch (err) {
            console.error("Lỗi khi gọi Gemini API:", err);
            setError(`Không thể nhận phản hồi từ AI: ${err.message}. Kiểm tra API Key và giới hạn sử dụng.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Công cụ Tạo Nội dung AI (Frontend Only)</h1>
            <p>Nhập yêu cầu của bạn dưới đây để AI tạo nội dung trực tiếp.</p>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <textarea
                    rows="8"
                    cols="60"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ví dụ: 'Viết một đoạn văn ngắn về lợi ích của trí tuệ nhân tạo.'"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    required
                />
                <br />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#28a745', // Màu xanh lá cây để phân biệt với backend
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                        opacity: loading || !prompt.trim() ? 0.6 : 1
                    }}
                >
                    {loading ? 'Đang tạo nội dung...' : 'Tạo Nội dung AI'}
                </button>
            </form>

            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', backgroundColor: '#ffe6e6' }}>
                    <p><strong>Lỗi:</strong> {error}</p>
                </div>
            )}

            {aiResponse && (
                <div style={{ border: '1px solid #28a745', padding: '15px', borderRadius: '4px', backgroundColor: '#e6ffe6' }}>
                    <h2>Phản hồi từ AI:</h2>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{aiResponse}</p>
                </div>
            )}
        </div>
    );
}

export default AIGeneratorFrontend;