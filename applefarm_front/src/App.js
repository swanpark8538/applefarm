import Header from "./page/common/Header";
import Footer from "./page/common/Footer";
import "./page/common/default.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Ref from "./page/common/Ref";
import Mypage from "./page/member/Mypage";
import MemberWish from "./page/member/MemberWish";
import BoardMain from "./page/board/BoardMain";
import Join from "./page/member/Join";
import Admin from "./page/admin/Admin";
import Login from "./page/member/Login";
// import QualitySelectFrm from "./page/product/QualitySelectFrm";
import { useEffect, useState } from "react";
import MemberInfo from "./page/member/MemberInfo";
import Product from "./page/product/Product";
import axios from "axios";
import Payment from "./page/member/Payment";

import Main from "./page/common/Main";
import DeleteMember from "./page/member/DeleteMember";

import Nav from "./page/common/Nav";
import CompletePayment from "./page/member/CompletePayment";
import Swal from "sweetalert2";
import AdminChatRoomList from "./page/admin/AdminChatRoomList";
import AdminChatModal from "./page/admin/AdminChatModal";

function App() {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberInfo, setMemberInfo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  //스토리지에 저장된 데이터를 꺼내서 객체형식으로 변환
  const obj = JSON.parse(window.localStorage.getItem("member"));
  const [isLogin, setIsLogin] = useState(obj ? true : false); //로그인상태를 체크하는 state
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //토큰값
  const [expiredTime, setExpiredTime] = useState(
    obj ? new Date(obj.tokenExpired) : ""
  ); //만료시간
  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  const login = (accessToken) => {
    //로그인 성공 시 받은 accessToken을 token state에 저장
    setToken(accessToken);
    //로그인 성공한 순간을 기준으로 1시간 뒤에 만료시간임 -> 그데이터를 저장
    const tokenExpired = new Date(new Date().getTime() + 60 * 60 * 1000);
    setExpiredTime(tokenExpired);
    //토큰이랑, 만료시간을 객체로 묶은 후 문자열로 변환해서 localStorage에 저장
    const obj = { accessToken, tokenExpired: tokenExpired.toISOString() };
    //localStorage에는 문자열만 저장이 가능하므로 묶은 객체도 문자열로 변환
    const member = JSON.stringify(obj);
    //로컬스토리지에 데이터 저장
    window.localStorage.setItem("member", member);
    //axios헤더에 토큰값 자동설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    setIsLogin(true);

    const remainingTime = tokenExpired.getTime() - new Date().getTime();
    console.log(remainingTime);
    setTimeout(logout, remainingTime);
  };
  const logout = () => {
    navigate("/");
    //로그인할때 변경한 사항을 모두 원래대로 복원
    setToken("");
    setExpiredTime("");
    window.localStorage.removeItem("member");
    axios.defaults.headers.common["Authorization"] = null;
    setIsLogin(false);
  };

  //페이지가 로드되면,새로고침되면
  useEffect(() => {
    if (isLogin) {
      //로그인이 되어있으면
      //저장해 둔 만료시간을 꺼내서 현재시간과 비교한 후 종료함수 설정

      const remainingTime = expiredTime.getTime() - new Date().getTime();
      setTimeout(logout, remainingTime);

      axios
        .get(backServer + "/member")
        .then((res) => {
          setMemberInfo(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="wrap">
      <header>
        <Header isLogin={isLogin} logout={logout} /> {/*여기는 isLogin 값*/}
        <Nav />
      </header>
      <main className="container">
        <section className="inner-wrap">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/ref" element={<Ref />} />
            <Route
              path="/mypage/*"
              element={<Mypage isLogin={isLogin} logout={logout} />}
            />
            {/* isLogin={isLogin} 추가 필요 - 삭제 예정*/}
            <Route
              path="/board/*"
              element={<BoardMain isLogin={isLogin} logout={logout} />}
            />
            <Route path="/join" element={<Join />} />
            <Route path="/admin/*" element={<Admin isLogin={isLogin} />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route
              path="/purchase/:productNo/:bid"
              element={<Payment isLogin={isLogin} />}
            />
            <Route
              path="/completePayment/:productNo"
              element={<CompletePayment isLogin={isLogin} />}
            />
            {/*setIsLogin을 줘야 값이 변경되니까*/}
            <Route path="/product/*" element={<Product isLogin={isLogin} />} />
          </Routes>
        </section>
      </main>
      {/* 챗봇 */}
      <button className="chat-btn" onClick={handleOpen}>
        <svg
          width="40"
          height="40"
          fill="#0092E4"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          id="github"
        >
          <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z" />
        </svg>
      </button>
      {modalOpen && (
        <AdminChatModal setModalOpen={setModalOpen} memberInfo={memberInfo} />
      )}
      <Footer />
    </div>
  );
}

export default App;
