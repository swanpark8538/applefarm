import { Link } from "react-router-dom";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom"; // useNavigate를 import합니다.
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const Header = (props) => {
  const isLogin = props.isLogin; //로그인 값 받아오기 (헤더에서 App.js)
  const logout = props.logout; //(App.js)헤더에서 보낸 로그아웃 받아오기
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useState({});
  const [memberGrade, setMemberGrade] = useState(null);
  const navigate = useNavigate(); // navigate 함수를 가져옵니다.

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          setMember(res.data.data);
          setMemberGrade(res.data.data.memberGrade);
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      setMember(null);
      setMemberGrade(null);
    }
  }, [isLogin]);

  return (
    <>
      <div className="header">
        <LogoForm />
        <div className="header2">
          <LoginForm
            isLogin={isLogin}
            logout={logout}
            memberGrade={memberGrade}
          />
        </div>
      </div>
    </>
  );
};

// 컴포넌트
const LogoForm = () => {
  return (
    <div className="main-logo">
      <Link to="/">
        <img src="../image/logo.png" alt="logo" />
      </Link>
    </div>
  );
};

const LoginForm = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;
  const memberGrade = props.memberGrade;

  return (
    <div className="header-link">
      {memberGrade ? ( //렌더링 같이 되는 조건으로 세팅하는 게 좀 더 안전하다.
        memberGrade === 2 ? (
          <>
            {/**
           * 
           <Link title="쪽지함">
             <span className="material-icons">email</span>
           </Link>
           * 
           */}
            <Link to="/mypage/loginInfo" title="마이페이지">
              <span className="material-icons">face</span>
            </Link>
            <Link to="/admin" title="관리자페이지">
              <span className="material-icons">account_circle</span>
            </Link>
            <Link to="#" title="로그아웃">
              <span className="material-icons" onClick={logout}>
                logout
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/mypage/wish" title="위시리스트">
              <span className="material-icons">favorite_border</span>
            </Link>
            <Link to="/mypage/loginInfo" title="마이페이지">
              <span className="material-icons">face</span>
            </Link>
            <Link to="#" title="로그아웃">
              <span className="material-icons" onClick={logout}>
                logout
              </span>
            </Link>
          </>
        )
      ) : (
        <>
          <Link to="/login" title="로그인">
            <span className="material-icons">face_5</span>
          </Link>
          <Link to="/join" title="회원가입">
            <span className="material-icons">assignment_ind</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
