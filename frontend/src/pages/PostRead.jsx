import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import "../css/PostRead.css";

function PostRead() {
    const { postId } = useParams();
    const navigate = useNavigate(); // 페이지 이동용
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/posts/read/${postId}`);
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

    // 삭제 버튼 클릭 시
    const handleDelete = async () => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/posts/delete/${postId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("게시글 삭제 실패");
            }
            alert("게시글이 삭제되었습니다.");
            navigate("/"); // 삭제 후 메인 페이지로 이동
        } catch (err) {
            alert(err.message);
        }
    };

    // 수정 버튼 클릭 시
    const handleEdit = () => {
        navigate(`/posts/edit/${postId}`); // 수정 페이지로 이동
    };

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
                    <div className="post-date">{new Date(post.created_date).toLocaleDateString()}</div>
                </div>

                <div className="post-content">
                    {post.content.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </div>

                <div className="post-actions">
                    <button>💬 댓글</button>
                    <button>👍 좋아요</button>
                    <button onClick={handleEdit}>✏️ 수정</button>
                    <button onClick={handleDelete}>🗑️ 삭제</button>
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