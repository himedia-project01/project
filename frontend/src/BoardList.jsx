import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import './BoardList.css';

// 댓글 컴포넌트
function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    // 댓글 목록 불러오기
    useEffect(() => {
        if (!postId) return;
        fetch(`http://127.0.0.1:8000/api/comments/${postId}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error('댓글 불러오기 실패:', err));
    }, [postId]);

    // 댓글 작성
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!author.trim() || !content.trim()) return alert('작성자와 내용을 입력하세요.');

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
        .catch((err) => console.error('댓글 등록 실패:', err));
    };

    return (
        <div className="comment-wrap">
        <h4>💬 댓글 ({comments.length})</h4>
        <ul className="comment-list">
            {comments.map((c) => (
            <li key={c.id}>
                <strong>{c.author}</strong> : {c.content}
                <span className="date">({new Date(c.created_at).toLocaleString()})</span>
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
            />
            <button type="submit">등록</button>
        </form>
        </div>
    );
    }

    function BoardList() {
    const [notices, setNotices] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null); // 클릭된 게시글 ID

    useEffect(() => {
        fetch('http://127.0.0.1:8000/posts')
        .then((res) => res.json())
        .then((data) => {
            const noticeData = data.filter((item) => item.is_notice);
            const postData = data.filter((item) => !item.is_notice);
            setNotices(noticeData);
            setPosts(postData);
        })
        .catch((err) => console.error('게시글 불러오기 실패:', err));
    }, []);

    return (
        <div className="board-wrap">
        <h2 className="board-title">게시판 목록</h2>

        <Table hover className="board-table">
            <thead>
            <tr>
                <th style={{ width: '6%' }}>번호</th>
                <th>제목</th>
                <th style={{ width: '15%' }}>작성자</th>
                <th style={{ width: '12%' }}>작성일</th>
                <th style={{ width: '10%' }}>조회수</th>
                <th style={{ width: '8%' }}>추천</th>
            </tr>
            </thead>
            <tbody>
            {/* 공지글 */}
            {notices.map((n) => (
                <tr key={n.id} className="notice-row">
                <td>공지</td>
                <td className="notice-title"><strong>{n.title}</strong></td>
                <td>{n.author}</td>
                <td>{new Date(n.date).toLocaleDateString()}</td>
                <td>{n.views?.toLocaleString()}</td>
                <td>{n.likes}</td>
                </tr>
            ))}

            {/* 일반 게시글 */}
            {posts.map((p) => (
                <>
                <tr
                    key={p.id}
                    className="post-row"
                    onClick={() => setSelectedPostId(selectedPostId === p.id ? null : p.id)} // 클릭하면 댓글 표시
                >
                    <td>{p.id}</td>
                    <td className="post-title">{p.title}</td>
                    <td>{p.author}</td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>{p.views}</td>
                    <td>{p.likes}</td>
                </tr>

                {/* 선택된 게시글 아래 댓글 표시 */}
                {selectedPostId === p.id && (
                    <tr className="comment-row">
                    <td colSpan="6">
                        <CommentSection postId={p.id} />
                    </td>
                    </tr>
                )}
                </>
            ))}
            </tbody>
        </Table>
        </div>
    );
}

export default BoardList;
