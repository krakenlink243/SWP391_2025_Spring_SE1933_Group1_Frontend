import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ThreadCard({ thread }) {
  const {t}=useTranslation();
  return (
    <div className="border rounded p-4 shadow hover:bg-gray-50">
      <Link to={`${import.meta.env.VITE_API_URL}/community/threads/${thread.threadId}`}>
        <h3 className="text-lg font-semibold">{thread.title}</h3>
        <p className="text-sm text-gray-600">
          {t('Posted by')} {thread.username} {t('on')} {new Date(thread.createdAt).toLocaleString()}
        </p>
      </Link>
    </div>
  );
}
