import "./member.css";
import {
  Button1,
  Button3,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  Select,
} from "../../component/FormFrm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";

const Join = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [memberName, setMemberName] = useState(""); //이름
  const [memberNickName, setMemberNickName] = useState(""); //닉네임
  const [memberId, setMemberId] = useState(""); //아이디
  const [memberPw, setMemberPw] = useState(""); //비밀번호
  const [memberPhone, setMemberPhone] = useState(""); //전화번호
  const [memberAccountnumber, setMemberAccountnumber] = useState(""); //계좌번호
  const [memberEmail, setMemberEmail] = useState(""); //이메일

  //화면구현용
  const [bankName, setBankName] = useState(""); //은행이름
  const [verifCode, setVerifCode] = useState(""); //이메일 인증코도
  const [confirmPw, setConfirmPw] = useState(""); //비밀번호 확인
  const [depositorName, setDepositorName] = useState(""); //예금주명

  const [checkRegId, setCheckRegId] = useState(""); //아이디 정규식 메세지
  const [checkRegPw, setCheckRegPw] = useState(""); //비밀번호 정규식 메세지
  const [checkRegEmail, setCheckRegEmail] = useState(""); //이메일 정규식 메세지
  const [checkRegNickName, setCheckRegNickName] = useState(""); //닉네임 정규식 메세지
  const [checkRegName, setCheckRegName] = useState(""); //이름 정규식 메세지
  const [checkRegAccountNumber, setCheckRegAccountNumber] = useState(""); //계좌 정규식 메세지
  const [checkVerifCode, setCheckVerifCode] = useState(""); //인증코드 정규식 메세지
  const [checkRegPhone, setCheckRegPhone] = useState(""); //전화번호 정규식 메세지
  const [checkRePw, setCheckRePw] = useState(""); //비밀번호 확인 메세지
  const [checkRegDepositorName, setCheckDepositorName] = useState(""); //예금주 정규식 메세지

  const [btnDisabledForEmail, setBtnDisabledForEmail] = useState(false); //버튼 비/활성화
  const [btnDisabledForVerif, setBtnDisabledForVerif] = useState(true);
  const [btnDisabledForJoin, setBtnDisabledJoin] = useState(true);

  const [disabledForEmailInput, setDisabledForEmailInput] = useState(false); //인풋 비/활성화
  const [disabledForVerifInput, setDisabledForVerifInput] = useState(false);

  const [emailButtonColor, setEmailButtonColor] = useState("#0267f3"); //버튼색깔
  const [verifButtonColor, setVerifButtonColor] = useState("#b7b7b7");
  const [joinButtonColor, setJoinButtonColor] = useState("#0267f3");

  const [currentAuthCode, setCurrentAuthCode] = useState(""); //인증코드 저장

  const [modal1IsOpen, setModal1IsOpen] = useState(false); //모달 열기/닫기
  const [modal2IsOpen, setModal2IsOpen] = useState(false); //모달 열기/닫기

  const [chkAgree, setChkAgree] = useState(false); //약관동의 체크박스

  const chkAgreeChange = (e) => {
    setChkAgree(e.target.checked); // 약관 동의 상태를 토글합니다.
  };

  // 모달 열기
  const openModal1 = () => {
    setModal1IsOpen(true);
  };

  //모달 닫기
  const closeModal1 = () => {
    setModal1IsOpen(false);
  };

  // 모달 열기
  const openModal2 = () => {
    setModal2IsOpen(true);
  };

  //모달 닫기
  const closeModal2 = () => {
    setModal2IsOpen(false);
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

  const navigate = useNavigate();

  /*은행 리스트 */
  const bankList = [
    "국민은행",
    "신한은행",
    "IBK기업은행",
    "우리은행",
    "카카오뱅크",
    "케이뱅크",
    "토스뱅크",
    "부산은행",
    "대구은행",
    "광주은행",
    "제주은행",
    "농협은행",
    "우체국",
    "새마을금고",
    "한국씨티은행",
    "하나은행",
    "신협은행",
    "NH은행",
  ];
  /**이메일 중복체크(+정규식) */
  const emailChk = () => {
    const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (regEmail.test(memberEmail)) {
      axios
        .get(backServer + "/member/email/" + memberEmail)
        .then((res) => {
          if (res.data.message === "duplication") {
            setBtnDisabledForEmail(true); //이메일 인증 버튼 비활
            setCheckRegEmail("이미 사용중인 이메일입니다.");

            setVerifButtonColor("#b7b7b7"); // 인증코드 버튼 파란색으로
          } else if (res.data.message === "not duplication") {
            setCheckRegEmail("");
            setBtnDisabledForEmail(false); //이메일 인증 버튼 비활
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      setCheckRegEmail(
        "이메일을 다시 입력해주세요. 예)applefarm@applefarm.co.kr"
      );
    }
  };
  /**인증코드 메일전송 */
  const sendVerifCode = () => {
    if (memberEmail !== "") {
      axios
        .post(backServer + "/member/email/" + memberEmail)
        .then((res) => {
          if (res.data.message === "success") {
            const authCode = res.data.data;
            Swal.fire("해당 이메일로 인증코드를 전송했습니다.");
            console.log(authCode);
            setCurrentAuthCode(authCode);
            //chkVerifCode({ authCode }); 필요없음
            disabledEmailInput(); // 이메일 인풋 비활
            setBtnDisabledForEmail(true); //이메일 인증 버튼 비활
            setVerifButtonColor("#0267f3"); // 인증코드 버튼 파란색으로
            setBtnDisabledForVerif(false); // 인증코드 버튼 활성
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
    if (currentAuthCode === verifCode) {
      setCheckVerifCode("");
    }
  };

  /*인증버튼 클릭 시 인풋 비활성화*/
  const disabledVerifCodeInput = () => {
    if (currentAuthCode === verifCode) {
      Swal.fire("인증이 완료되었습니다.");
      disabledVerifInput(); //인풋 비활성화
      setBtnDisabledForVerif(true); //인증버튼 비활성화
    } else {
      Swal.fire("인증코드가 잘못되었습니다.");
    }
  };

  /*이메일 인풋 비활함수*/
  const disabledEmailInput = () => {
    setDisabledForEmailInput(true);
  };

  /*인증코드 인풋 비활함수*/
  const disabledVerifInput = () => {
    setDisabledForVerifInput(true);
  };

  /*아이디 중복체크*/
  const idChk = () => {
    const regId = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

    if (regId.test(memberId)) {
      axios
        .get(backServer + "/member/id/" + memberId)
        .then((res) => {
          if (res.data.message === "duplication") {
            setCheckRegId("이미 사용중인 아이디입니다.");
          } else {
            setCheckRegId("");
          }
        })
        .catch((res) => {});
    } else {
      setCheckRegId("영문자로 시작하는 영문자 또는 숫자 4~20자");
    }
  };

  /*닉네임 중복체크*/
  const nickNameChk = () => {
    const regNickName = /^[a-zA-Z0-9가-힣]{2,16}$/;

    if (regNickName.test(memberNickName)) {
      axios
        .get(backServer + "/member/nickName/" + memberNickName)
        .then((res) => {
          if (res.data.message === "duplication") {
            setCheckRegNickName("이미 사용중인 닉네임입니다.");
          } else {
            setCheckRegNickName("");
          }
        })
        .catch((res) => {});
    } else {
      setCheckRegNickName("2자 이상 16자 이하, 영문 또는 숫자 또는 한글");
    }
  };

  /*이름정규식*/
  const nameChk = () => {
    const regName = /^[가-힣a-zA-Z]{2,16}$/;

    if (regName.test(memberName)) {
      setCheckRegName("");
    } else {
      setCheckRegName("영문 또는 한글만 입력 가능");
    }

    if (regName.test(depositorName)) {
      setCheckDepositorName("");
    } else {
      setCheckDepositorName("예금주명을 정확히 입력하세요.");
    }
  };

  /*비밀번호 정규식        나중에*/
  const pwChk = () => {
    const regPw =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/;

    if (regPw.test(memberPw)) {
      setCheckRegPw("");
    } else {
      setCheckRegPw("영문,숫자,특수문자 조합 4~16자");
    }
  };

  /*비밀번호 확인*/
  const rePwChk = () => {
    if (memberPw === confirmPw) {
      setCheckRePw("");
    } else {
      setCheckRePw("비밀번호가 일치하지 않습니다.");
    }
  };

  /*계좌번호 정규식*/
  const accountNumberChk = () => {
    const regAccountNumber = /^[0-9-]+$/;

    if (regAccountNumber.test(memberAccountnumber)) {
      setCheckRegAccountNumber("");
    } else {
      setCheckRegAccountNumber("숫자와 하이픈('-')만 입력 가능");
    }
  };

  /*전화번호 정규식*/
  const phoneChk = () => {
    const regPhone = /^\d{3}-\d{4}-\d{4}$/;
    if (regPhone.test(memberPhone)) {
      setCheckRegPhone("");
    } else {
      setCheckRegPhone("숫자, 하이픈('-') 포함 13자 입력, 예)010-0000-0000");
    }
  };

  /*가입하기*/

  const join = () => {
    if (
      memberEmail !== "" &&
      verifCode !== "" &&
      memberName !== "" &&
      memberId !== "" &&
      memberPw !== "" &&
      confirmPw !== "" &&
      memberNickName !== "" &&
      checkRePw === "" &&
      checkRegEmail === "" &&
      checkRegId === "" &&
      checkRegName === "" &&
      checkRegNickName === "" &&
      checkRegPhone === "" &&
      checkRegPw === "" &&
      checkVerifCode === "" &&
      chkAgree
    ) {
      const obj = {
        memberEmail,
        memberId,
        memberPw,
        memberName,
        memberNickName,
        memberPhone,
        bankName,
        memberAccountnumber,
        depositorName,
      };
      setJoinButtonColor("#0267f3");
      axios
        .post(backServer + "/member/join", obj)
        .then((res) => {
          if (res.data.message === "success") {
            console.log(res.data);

            navigate("/login");
          } else {
            Swal.fire(
              "처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요."
            ).then(() => {
              navigate("/");
            });
          }
        })
        .catch((res) => {
          console.log(res.data.data);
        });
    } else {
      Swal.fire("입력값을 확인하세요.");
      return; //데이터 전송 안되게
    }
  };

  return (
    <div className="join-wrap">
      <div className="join-title">회원가입</div>
      <div className="input-with-btn">
        <JoinInputWrap
          label="이메일"
          id="memberEmail"
          type="text"
          value={memberEmail}
          setData={setMemberEmail}
          checkMsg={checkRegEmail}
          blurEvent={emailChk}
          placeholder="예)applefarm@applefarm.co.kr"
          disabled={disabledForEmailInput}
        />
        <Button3
          className="email-btn"
          text="이메일 인증"
          type="button"
          disabled={btnDisabledForEmail}
          clickEvent={sendVerifCode}
          style={{ backgroundColor: emailButtonColor }}
        />
      </div>
      <div className="input-with-btn">
        <JoinInputWrap
          label="인증코드"
          id="verifCode"
          type="text"
          value={verifCode}
          setData={setVerifCode}
          blurEvent={chkVerifCode}
          checkMsg={checkVerifCode}
          disabled={disabledForVerifInput}
          placeholder="인증코드를 입력해주세요."
        />
        <Button3
          className="email-btn"
          text="인증하기"
          type="button"
          style={{ backgroundColor: verifButtonColor }}
          disabled={btnDisabledForVerif}
          clickEvent={disabledVerifCodeInput}
        />
      </div>
      <JoinInputWrap
        label="이름"
        id="memberName"
        type="text"
        value={memberName}
        setData={setMemberName}
        checkMsg={checkRegName}
        placeholder="이름을 입력해주세요."
        blurEvent={nameChk}
      />
      {/** 
      <div className="join-gender">
        <div className="gender-box">
          <div className="gender-title">성별</div>
          <label>
            <input
              type="radio"
              name="memberGender"
              value="1"
              checked={memberGender === "1"}
              onChange={genderChange}
            />
            남자
          </label>
          <label>
            <input
              type="radio"
              name="memberGender"
              value="2"
              checked={memberGender === "2"}
              onChange={genderChange}
            />
            여자
          </label>
        </div>
      </div>
      */}

      <JoinInputWrap
        label="전화번호"
        id="memberPhone"
        type="text"
        value={memberPhone}
        setData={setMemberPhone}
        checkMsg={checkRegPhone}
        placeholder="예)010-1234-5678"
        blurEvent={phoneChk}
      />

      <JoinInputWrap
        label="아이디"
        id="memberId"
        type="text"
        value={memberId}
        setData={setMemberId}
        checkMsg={checkRegId}
        placeholder="영문자로 시작하는 영문자 또는 숫자 4~20자"
        blurEvent={idChk}
      />
      <JoinInputWrap
        label="비밀번호"
        id="memberPw"
        type="password"
        value={memberPw}
        setData={setMemberPw}
        checkMsg={checkRegPw}
        placeholder="영문,숫자,특수문자 조합 4~16자"
        blurEvent={pwChk} //나중에
      />
      <JoinInputWrap
        label="비밀번호확인"
        id="confirmPw"
        type="password"
        value={confirmPw}
        setData={setConfirmPw}
        checkMsg={checkRePw}
        placeholder="비밀번호를 다시 입력해주세요."
        blurEvent={rePwChk}
      />
      <JoinInputWrap
        label="닉네임"
        id="memberNickName"
        type="text"
        value={memberNickName}
        setData={setMemberNickName}
        checkMsg={checkRegNickName}
        placeholder="2자 이상 16자 이하, 영문 또는 숫자 또는 한글"
        blurEvent={nickNameChk}
      />
      {/*
      <div className="join-input-wrap">
        <div className="bank-input-wrap">
          <div className="label">
            <label htmlFor="bankName" className="bank-title">
              정산계좌추가<span className="little-text"> (선택항목)</span>
            </label>
          </div>
          <div className="bank-input-box">
            <select
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            >
              {bankList.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <JoinInputWrap
            label="계좌번호"
            id="memberAccountnumber"
            type="text"
            value={memberAccountnumber}
            setData={setMemberAccountnumber}
            checkMsg={checkRegAccountNumber}
            placeholder="'-'포함해서 입력해주세요."
            blurEvent={accountNumberChk}
          />
          <JoinInputWrap
            label="예금주명"
            id="depositorName"
            type="text"
            value={depositorName}
            setData={setDepositorName}
            checkMsg={checkRegDepositorName}
            placeholder="예금주명을 정확히 입력하세요."
            blurEvent={nameChk}
          />
        </div>
      </div>
      */}

      <div className="agree-modal">
        <label>
          <input type="checkbox" onChange={chkAgreeChange} />
          [필수] 만 14세 이상이며 모두 동의합니다.
        </label>
        <span className="material-icons agree-icon" onClick={openModal1}>
          arrow_right
        </span>
        <label>
          <input type="checkbox" />
          [선택] 광고성 정보 수신에 모두 동의합니다.
        </label>
        <span className="material-icons agree-icon" onClick={openModal2}>
          arrow_right
        </span>
      </div>

      <div className="join-btn">
        <Button3
          text="가입하기"
          clickEvent={join}
          style={{ backgroundColor: joinButtonColor }}
        />
      </div>

      <Modal
        isOpen={modal1IsOpen}
        onRequestClose={closeModal1}
        style={modalStyle}
      >
        <p>
          AppleFarm 서비스 이용 약관 제 1 조 (목적) 이 약관은 "회원" 개인 상호
          간 또는 “제휴 사업자”, "입점 사업자"와 “회원” 개인 간에 상품 등을
          매매하는 것을 중개하고, "상품" 등에 관한 정보를 상호 교환할 수 있도록
          크림 주식회사(이하 "회사"라 합니다)가 운영, 제공하는 AppleFarm
          서비스(이하 "서비스")에 대한 것으로 본 약관에서는 "서비스"의 이용과
          관련하여 "회사"와 "회원"과의 권리, 의무 및 책임사항, 기타 필요한
          사항을 규정합니다. 제 2 조 (용어의 정의) 이 약관에서 사용하는 용어의
          정의는 다음 각 호와 같으며, 정의되지 않은 용어에 대한 해석은 관계 법령
          및 지침, 본 이용약관, 개인정보취급방침, 상관례 등에 의합니다.
          "서비스"라 함은 회사가 PC 및/또는 모바일 환경에서 제공하는 AppleFarm
          서비스 및 관련 제반 서비스를 말합니다. "회원"이라 함은 "회사"의
          "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고
          "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다. "구매자" 또는
          "구매회원"이라 함은 "상품"을 구매하거나 또는 구매할 의사로 서비스를
          이용하는 회원을 말합니다. "판매자" 또는 "판매회원"이라 함은 "서비스"에
          "상품"을 등록하여 판매하거나 또는 제공할 의사로 서비스를 이용하는
          회원을 말합니다. "입찰"이라 함은 "상품"을 구매하기 위하여 원하는
          "상품"의 구매 가격을 제출하는 행위 또는 "상품"을 판매하기 위하여
          원하는 "상품"의 판매 가격을 제출하는 행위를 말합니다. "거래 체결"이라
          함은 "입찰"에 의하여 상품의 거래가 성립되는 것을 말합니다.
          "게시물"이라 함은 "회원"이 "서비스"를 이용함에 있어 "서비스"상에
          게시한 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글(댓글 포함),
          사진(이미지), 동영상 및 각종 파일과 링크 등 일체를 의미합니다.
          "회원정보"라 함은 "서비스"를 이용하는 고객이 등록한 정보를 말합니다.
          "서비스수수료"라 함은 "회원"이 "서비스"를 이용하면서 발생할 수 있는
          수수료입니다. "상품"의 판매/구매 및 제반 서비스를 이용함에 따라
          부과되는 시스템이용료로서 거래 수수료 또는 판매완료 수수료,
          유료부가서비스수수료 등이 있으며, 관련내용은 제24조(서비스수수료)에
          명시된 바에 따릅니다. "포인트"라 함은 "서비스"의 효율적 이용을 위해
          "회사"가 임의로 책정 또는 지급, 조정할 수 있는 "서비스" 상의 가상
          데이터를 의미합니다. "포인트"의 적립, 지급, 사용 등과 관련한 구체적인
          정책에 대해서는 이용약관 및 공지사항 등으로 별도 고지하는 바에
          따릅니다. "할인쿠폰"이라 함은 상품 등을 구매할 때나 "서비스"를 이용할
          때 표시된 금액 또는 비율만큼 할인 받을 수 있는 쿠폰을 말합니다.
          "할인쿠폰"의 지급, 사용, 소멸 등과 관련한 구체적인 정책에 대해서는
          이용약관 및 공지사항 등으로 별도 고지하는 바에 따릅니다. “상품”이라
          함은 본 약관에 따라 “회원” 간 거래 대상으로서 “서비스”에 등록된 재화
          또는 용역을 말합니다. “제휴 사업자”라 함은 “AppleFarm EXCLUSIVE DROPS”
          및 “B2C 상품 페이지”에서 제공하는 통신판매중개를 이용하여 “회원”과
          “제휴 사업자 판매 상품”을 거래하고자 “회사”와 별도의 계약을 체결한
          사업자를 말합니다. “입점 사업자”라 함은 “서비스”에서 제공하는
          통신판매중개를 이용하여
        </p>
        <div className="modal-close">
          <button className="modal-btn" onClick={closeModal1}>
            닫기
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modal2IsOpen}
        onRequestClose={closeModal2}
        style={modalStyle}
      >
        <p>
          AppleFarm 서비스 이용 약관 제 1 조 (목적) 이 약관은 "회원" 개인 상호
          간 또는 “제휴 사업자”, "입점 사업자"와 “회원” 개인 간에 상품 등을
          매매하는 것을 중개하고, "상품" 등에 관한 정보를 상호 교환할 수 있도록
          크림 주식회사(이하 "회사"라 합니다)가 운영, 제공하는 AppleFarm
          서비스(이하 "서비스")에 대한 것으로 본 약관에서는 "서비스"의 이용과
          관련하여 "회사"와 "회원"과의 권리, 의무 및 책임사항, 기타 필요한
          사항을 규정합니다. 제 2 조 (용어의 정의) 이 약관에서 사용하는 용어의
          정의는 다음 각 호와 같으며, 정의되지 않은 용어에 대한 해석은 관계 법령
          및 지침, 본 이용약관, 개인정보취급방침, 상관례 등에 의합니다.
          "서비스"라 함은 회사가 PC 및/또는 모바일 환경에서 제공하는 AppleFarm
          서비스 및 관련 제반 서비스를 말합니다. "회원"이라 함은 "회사"의
          "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고
          "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다. "구매자" 또는
          "구매회원"이라 함은 "상품"을 구매하거나 또는 구매할 의사로 서비스를
          이용하는 회원을 말합니다. "판매자" 또는 "판매회원"이라 함은 "서비스"에
          "상품"을 등록하여 판매하거나 또는 제공할 의사로 서비스를 이용하는
          회원을 말합니다. "입찰"이라 함은 "상품"을 구매하기 위하여 원하는
          "상품"의 구매 가격을 제출하는 행위 또는 "상품"을 판매하기 위하여
          원하는 "상품"의 판매 가격을 제출하는 행위를 말합니다. "거래 체결"이라
          함은 "입찰"에 의하여 상품의 거래가 성립되는 것을 말합니다.
          "게시물"이라 함은 "회원"이 "서비스"를 이용함에 있어 "서비스"상에
          게시한 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글(댓글 포함),
          사진(이미지), 동영상 및 각종 파일과 링크 등 일체를 의미합니다.
          "회원정보"라 함은 "서비스"를 이용하는 고객이 등록한 정보를 말합니다.
          "서비스수수료"라 함은 "회원"이 "서비스"를 이용하면서 발생할 수 있는
          수수료입니다. "상품"의 판매/구매 및 제반 서비스를 이용함에 따라
          부과되는 시스템이용료로서 거래 수수료 또는 판매완료 수수료,
          유료부가서비스수수료 등이 있으며, 관련내용은 제24조(서비스수수료)에
          명시된 바에 따릅니다. "포인트"라 함은 "서비스"의 효율적 이용을 위해
          "회사"가 임의로 책정 또는 지급, 조정할 수 있는 "서비스" 상의 가상
          데이터를 의미합니다. "포인트"의 적립, 지급, 사용 등과 관련한 구체적인
          정책에 대해서는 이용약관 및 공지사항 등으로 별도 고지하는 바에
          따릅니다.
        </p>
        <div className="modal-close">
          <button className="modal-btn" onClick={closeModal2}>
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
};

const JoinInputWrap = (props) => {
  const label = props.label;
  const id = props.id;
  const type = props.type;
  const data = props.value;
  const setData = props.setData;
  const blurEvent = props.blurEvent;
  const placeholder = props.placeholder;
  const checkMsg = props.checkMsg;
  const disabled = props.disabled;

  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className="input-wrap">
          <Input
            id={id}
            type={type}
            value={data}
            setData={setData}
            blurEvent={blurEvent}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      </div>
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};
export default Join;
