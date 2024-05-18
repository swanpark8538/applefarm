import { useEffect, useState } from "react";
import SideMenu from "../../component/SideMenu";
import axios from "axios";
import { useAsyncError, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input, nativeSelectClasses } from "@mui/material";
import { Button3 } from "../../component/FormFrm";
import "./member.css";

const MemberInfo = (props) => {
  const [member, setMember] = useState({});
  useEffect(() => {
    axios
      .get(backServer + "/member/info")
      .then((res) => {
        //console.log(res.data);
        setMember(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [member]);

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const checkMsg = props.checkMsg;

  const logout = props.logout;

  const [isAuth, setIsAuth] = useState(false); //현재 비밀번호를 입랙해서 인증 여부

  //새 전화번호
  const [updatePhone, setUpdatePhone] = useState("");

  //새 비밀번호
  const [updatePw, setUpdatePw] = useState("");

  //이전 비밀번호

  const [chkUpdatePw, setChkUpdatePw] = useState("");

  //이메일 수정
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  //인증코드 입력
  const changeVerifCode = (e) => {
    setVerifCode(e.target.value);
  };

  const changePhone = (e) => {
    setUpdatePhone(e.target.value);
  };

  //비밀번호 set
  const changePw = (e) => {
    setUpdatePw(e.target.value);
  };

  //비밀번호 확인 set
  const changeChkPw = (e) => {
    setChkUpdatePw(e.target.value);
  };

  //이메일 수정
  const [email, setEmail] = useState("");

  const [verifCode, setVerifCode] = useState(""); //이메일 인증코도
  const [currentAuthCode, setCurrentAuthCode] = useState(""); //인증코드 저장

  //이메일/수정 인풋(삼항연산자)
  const [changeInputStatus, setChangeInputStatus] = useState(false);
  const [returnInputStatus, setReturnInputStatus] = useState(true);

  //전화번호 삼항연산자
  const [changePhoneInputStatus, setChangePhoneInputStatus] = useState(false);
  const [returnPhoneInputStatus, setReturnPhoneInputStatus] = useState(true);

  //비밀번호 변경 인풋
  const [changePwInputStatus, setChangePwInputStatus] = useState(false);
  const [returnPwInputStatus, setReturnPwInputStatus] = useState(true);

  const [disabledForEmailInput, setDisabledForEmailInput] = useState(false); //인풋 비/활성화
  const [disabledForVerifInput, setDisabledForVerifInput] = useState(false);

  //이메일 수정 시 이메일 중복 체크
  const [dupEmail, setDupEmail] = useState("");

  //이메일 메세지
  const [emailMsg, setEmailMsg] = useState("");

  //이메일 인증 버튼
  const [emailBtn, setEmailBtn] = useState(false);
  //인증 버튼
  const [verifBtn, setVerifBtn] = useState(true);

  //저장 버튼
  const [savePwBtn, setSavePwBtn] = useState(true);

  //전화번호 저장 버튼
  const [savePhoneBtn, setSavePhoneBtn] = useState(true);

  //이전 비밀번호 인풋
  const [rePwInput, setRePwInput] = useState(false);

  //이전 비밀번호 버튼
  const [rePwBtn, setRePwBtn] = useState(false);

  //새 비밀번호 인풋
  const [newPwBtn, setNewPwBtn] = useState(true);

  const [checkRegPhone, setCheckRegPhone] = useState(""); //전화번호 정규식 메세지

  const changeEmailInput = () => {
    setChangeInputStatus(true);
  };
  const returnEmailInput = () => {
    setReturnInputStatus(false);
  };

  const inNewPw = () => {
    if (updatePw !== "") {
      setSavePwBtn(false);
    }
  };

  const cancelChanges = () => {
    // 기존에 연결된 이벤트를 호출하고
    // 예를 들어 모달을 닫는 함수가 있다면 그 함수를 여기서 호출합니다.
    // closeModal(); // 만약 모달이나 팝업을 닫는 함수가 있다면 호출

    // 여기에 상태 초기화 로직을 추가
    // 전화번호 관련 상태 초기화
    setUpdatePhone("");
    setChangePhoneInputStatus(false);
    setCheckRegPhone("");

    // 이메일 관련 상태 초기화
    setEmail(member.memberEmail); // 현재 이메일로 리셋
    setChangeInputStatus(false);
    setEmailMsg("");
    setDisabledForEmailInput(false);
    setEmailBtn(false);

    // 비밀번호 관련 상태 초기화
    setChkUpdatePw("");
    setUpdatePw("");
    setChangePwInputStatus(false);
    setRePwInput(false);
    setRePwBtn(false);
    setNewPwBtn(true);
    setSavePwBtn(true);

    // 인증 코드 관련 상태 초기화
    setVerifCode("");
    setDisabledForVerifInput(false);
    setVerifBtn(true);
  };

  //전화번호 수정
  const changeUpdatePhone = () => {
    const memberNo = member.memberNo;
    const m = { memberNo: memberNo, memberPhone: updatePhone };
    if (updatePhone !== "" && checkRegPhone == "")
      axios
        .patch(backServer + "/member/updatePhone", m)
        .then((res) => {
          if (res.data.message === "success") {
            console.log(res.data);

            Swal.fire("전화번호 수정을 완료했습니다.");
            setChangePhoneInputStatus(false);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
  };

  //이메일 중복/정규식 체크
  const emailChk = () => {
    const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (regEmail.test(email)) {
      axios
        .post(backServer + "/member/emailChk/" + email)
        .then((res) => {
          if (res.data.message === "duplication") {
            setEmailBtn(true);
            setEmailMsg("이미 사용중인 이메일입니다.");
          } else if (res.data.message === "not duplication") {
            setEmailMsg("");
            setEmailBtn(false);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("이메일을 다시 입력해주세요. 예)applefarm@applefarm.co.kr");
    }
  };

  /*전화번호 정규식*/
  const phoneChk = () => {
    const memberPhone = updatePhone;

    const regPhone = /^\d{3}-\d{4}-\d{4}$/;
    if (regPhone.test(memberPhone)) {
      setCheckRegPhone("");
      setSavePhoneBtn(false);
    } else {
      setCheckRegPhone("숫자, 하이픈('-') 포함 13자 입력, 예)010-0000-0000");
    }
  };

  //이메일 인증 코드 전송
  const sendVerifCode = () => {
    if (email !== "") {
      axios
        .post(backServer + "/member/email/" + email)
        .then((res) => {
          if (res.data.message === "success") {
            const authCode = res.data.data;
            console.log(authCode);
            setCurrentAuthCode(authCode);
            //chkVerifCode({ authCode }); 필요없음
            setDisabledForEmailInput(true);
            setVerifBtn(false);
            setEmailBtn(true);
            Swal.fire("해당 이메일로 인증코드가 전송되었습니다.");
          }
        })
        .catch((res) => {});
    } else {
      Swal.fire("이메일을 입력해주세요.");
    }
  };

  /**인증코드 === 입력코드 */
  const chkVerifCode = () => {
    console.log(verifCode);
    console.log(currentAuthCode);
    console.log(email);

    if (verifCode === currentAuthCode) {
      setDisabledForVerifInput(true);
      setVerifBtn(true);
      Swal.fire("인증이 완료되었습니다.");
    } else {
      Swal.fire("인증코드를 다시 확인해주세요.");
    }
  };

  const regTextRemove = () => {
    setUpdatePhone("");
    setCheckRegPhone("");
    setChangePwInputStatus(false);
  };

  //이전 비밀번호 == 로그인 비밀번호 확인
  const chkRePw = () => {
    const memberNo = member.memberNo;
    const m = { memberPw: chkUpdatePw, memberNo: memberNo };
    console.log(m);

    axios
      .post(backServer + "/member/pwCheck", m)
      .then((res) => {
        if (res.data.message === "valid") {
          console.log(res.data);
          setNewPwBtn(false);
          setRePwBtn(true);
          setRePwInput(true);
          Swal.fire("비밀번호 확인이 완료되었습니다.");
        } else {
          Swal.fire("비밀번호를 확인하세요.");
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };

  //비밀번호 변경
  const changeUpdatePw = () => {
    const memberNo = member.memberNo;

    if (updatePw !== "") {
      const m = { memberNo: memberNo, memberPw: updatePw };

      console.log(m);

      axios
        .patch(backServer + "/member/updatePw", m)
        .then((res) => {
          if (res.data.message === "success") {
            console.log(res.data);
            //setChangeInputStatus(false);
            setSavePwBtn(false);

            logout();
            Swal.fire("변경하신 비밀번호로 다시 로그인해주세요.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Swal.fire("새 비밀번호를 입력해주세요.");
    }
  };

  //이메일 변경
  const updateEmail = () => {
    const memberNo = member.memberNo;

    if (verifCode !== "") {
      const m = { memberNo: memberNo, memberEmail: email };
      axios
        .patch(backServer + "/member/updateEmail", m)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire("이메일이 변경되었습니다.");
            setChangeInputStatus(false);
            setReturnInputStatus(true);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("이메일 인증을 완료해주세요.");
    }
  };

  const navigate = useNavigate();

  //회원탈퇴

  const deleteMember = () => {
    navigate("/mypage/deleteMember");
  };

  return (
    <>
      <div className="mypage-content">
        <div className="mypage-current-wrap">
          <h3 className="mypage-current-title">로그인 정보</h3>
          <div className="memberInfo-table">
            <div>
              {changeInputStatus ? (
                <>
                  <div className="info-wrap-content">
                    <div className="change-email-box">
                      <div className="memberInfo-mini-title">
                        이메일 주소 변경
                      </div>
                      <div>
                        <input
                          className="info-input"
                          type="text"
                          setData={setEmail}
                          onChange={changeEmail}
                          onBlur={emailChk}
                          checkMsg={setEmailMsg}
                          disabled={disabledForEmailInput}
                        />
                      </div>
                    </div>
                    <div className="input-change-btn">
                      <button
                        className="change-btn memberInfo-emailBtn"
                        onClick={sendVerifCode}
                        disabled={emailBtn}
                      >
                        메일인증
                      </button>
                    </div>
                  </div>
                  <div className="reg-text1">{emailMsg}</div>

                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">인증 코드</div>
                    <div>
                      <input
                        className="info-input"
                        value={verifCode}
                        setData={setVerifCode}
                        onChange={changeVerifCode}
                        disabled={disabledForVerifInput}
                      />
                    </div>
                    <div className="input-change-btn memberInfo-CodeBtn">
                      <button
                        className="change-btn"
                        onClick={chkVerifCode}
                        disabled={verifBtn}
                      >
                        인증
                      </button>
                    </div>
                  </div>
                  <div className="btn-wrap saveBtn-box">
                    <button
                      className="change-btn memberInfo-saveBtn"
                      onClick={updateEmail}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn memberInfo-cancelBtn"
                      onClick={cancelChanges}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : returnInputStatus ? (
                <>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">이메일</div>
                    <div>
                      <input
                        className="info-input"
                        type="text"
                        value={member.memberEmail}
                      />
                    </div>
                    <div className="input-change-btn memberInfo-change-btn">
                      <button
                        className="change-btn"
                        onClick={() => setChangeInputStatus(true)}
                      >
                        변경
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-wrap-content">
                    <div className="change-email-box">
                      <div className="memberInfo-mini-title">
                        이메일 주소 변경
                      </div>
                      <div>
                        <input
                          className="info-input"
                          type="text"
                          setData={setEmail}
                          onChange={changeEmail}
                          onBlur={emailChk}
                          checkMsg={setEmailMsg}
                          disabled={disabledForEmailInput}
                        />
                      </div>
                    </div>
                    <div className="input-change-btn">
                      <button
                        className="change-btn memberInfo-emailBtn"
                        onClick={sendVerifCode}
                        disabled={emailBtn}
                      >
                        메일인증
                      </button>
                    </div>
                    <div className="reg-text1">{emailMsg}</div>
                  </div>

                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">인증 코드</div>
                    <div>
                      <input
                        className="info-input"
                        value={verifCode}
                        setData={setVerifCode}
                        onChange={changeVerifCode}
                        disabled={disabledForVerifInput}
                      />
                    </div>
                    <div className="input-change-btn memberInfo-CodeBtn">
                      <button
                        className="change-btn"
                        onClick={chkVerifCode}
                        disabled={verifBtn}
                      >
                        인증
                      </button>
                    </div>
                  </div>
                  <div className="btn-wrap saveBtn-box">
                    <button
                      className="change-btn memberInfo-saveBtn"
                      onClick={updateEmail}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn memberInfo-cancelBtn"
                      onClick={cancelChanges}
                    >
                      취소
                    </button>
                  </div>
                </>
              )}

              <div className="info-wrap-content">
                <div className="memberInfo-mini-title">아이디</div>
                <div>
                  <input
                    className="info-input"
                    type="text"
                    value={member.memberId}
                  />
                </div>
              </div>
              {changePwInputStatus ? (
                <>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">이전 비밀번호</div>
                    <div>
                      <input
                        className="info-input"
                        type="password"
                        value={chkUpdatePw}
                        setData={setChkUpdatePw}
                        onChange={changeChkPw}
                        disabled={rePwInput}
                        placeholder="현재 비밀번호를 입력해주세요."
                      />
                    </div>
                    <div className="input-change-btn memberInfo-confirmBtn">
                      <button
                        onClick={chkRePw}
                        className="change-btn"
                        disabled={rePwBtn}
                      >
                        확인
                      </button>
                    </div>
                  </div>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">새 비밀번호</div>
                    <div>
                      <input
                        className="info-input"
                        type="password"
                        value={updatePw}
                        setData={setUpdatePw}
                        onChange={changePw}
                        disabled={newPwBtn}
                        onBlur={inNewPw}
                      />
                    </div>
                  </div>
                  <div className="btn-wrap saveBtn-box2">
                    <button
                      className="change-btn memberInfo-saveBtn"
                      onClick={changeUpdatePw}
                      disabled={savePwBtn}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn memberInfo-cancelBtn"
                      onClick={cancelChanges}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : returnPwInputStatus ? (
                // 비밀번호 복귀 입력 상태
                <div className="info-wrap-content">
                  <div className="memberInfo-mini-title">비밀번호</div>
                  <div>
                    <input
                      className="info-input"
                      type="password"
                      value="123456789"
                    />
                  </div>
                  <div className="input-change-btn memberInfo-change-btn">
                    <button
                      className="change-btn"
                      onClick={() => setChangePwInputStatus(true)}
                    >
                      변경
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">이전 비밀번호</div>
                    <div>
                      <input
                        className="info-input"
                        type="password"
                        value={chkUpdatePw}
                        setData={setChkUpdatePw}
                        onChange={changeChkPw}
                        disabled={rePwInput}
                        placeholder="현재비밀번호를 입력해주세요."
                      />
                    </div>
                    <div className="input-change-btn memberInfo-confirmBtn">
                      <button
                        className="change-btn"
                        onClick={chkRePw}
                        disabled={rePwBtn}
                      >
                        확인
                      </button>
                    </div>
                  </div>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">새 비밀번호</div>
                    <div>
                      <input
                        className="info-input"
                        type="password"
                        value={updatePw}
                        setData={setUpdatePw}
                        onChange={changePw}
                        disabled={newPwBtn}
                        onBlur={inNewPw}
                      />
                    </div>
                  </div>
                  <div className="btn-wrap saveBtn-box2">
                    <button
                      className="change-btn memberInfo-saveBtn"
                      onClick={changeUpdatePw}
                      disabled={savePwBtn}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn memberInfo-cancelBtn"
                      onClick={cancelChanges}
                    >
                      취소
                    </button>
                  </div>
                </>
              )}

              {changePhoneInputStatus ? (
                <>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">전화번호 변경</div>
                    <div>
                      <input
                        className="info-input"
                        type="text"
                        value={updatePhone}
                        onChange={changePhone}
                        onBlur={phoneChk}
                      />
                    </div>
                    <div className="reg-text">{checkRegPhone}</div>
                  </div>

                  <div className="btn-wrap saveBtn-box3">
                    <div>
                      <button
                        className="change-btn memberInfo-saveBtn"
                        disabled={savePhoneBtn}
                        onClick={changeUpdatePhone}
                      >
                        저장
                      </button>
                      <button
                        className="cancel-btn memberInfo-cancelBtn"
                        onClick={cancelChanges}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </>
              ) : returnPhoneInputStatus ? (
                <div className="info-wrap-content">
                  <div className="memberInfo-mini-title">전화번호</div>
                  <div>
                    <input
                      className="info-input"
                      type="text"
                      value={member.memberPhone}
                      readOnly
                    />
                  </div>
                  <div className="input-change-btn memberInfo-change-btn">
                    <button
                      className="change-btn"
                      onClick={() => setChangePhoneInputStatus(true)}
                    >
                      변경
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="info-wrap-content">
                    <div className="memberInfo-mini-title">전화번호 변경</div>
                    <div>
                      <input
                        className="info-input"
                        type="text"
                        value={updatePhone}
                        onChange={changePhone}
                        onBlur={phoneChk}
                      />
                    </div>
                    <div className="reg-text">{checkRegPhone}</div>
                  </div>

                  <div className="btn-wrap saveBtn-box3">
                    <button
                      className="change-btn memberInfo-saveBtn"
                      disabled={savePhoneBtn}
                      onClick={changeUpdatePhone}
                    >
                      저장
                    </button>
                    <button
                      className="cancel-btn memberInfo-cancelBtn"
                      onClick={cancelChanges}
                    >
                      취소
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="delete-btn-box">
            <button className="delete-btn" onClick={deleteMember}>
              회원탈퇴
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoInput = (props) => {
  const label = props.label;
  const content = props.content;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const placeholder = props.placeholder;
  const onKeyDown = props.onKeyDown;

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
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
