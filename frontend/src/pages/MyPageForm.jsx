import { useState, useEffect } from "react";
import '../css/user.css'

function MyPage() {
    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "password": "",
        "nickname": "",
        "birth": "",
        "gender": "",
    });

    const getMyData = async () => {
        const response = await fetch(`http://localhost:8000/users/modify`, {
            credentials: 'include'
        });

        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getMyData();
    }, []);


    const [chkPassword, setChkPassword] = useState(false)
    const [chkNickname, setChkNickname] = useState(null)
    const [chkEmail, setChkEmail] = useState(null)

    const handleNameChange = (e) => {
        setUser({ ...user, name: e.target.value });
    };

    const handleEmailChange = (e) => {
        setUser({ ...user, email: e.target.value });
    };

    // 이메일 중복 검사를 위한 함수
    const ValidEmail = async (email) => {
        try {
            const response = await fetch(`http://localhost:8000/users/check-email/${email}`)

            if (response.status == 200) {
                setChkEmail(true)
            } else {
                setChkEmail(false)
            }
        } catch (error) {
            setChkNickname(false)
        }
    }

    const handlePasswordChange = (e) => {
        setUser({ ...user, password: e.target.value });
    };

    // 비밀번호 확인 로직
    const ChkValidPassword = (e) => {
        // setChkPassword(e.target.value);

        if (user.password == e.target.value) setChkPassword(true);
        else setChkPassword(false);
    }

    const handleNicknameChange = (e) => {
        setUser({ ...user, nickname: e.target.value });
        ValidNickname(e.target.value)
    };

    const handleBirth = (e) => {
        setUser({ ...user, birth: e.target.value });
        // console.log(e.target.value);
    }

    // 닉네임 중복 검사를 위한 함수
    const ValidNickname = async (nickname) => {

        console.log(nickname.length);

        if (nickname.length > 0) {
            try {
                const response = await fetch(`http://localhost:8000/users/check-nickname/${nickname}`);

                // 사용가능한 경우에만 true로 변경
                if (response.status == 200) {
                    setChkNickname(true)
                } else {
                    setChkNickname(false)
                }
            } catch (error) {
                setChkNickname(false)
            }
        }
    };

    const handleGenderChange = (e) => {
        setUser({ ...user, gender: e.target.value })
    };

    const handleSubmit = async (e) => {
        const res = await fetch('http://localhost:8000/users/modify', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })

        const data = await res.json()
        setUser(data)

    }

    return (
        <div id="wrap">
            <form className="myPage_form">
                <h1>마이페이지</h1>

                <label htmlFor="name">이름</label>
                <input type="text" id='name' placeholder='이름' value={user.name} onChange={handleNameChange} />

                <label htmlFor="id">이메일</label>
                <input type="text" id="email" placeholder='이메일' value={user.email} onChange={handleEmailChange} />

                {chkEmail !== null && (
                    chkEmail ? ("") : (<p style={{ color: "red" }}>이미 가입된 이메일입니다.</p>)
                )}

                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" placeholder='비밀번호 입력' onChange={handlePasswordChange} />

                <label htmlFor="password_check">비밀번호 확인</label>
                <input type="password" id="password_check" placeholder='비밀번호 확인' onChange={ChkValidPassword} />

                <label htmlFor="nickname">닉네임</label>
                <input type="text" id="nickname" placeholder='닉네임' value={user.nickname} onChange={handleNicknameChange} />

                {chkNickname !== null && user.nickname.length > 0 && (
                    chkNickname ? (<p>사용 가능한 닉네임입니다.</p>) : (<p style={{ color: "red" }}>이미 사용 중인 닉네임입니다.</p>)
                )}

                <label htmlFor="birth">생년월일</label>
                <input type="date" id="birth" onChange={handleBirth} value={user.birth} />

                <ul className='gender-ul'>
                    <li className='gender-li'>
                        <input type="radio" name="gender" id="female" value="female" onChange={handleGenderChange}
                            checked={user.gender === "female"} />
                        <label htmlFor="female">여자</label>
                    </li>

                    <li className='gender-li'>
                        <input type="radio" name="gender" id="male" value="male" onChange={handleGenderChange}
                            checked={user.gender === "male"} />
                        <label htmlFor="male">남자</label>
                    </li>

                    <li className='gender-li'>
                        <input type="radio" name="gender" id="none" value="none" onChange={handleGenderChange}
                            checked={user.gender === "none"} />
                        <label htmlFor="none">선택안함</label>
                    </li>
                </ul>

                <button type="button" onClick={handleSubmit}>수정</button>
            </form>
        </div>
    )
}

export default MyPage;