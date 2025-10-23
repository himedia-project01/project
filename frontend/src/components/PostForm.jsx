import { useState, useEffect } from "react";
import "./PostCreate.css";

function PostForm({ mode, initialData = {}, onSubmit }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [category, setCategory] = useState(initialData.category || "");

  useEffect(() => {
    // initialData가 바뀔 때 상태 업데이트
    setTitle(initialData.title || "");
    setContent(initialData.content || "");
    setCategory(initialData.category || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.length < 16 || content.length < 55) {
      alert("제목은 최소 16자, 내용은 최소 55자 이상 입력해주세요.");
      return;
    }

    onSubmit({ title, content, category });
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {/* 제목 */}
      <div className="form-section">
        <label className="form-label">제목</label>
        <input
          type="text"
          placeholder="제목을 작성해 주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          className="form-input"
        />
        <p className="char-count">{title.length} / 80 (최소 16자)</p>
      </div>

      {/* 내용 */}
      <div className="form-section">
        <label className="form-label">내용</label>
        <textarea
          placeholder="질문의 내용을 구체적으로 적어주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={10000}
          className="form-textarea"
        />
        <p className="char-count">{content.length} / 10,000 (최소 55자)</p>
      </div>

      {/* 카테고리 */}
      <div className="form-section">
        <label className="form-label">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="">관련 카테고리 선택</option>
          <option value="media">🚀 방송 / 미디어</option>
          <option value="trip">🌍 여행</option>
          <option value="sport">🏊‍♀️ 운동</option>
          <option value="game">🏆 게임</option>
          <option value="ai">👩‍💻 AI / 프로그래밍</option>
          <option value="etc">👀 기타고민</option>
        </select>
      </div>

      {/* 버튼 */}
      <div className="submit-section">
        {mode === "create" && (
          <div className="info-box">
            <p className="info-title">✅ 꼭 확인해 주세요.</p>
            <ul>
              <li>남기신 질문은 다른 사이트에서 검색을 통해 노출될 수 있어요.</li>
              <li>답변이 달리면 질문을 수정할 수 없어요.</li>
            </ul>
          </div>
        )}

        <button type="submit" className="submit-button">
          {mode === "create" ? "질문하기" : "수정하기"}
        </button>
      </div>
    </form>
  );
}

export default PostForm;