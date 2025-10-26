import { Navigate } from "react-router-dom";

/**
 * 로그인 여부를 확인해 보호된 페이지 접근을 제어하는 컴포넌트
 * 
 * @param {boolean} isAuthenticated - 로그인 여부 (true/false)
 * @param {JSX.Element} element - 렌더링할 컴포넌트 (로그인된 경우)
 */
function ProtectedRoute({ isAuthenticated, element }) {
  // 로그인 안 되어 있으면 로그인 페이지로 이동
  // if (!isAuthenticated) {
  //   alert("로그인 후 이용 가능합니다.");
  //   return <Navigate to="/login" replace />;
  // }

  const [login, setLogin] = useState(false);

  const chekLogin = async () => {
    const response = await fetch('http://localhost:8000/users/me', {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      setLogin(true);
      return element;
    } else {
      setLogin(false);
      return <Navigate to="/login" replace />;
    }
  }

  // 로그인 되어 있으면 원래 페이지 렌더링

}

export default ProtectedRoute;