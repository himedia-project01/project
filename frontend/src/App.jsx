import './App.css'

import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Header from "./Header";
import BoardList from "./BoardList";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignupForm"
import MyPageForm from "./pages/MyPageForm"

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
      </Routes>

    </div>
  );
}

export default App;

