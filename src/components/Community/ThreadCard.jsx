import { Link } from "react-router-dom";

export default function ThreadCard({ thread }) {
  return (
    <div className="border rounded p-4 shadow hover:bg-gray-50">
      <Link to={`${import.meta.env.VITE_API_URL}/community/threads/${thread.threadId}`}>
        <h3 className="text-lg font-semibold">{thread.title}</h3>
        <p className="text-sm text-gray-600">
          Posted by {thread.username} on {new Date(thread.createdAt).toLocaleString()}
        </p>
      </Link>
    </div>
  );
}
