import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import '../css/user.css'

function LoginForm() {

    const navigate = useNavigate()

    const [user, setUser] = useState({
        "email": "",
        "password": "",
    });
    const [chkEmail, setChkEmail] = useState(false);
    const [chkPw, setChkPw] = useState(false);

    const handleEmailChange = (e) => {
        setUser({ ...user, email: e.target.value });
    }

    const handlePasswordChange = (e) => {
        setUser({ ...user, password: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.email != null && user.email != '') {
            setChkEmail(true);
        }

        if (user.password != null && user.password != '') {
            setChkPw(true);
        }

        if (chkEmail && chkPw) {

            console.log(user.email);
            console.log(user.password);
            try {
                const response = await fetch('http://localhost:8000/users/login', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    navigate('/');
                }
            }
            catch (error) {
                console.error("에러 : " + error)
            }
        }

    }

    return (
        <div id="wrap">
            <form className="login-form">
                <h1>로그인</h1>
                <label htmlFor="email">아이디</label>
                <input type="text" id="email" name="email" onChange={handleEmailChange} placeholder="이메일을 입력하세요" />
                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" name="password" onChange={handlePasswordChange} placeholder="비밀번호를 입력하세요" />

                <button type='submit' onClick={handleSubmit}>로그인</button>


                <ul className="button-list">
                    <li>아이디 찾기</li>
                    <li>비밀번호 재설정</li>
                    <li><Link className='link' to={'/join'}>회원가입</Link></li>
                </ul>

            </form>
        </div>
    )
}

export default LoginForm;