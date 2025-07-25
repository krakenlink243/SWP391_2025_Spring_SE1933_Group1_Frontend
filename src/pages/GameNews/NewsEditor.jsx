import React, { useState, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "./NewsEditor.css";
import axios from "axios";
import { trimValue } from "../../utils/validators";

const MAX_TITLE_LENGTH = 255;
const MAX_SUMMARY_LENGTH = 255;

function NewsEditor() {
  const navigate = useNavigate();
  const { newsId, gameId } = useParams();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(!!newsId);

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append("files", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/request/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrls = response.data.imageUrls;
      if (!imageUrls?.length) throw new Error("No image URL returned");

      return {
        type: "image",
        props: { url: imageUrls[0] },
      };
    },
  });

  const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/request/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const url = response.data.imageUrls?.[0];
    if (!url) throw new Error("No thumbnail image URL returned");
    return url;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/game/news/view/${newsId}`
        );
        const data = response.data;
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setThumbnail(data.thumbnail || "");

        const blocks = await editor.tryParseMarkdownToBlocks(data.markdown || "");
        await editor.replaceBlocks(editor.document, blocks);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (newsId) fetchNews();
  }, [newsId]);

  const handleSubmit = async () => {
    const finalTitle = trimValue(title);
    const finalSummary = trimValue(summary);

    if (!finalTitle) {
      alert("Title cannot be empty.");
      return;
    }
    if (!finalSummary) {
      alert("Summary cannot be empty.");
      return;
    }

    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      const payload = {
        title: finalTitle,
        summary: finalSummary,
        markdown,
        thumbnail,
      };

      const url = newsId
        ? `${import.meta.env.VITE_API_URL}/game/news/edit/${newsId}`
        : `${import.meta.env.VITE_API_URL}/game/news/${gameId}/create`;
      const method = newsId ? "put" : "post";

      await axios[method](url, payload);
      alert("News saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error submitting news:", err);
    }
  };

  if (loading) return <div className="news-editor-loading">Loading...</div>;

  return (
    <div className="news-editor-container">
      <h2 className="editor-section-title">
        {newsId ? "Edit News" : "Create News"}
      </h2>

      <input
        className="news-title-input"
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={(e) => {
          const trimmed = trimValue(e.target.value);
          setTitle(trimmed.length > MAX_TITLE_LENGTH ? trimmed.slice(0, MAX_TITLE_LENGTH) : trimmed);
        }}
      />

      <textarea
        className="news-summary-textarea"
        placeholder="Write a short summary..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        onBlur={(e) => {
          const trimmed = trimValue(e.target.value);
          setSummary(trimmed.length > MAX_SUMMARY_LENGTH ? trimmed.slice(0, MAX_SUMMARY_LENGTH) : trimmed);
        }}
      />

      <div className="thumbnail-section">
        <label htmlFor="thumbnail">Thumbnail Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadThumbnail(file);
              setThumbnail(url);
            }
          }}
        />
        {thumbnail && (
          <img
            src={thumbnail}
            alt="Thumbnail preview"
            className="thumbnail-preview"
          />
        )}
      </div>

      <BlockNoteView editor={editor} className="blocknote-editor" />

      <div className="news-actions-wrapper">
        <Button
          label="Cancel"
          color="grey-button"
          onClick={() => {
            if (!gameId) {
              navigate(-1);
            } else {
              navigate(`/news/${gameId}`);
            }
          }}
        />
        <Button label="Save" color="blue-button" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default NewsEditor;