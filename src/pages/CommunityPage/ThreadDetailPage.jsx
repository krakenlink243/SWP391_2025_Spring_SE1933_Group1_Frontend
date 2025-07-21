// src/pages/ThreadDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../../components/Community/CommentSection";
import { Link } from "react-router-dom";
import "./ThreadDetailPage.css";
import ThreadView from "../../components/Community/ThreadView";
import EditThreadModal from "../../components/Community/EditThreadModal";

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const CUR_USERID = localStorage.getItem("userId");
  const [editingThreadId, setEditingThreadId] = useState(null);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/discussions/${threadId}`)
      .then((res) => {
        setThread(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
    axios.get(`${import.meta.env.VITE_API_URL}/api/discussions/${threadId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [threadId]);

  if (!thread) return <p className="p-4" style={{ color: "white" }}>Loading thread...</p>;

  return (
  <div className="thread-container">
    <div className="thread">
      {editingThreadId === thread.threadId ? (
        <EditThreadModal
          thread={thread}
          onCancel={() => setEditingThreadId(null)}
          onSave={(updatedThread) => {
            setThread(updatedThread);
            setEditingThreadId(null);
          }}
        />
      ) : (
        <ThreadView
          thread={thread}
          CUR_USERID={CUR_USERID}
          onEditClick={() => setEditingThreadId(Number(thread.threadId))}
        />
      )}
    </div>

    <CommentSection threadId={threadId} comments={comments} setComments={setComments} />
  </div>
);
}
