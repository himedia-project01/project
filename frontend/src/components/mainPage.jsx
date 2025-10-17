import React, { useState } from "react";
import "./MainPage.css";

const MainPage = () => {
  // 예제 게시글 데이터
    const [posts, setPosts] = useState([
        { id: 1, title: "첫 번째 글", author: "홍길동", date: "2025-10-17" },
        { id: 2, title: "React 배우기", author: "김철수", date: "2025-10-16" },
        { id: 3, title: "게시판 만들기 프로젝트", author: "이재철", date: "2025-10-15" },
    ]);

    return (
        <div className="main-container">
        <h1>게시판</h1>
        <table className="post-table">
            <thead>
            <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>날짜</th>
            </tr>
            </thead>
            <tbody>
            {posts.map((post, index) => (
                <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <button className="write-btn">글쓰기</button>
        </div>
    );
};

export default MainPage;
