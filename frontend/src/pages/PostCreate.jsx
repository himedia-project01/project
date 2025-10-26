import PostForm from "../components/PostForm";
import "../css/PostCreate.css";

function PostCreate() {
  const handleCreate = async (postData) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error("작성 실패");
      alert("질문이 등록되었습니다!");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="post-create-container">
      <h1 className="page-title">무엇이든 물어보세요</h1>
      <p className="page-subtitle">답변은 언제나 무료예요.</p>

      <PostForm mode="create" onSubmit={handleCreate} />
    </div>
  );
}

export default PostCreate;