import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <header className="header-container">
        <div className="logo">MyBoard</div>

        <div className="search-container">
            <input type="text" placeholder="검색어를 입력하세요..." />
            <button>검색</button>
        </div>

        <div className="auth-buttons">
            <button className="login-btn">로그인</button>
            <button className="signup-btn">회원가입</button>
        </div>

        <nav className="nav-bar">
            <ul>
            <li>전체</li>
            <li>Hot</li>
            <li>스포츠</li>
            <li>문화</li>
            </ul>
        </nav>
        </header>
    );
};

export default Header;
