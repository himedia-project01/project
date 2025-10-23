import { FaSearch, FaUserCircle } from "react-icons/fa";
import "./Header.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ onLogoClick, onIconClick, userEmail, onLogout, isLogin }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [login, setLogin] = useState(false);

    useEffect(() => {
        chekLogin();
    }, [location]);

    const chekLogin = async () => {
        const response = await fetch('http://localhost:8000/users/me', {
            method: "GET",
            credentials: "include",
        });

        console.log(response)

        if (response.ok) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const handleClickProfile = async () => {
        console.log(login);

        if (login) {
            navigate('/mypage');
        } else {
            navigate('/login');
        }
    }

    const handleSignOut = async () => {
        if (confirm("정말 로그아웃하시겠습니까?")) {
            const response = await fetch('http://localhost:8000/users/logout', {
                method: "GET",
                credentials: "include",
            });

            // console.log(response);

            if (response.ok) {
                setLogin(false);
                navigate('/');
            }
        }


    }




    return (
        <header className="header">
            {/* 왼쪽: 로고 + 드롭다운 메뉴 */}
            <div className="header-left">
                {/* 🌀 로고 클릭 시 홈으로 이동 */}
                <div className="logo" onClick={onLogoClick}>
                    🌀
                </div>

                <nav className="menu">
                    {/* 구독 채널 드롭다운 */}
                    <div className="dropdown">
                        <span>구독 채널 ▾</span>
                        <div className="dropdown-content">
                            <a href="#">AI 트렌드</a>
                            <a href="#">기술 블로그</a>
                            <a href="#">개발자 뉴스</a>
                        </div>
                    </div>

                    {/* 주요 채널 드롭다운 */}
                    <div className="dropdown">
                        <span>주요 채널 ▾</span>
                        <div className="dropdown-content">
                            <a href="#">게시판</a>
                            <a href="#">공지사항</a>
                            <a href="#">문의하기</a>
                        </div>
                    </div>
                </nav>
            </div>

            {/* 중앙: 검색창 */}
            <div className="header-center">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="찾기" />
                </div>
            </div>

            {/* 오른쪽: 로그인/로그아웃 */}
            <div className="header-right">
                {login ? (
                    <>
                        <span style={{ marginRight: "10px" }}>{ }</span>
                        <button onClick={handleSignOut}>로그아웃</button>
                        <FaUserCircle className="user-icon" onClick={handleClickProfile} />
                    </>
                ) : (
                    <FaUserCircle className="user-icon" onClick={handleClickProfile} />
                )}
            </div>
        </header>
    );


}

export default Header;