import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import "./PostCreate.css";

function PostUpdate() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        setInitialData(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("수정 실패");
      alert("게시글이 수정되었습니다!");
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>게시글 정보를 불러오는 중...</p>;
  if (!initialData) return <p>게시글 데이터를 찾을 수 없습니다.</p>;

  return (
    <div className="post-create-container">
      <h1 className="page-title">질문 수정하기</h1>
      <p className="page-subtitle">질문 내용을 다시 다듬어 보세요.</p>

      <PostForm mode="update" initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}

export default PostUpdate;