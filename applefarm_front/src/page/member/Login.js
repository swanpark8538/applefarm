import { useEffect, useState } from "react";
import { Button1, Button2, Button3, Input } from "../../component/FormFrm";
import "./member.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "react-modal";

const Login = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberId, setMemberId] = useState(""); //아이디
  const [memberPw, setMemberPw] = useState(""); //비밀번호
  const [findIdModalIsOpen, setFindIdModalIsOpen] = useState(false); //아이디 찾기 모달 열기/닫기
  const [findPwModalIsOpen, setFindPwModalIsOpen] = useState(false); //비밀번호 찾기 모달 열기/닫기

  const [findEmail, setFindEmail] = useState(""); //이메일로 아이디 찾기

  const [checkRegEmail, setCheckRegEmail] = useState(""); //이메일 정규식 메세지

  const [emailBtnDisabled, setEmailBtnDisabled] = useState(false); //이메일 전송 버튼

  const [verifCode, setVerifCode] = useState(""); //이메일 인증코드
  const [checkVerifCode, setCheckVerifCode] = useState(""); //인증코드 정규식 메세지
  const [currentAuthCode, setCurrentAuthCode] = useState(""); //인증코드 저장

  const [emailInputDisabled, setEmailInputDisabled] = useState(false); //이메일 인풋
  const [verifCodeInputDisabled, setVerifCodeInputDisabled] = useState(false);
  const [verifCodeBtnDisabled, setVerifCodeBtnDisabled] = useState(false);

  const [chkResetPw, setChkResetPw] = useState(true); //비밀번호 재설정 체크
  const [checkRegPw, setCheckRegPw] = useState(""); //비밀번호 정규식 메세지
  const [checkRePw, setCheckRePw] = useState(""); //비밀번호 확인 메세지

  //새 비밀번호
  const [updatePw, setUpdatePw] = useState("");

  //이전 비밀번호
  const [chkUpdatePw, setChkUpdatePw] = useState("");

  const changeEmail = (e) => {
    setFindEmail(e.target.value);
  };

  const changeVerifCode = (e) => {
    setVerifCode(e.target.value);
  };

  const changeUpdatePw = (e) => {
    setUpdatePw(e.target.value);
  };

  const changeChkUpdatePw = (e) => {
    setChkUpdatePw(e.target.value);
  };

  const loginFunction = props.login;

  const navigate = useNavigate();

  // 아이디 찾기 모달 열기
  const openFindIdModal = () => {
    setFindIdModalIsOpen(true);
  };

  // 아이디 찾기 모달 닫기
  const closeFindIdModal = () => {
    setFindIdModalIsOpen(false);
    setFindEmail("");
    setCheckRegEmail("");
    setEmailInputDisabled(false);
    setEmailBtnDisabled(false);
  };

  // 비밀번호 찾기 모달 열기
  const openFindPwModal = () => {
    setFindPwModalIsOpen(true);
  };

  // 비밀번호 찾기 모달 닫기
  const closeFindPwModal = () => {
    setFindPwModalIsOpen(false);
    setEmailInputDisabled(false);
    setVerifCodeBtnDisabled(false);
    setVerifCodeInputDisabled(false);
    setVerifCode("");
    setFindEmail("");
    setCheckRegEmail("");
    setEmailBtnDisabled(false);
    setCheckRegPw("");
    setUpdatePw("");
    setChkUpdatePw("");
    setChkResetPw(true);
  };

  //모달 스타일
  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "1000", //오버레이 z-index
    },
    content: {
      padding: "39px",
      width: "50%",
      height: "50%",
      margin: "12% auto",
      borderRadius: "15px",
      zIndex: "1001", //모달 컨텐츠 z-index
      position: "relative", //모달 컨텐츠 포지션,이게 있어야 zIndex 사용
    },
  };

  const LogoForm = () => {
    return (
      <div className="main-logo">
        <Link to="/">
          {/* <img src="../image/logo.png" alt="logo" /> */}
          <img
            src="../image/apple.png"
            alt="logo"
            style={{ width: "35px", height: "auto" }}
          />
        </Link>
      </div>
    );
  };

  const enter = (e) => {
    if (e.keyCode === 13 && memberId !== "" && memberPw !== "") {
      login();
    }
  };

  //이메일 정규식
  const chkRegEmail = () => {
    const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (regEmail.test(findEmail)) {
      setCheckRegEmail("");
      setEmailBtnDisabled(false);
    } else {
      setEmailBtnDisabled(true);
      setCheckRegEmail(
        "이메일 주소를 다시 확인해주세요. 예)applefarm@applefarm.co.kr"
      );
    }
  };

  //이메일로 인증 받고 아이디 찾기
  const findId = () => {
    const m = { memberEmail: findEmail };

    console.log(m.memberEmail);

    if (findEmail !== "") {
      axios
        .post(backServer + "/member/findId", m)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "no email") {
            Swal.fire("존재하지 않은 이메일 주소입니다.");
            setEmailInputDisabled(false);
            setEmailBtnDisabled(false);
          } else if (res.data.message === "success") {
            Swal.fire("해당 이메일로 아이디를 전송했습니다.");
            setEmailInputDisabled(true);
            setEmailBtnDisabled(true);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("이메일 주소를 다시 확인해주세요.");
    }
  };

  //이메일 정규식 + 이메일로 인증코드 전송
  const sendEmail = () => {
    const m = { memberEmail: findEmail };

    const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (regEmail.test(findEmail) && findEmail !== "") {
      axios
        .post(backServer + "/member/sendEmail", m)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "no email") {
            Swal.fire("존재하지 않은 이메일 주소입니다.");
            const authCode = res.data.data;
            console.log(authCode);
            setCurrentAuthCode(authCode);
            setEmailInputDisabled(false);
            setEmailBtnDisabled(false);
          } else if (res.data.message === "success") {
            Swal.fire("이메일 주소로 인증코드가 전송되었습니다.");
            const authCode = res.data.data;
            console.log(authCode);
            setCurrentAuthCode(authCode);
            setEmailInputDisabled(true);
            setEmailBtnDisabled(true);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else if (findEmail === "") {
      Swal.fire("이메일 주소를 다시 확인해주세요.");
    }
  };

  /**인증코드 === 입력코드 */
  const chkVerifCode = () => {
    console.log(verifCode);
    console.log(currentAuthCode);
    if (currentAuthCode === verifCode && verifCode !== "") {
      Swal.fire("인증이 완료되었습니다.");
      setVerifCodeInputDisabled(true);
      setVerifCodeBtnDisabled(true);
      setChkResetPw(false);
    } else {
      Swal.fire("인증코드를 다시 확인해주세요.");
      setVerifCodeInputDisabled(false);
    }
  };

  //비밀번호 변경
  const resetPw = () => {
    if (updatePw !== "" && chkUpdatePw !== "" && updatePw === chkUpdatePw) {
      const m = { memberEmail: findEmail, memberPw: updatePw };

      console.log(m);

      axios
        .patch(backServer + "/member/resetPw", m)
        .then((res) => {
          if (res.data.message === "success") {
            console.log(res.data);
            Swal.fire("비밀번호가 변경되었습니다.");
            closeFindPwModal();
            setChkResetPw(true);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Swal.fire("새 비밀번호를 확인해주세요.");
    }
  };

  /*비밀번호 확인*/
  const rePwChk = () => {
    if (updatePw === chkUpdatePw) {
      setCheckRePw("");
    } else {
      setCheckRePw("비밀번호가 일치하지 않습니다.");
    }
  };

  /*비밀번호 정규식        나중에
  const pwChk = () => {
    const regPw =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/;

    if (regPw.test(memberPw)) {
      setCheckRegPw("");
    } else {
      setCheckRegPw("영문,숫자,특수문자 조합 4~16자");
    }
  };
*/

  /*로그인*/
  const login = () => {
    if (memberId !== "" && memberPw !== "") {
      const obj = { memberId, memberPw };
      axios
        .post(backServer + "/member/login", obj)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "success") {
            loginFunction(res.data.data);
            navigate("/");
          } else if (res.data.message === "black") {
            Swal.fire(
              "You are a black member, but I'm confident that you'll eventually become a good member."
            );
          } else if (res.data.message === "withdrawMember") {
            Swal.fire("탈퇴한 회원입니다.");
          } else {
            Swal.fire("아이디 또는 비밀번호를 확인하세요.");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    }
  };

  return (
    <>
      <div className="login-wrap">
        <div className="logo">
          <LogoForm />
        </div>
        <div className="login-input">
          <LoginInput
            label="아이디"
            content="memberId"
            type="text"
            data={memberId}
            setData={setMemberId}
            placeholder="아이디를 입력하세요."
          />
          <LoginInput
            label="비밀번호"
            content="memberPw"
            type="password"
            data={memberPw}
            setData={setMemberPw}
            placeholder="비밀번호를 입력하세요."
            onKeyUp={enter}
          />
          <div className="login-btn-box">
            <Button1 id="login-btn" text="로그인" clickEvent={login} />
          </div>

          <div className="login-search-box">
            <Link to="/join">회원가입</Link>
            <span className="material-icons findInfo">horizontal_rule</span>
            <span className="findId" onClick={openFindIdModal}>
              아이디찾기
            </span>
            <span className="material-icons findInfo">horizontal_rule</span>
            <span className="findPw" onClick={openFindPwModal}>
              비밀번호찾기
            </span>
          </div>
        </div>
      </div>
      {/* 아이디 찾기 모달 */}
      <Modal
        isOpen={findIdModalIsOpen}
        onRequestClose={closeFindIdModal}
        style={modalStyle}
      >
        <div className="findId-content-wrap">
          <div className="content-title">아이디 찾기</div>
          <div className="findId-info">
            가입 시 등록하신 이메일 주소를 입력하시면 해당 이메일로 아이디를
            전송해 드립니다.
          </div>
          <div className="findId-input-box">
            <div className="findId-email">이메일 주소</div>

            <input
              type="text"
              value={findEmail}
              setData={setFindEmail}
              onChange={changeEmail}
              onBlur={chkRegEmail}
              disabled={emailInputDisabled}
              className="findId-email-input"
              placeholder="예)applefarm@applefarm.co.kr"
            />
            <button
              className="find-email-btn"
              disabled={emailBtnDisabled}
              onClick={findId}
            >
              전송
            </button>
          </div>
          <div className="findId-reg-text">{checkRegEmail}</div>
        </div>

        <div className="modal-close">
          <button className="modal-btn" onClick={closeFindIdModal}>
            닫기
          </button>
        </div>
      </Modal>

      {/* 비밀번호 찾기 모달 */}
      <Modal
        isOpen={findPwModalIsOpen}
        onRequestClose={closeFindPwModal}
        style={modalStyle}
      >
        {chkResetPw ? (
          <>
            <div className="findPw-content-wrap">
              <div className="content-title">비밀번호 찾기</div>
              <div className="findPw-info">
                가입 시 등록하신 이메일 주소로 본인 인증을 완료하시면 비밀번호를
                재설정 하실 수 있습니다.
              </div>
              <div className="findPw-input-box">
                <div className="findPw-email">이메일 주소</div>
                <input
                  type="text"
                  value={findEmail}
                  setData={setFindEmail}
                  onChange={changeEmail}
                  onBlur={chkRegEmail}
                  disabled={emailInputDisabled}
                  placeholder="예)applefarm@applefarm.co.kr"
                  className="findPw-email-input"
                />
                <button
                  disabled={emailBtnDisabled}
                  onClick={sendEmail}
                  className="find-email-btn"
                >
                  전송
                </button>
              </div>
              <div className="findPw-reg-text">{checkRegEmail}</div>
              <div className="findPw-verif-input-box">
                <div className="findPw-verif">인증 코드</div>
                <input
                  type="text"
                  value={verifCode}
                  setData={setVerifCode}
                  onChange={changeVerifCode}
                  disabled={verifCodeInputDisabled}
                  placeholder="인증코드를 입력하세요."
                  className="findPw-verif-input"
                />
                <button
                  onClick={chkVerifCode}
                  disabled={verifCodeBtnDisabled}
                  className="find-email-btn"
                >
                  인증
                </button>
              </div>
            </div>
            <div className="modal-close">
              <button className="modal-btn" onClick={closeFindPwModal}>
                닫기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="resetPw-content-wrap">
              <div className="content-title">비밀번호 재설정</div>
              <div className="resetPw-info">
                새로운 비밀번호를 입력해주세요.
              </div>
              <div className="resetPw-input-box">
                <div className="resetPw-text">새 비밀번호</div>
                <input
                  type="password"
                  value={updatePw}
                  setData={setUpdatePw}
                  onChange={changeUpdatePw}
                  className="resetPw-input"
                />
              </div>
              <div>{checkRegPw}</div>
              <div className="chkResetPw-input-box">
                <div className="chkResetPw-text">새 비밀번호 확인</div>
                <input
                  type="password"
                  value={chkUpdatePw}
                  setData={setChkUpdatePw}
                  onChange={changeChkUpdatePw}
                  onBlur={rePwChk}
                  className="chkResetPw-input"
                />
              </div>
              <div className="resetPw-reg-text">{checkRePw}</div>
            </div>
            <div className="resetPw-btn-wrap">
              <button className="changePw-btn" onClick={resetPw}>
                변경하기
              </button>
              <button className="changePw-close-btn" onClick={closeFindPwModal}>
                닫기
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

const LoginInput = (props) => {
  const label = props.label;
  const content = props.content;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const placeholder = props.placeholder;
  const onKeyUp = props.onKeyUp;

  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}>{label}</label>
        </div>
        <div className="input">
          <Input
            data={data}
            setData={setData}
            type={type}
            content={content}
            placeholder={placeholder}
            onKeyUp={onKeyUp}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
