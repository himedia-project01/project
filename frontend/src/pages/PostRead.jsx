import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import "./PostRead.css";

function PostRead() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 게시글 데이터 불러오기
    useEffect(() => {
        const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8000/posts/read/${postId}`);
            if (!response.ok) {
            throw new Error("❗ 게시글을 불러오지 못했습니다.");
            }
            const data = await response.json();
            setPost(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchPost();
    }, [postId]);

    if (loading) return <div className="loading">⏳ 로딩 중...</div>;
    if (error) return <div className="error">❌ {error}</div>;
    if (!post) return <div>게시글이 없습니다.</div>;

    return (
    <div className="post-read-container">
      <div className="post-main">
        <div className="post-category">{post.category || "게시글"}</div>
        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <div className="post-author">{post.user_id || "작성자"}</div>
          <div className="post-date">
            {new Date(post.created_date).toLocaleDateString()}
          </div>
        </div>

        <div className="post-content">
          {post.content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="post-actions">
          <button>💬 댓글</button>
          <button>👍 좋아요</button>
        </div>
      </div>

      <div className="post-sidebar">
        <div className="sidebar-card">
          <h3>1015 부동산 대책, 집값 잡을까?</h3>
          <p>935명 투표 중</p>
          <button>👉 참여하기</button>
        </div>
      </div>
    </div>
  );
}

export default PostRead;