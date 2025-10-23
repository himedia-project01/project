import { useEffect, useState } from 'react';

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

  // 댓글 불러오기
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/comments/${postId}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error("댓글 불러오기 실패:", err));
    }, [postId]);

  // 댓글 작성
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!author || !content) return alert('작성자와 내용을 입력해주세요.');

        fetch('http://127.0.0.1:8000/api/comments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, author, content }),
        })
        .then((res) => res.json())
        .then((newComment) => {
            setComments([...comments, newComment]);
            setContent('');
        })
        .catch((err) => console.error("댓글 등록 실패:", err));
    };

    return (
        <div className="comment-wrap">
        <h4>댓글 ({comments.length})</h4>
        <ul className="comment-list">
            {comments.map((c) => (
            <li key={c.id}>
                <strong>{c.author}</strong> : {c.content}
                <span className="date">
                ({new Date(c.created_at).toLocaleString()})
                </span>
            </li>
            ))}
        </ul>

        <form onSubmit={handleSubmit} className="comment-form">
            <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            />
            <textarea
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit">등록</button>
        </form>
        </div>
    );
}

export default CommentSection;
