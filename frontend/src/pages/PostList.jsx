import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/posts/list");
        if (!response.ok) {
          throw new Error("❗ 게시글 목록을 불러오지 못했습니다.");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">⏳ 로딩 중...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="post-list-container">
      <div className="list-header">
        <h1 className="page-title">질문 목록</h1>
        <button
          className="create-button"
          onClick={() => navigate("/posts/create")}
        >
          ✍️ 질문하기
        </button>
      </div>

      {posts.length === 0 ? (
        <p>아직 등록된 질문이 없습니다.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li
              key={post.id}
              className="post-item"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className="post-category">{post.category || "기타"}</div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-snippet">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
              <div className="post-meta">
                <span>{post.user_id || "작성자"}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;