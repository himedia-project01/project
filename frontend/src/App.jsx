import './App.css'

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Header";
import BoardList from "./BoardList";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignupForm";
import MyPageForm from "./pages/MyPageForm";
import PostList from "./pages/PostList";        // 게시글 목록
import PostCreate from "./pages/PostCreate";    // 게시글 작성
import PostRead from "./pages/PostRead";        // 게시글 상세
import PostEdit from "./pages/PostEdit";        // 게시글 수정
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [currentPage, setCurrentPage] = useState("board"); // 기본 홈
  const [userEmail, setUserEmail] = useState("");

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setCurrentPage("board");
  };

  const handleLogout = () => {
    setUserEmail("");
    setCurrentPage("board");
  };

  const isAuthenticated = Boolean(userEmail); // ✅ 로그인 여부 확인

  return (
    <div>
      <Header
        onLogoClick={() => setCurrentPage("board")}     // ✅ 로고 클릭 시 홈으로
        onIconClick={() => setCurrentPage("login")}     // 로그인 버튼 클릭 시 로그인폼
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* {currentPage === "board" && <BoardList />}
      {currentPage === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} />} */}

      <Routes>
        <Route path="/" element={<BoardList onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/join" element={<SignUpForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/mypage" element={<MyPageForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/posts" element={<PostList />} />
        <Route
          path="/posts/create"
          element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<PostCreate />} />} />
        <Route path="/posts/:postId" element={<PostRead />} />
        <Route
          path="/posts/:postId/edit"
          element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<PostEdit />} />} />
      </Routes>

    </div>
  );
}

export default App
