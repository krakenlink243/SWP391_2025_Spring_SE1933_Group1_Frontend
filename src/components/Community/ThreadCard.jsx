import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ThreadCard({ thread }) {
  const {t}=useTranslation();
  return (
    <div className="border rounded p-4 shadow hover:bg-gray-50">
      {/* <Link to={`/community/threads/${thread.threadId}`}>
        <h3 className="text-lg font-semibold">{thread.title}</h3>
        <p className="text-sm text-gray-600">
          {t('Posted by')} {thread.username} {t('on')} {new Date(thread.createdAt).toLocaleString()}
        </p>
      </Link> */}
      <table class="table-container" role="table" aria-label="Forum topics table">
        <thead>
          <tr class="table-header-row">
            <th class="table-header-cell">Topic</th>
            <th class="table-header-cell">Author</th>
            <th class="table-header-cell">Posted on</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row">
            <td class="table-cell topic">{thread.title}</td>
            <td class="table-cell">{thread.username}</td>
            <td class="table-cell">{new Date(thread.createdAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
