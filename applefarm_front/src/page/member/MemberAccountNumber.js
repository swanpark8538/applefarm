import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import Swal from "sweetalert2";

const MemberAccountNumber = (props) => {
  const [member, setMember] = useState({});
  const [accountInfo, setAccountInfo] = useState(null);
  useEffect(() => {
    axios
      .get(backServer + "/member/info")
      .then((res) => {
        //console.log(res.data);
        setMember(res.data.data);

        if (res.data.data.memberAccountnumber) {
          setAccountInfo(res.data.data.memberAccountnumber);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const backServer = process.env.REACT_APP_BACK_SERVER;

  console.log(member);
  const [memberAccountnumber, setMemberAccountnumber] = useState(""); //계좌번호
  const [bankName, setBankName] = useState(""); //은행이름
  const [depositorName, setDepositorName] = useState(""); //예금주명
  const [modalIsOpen, setModalIsOpen] = useState(false); //모달 열기/닫기

  const [checkRegAccountNumber, setCheckRegAccountNumber] = useState(""); //계좌 정규식 메세지
  const [checkRegDepositorName, setCheckDepositorName] = useState(""); //예금주 정규식 메세지

  const [accountRegistered, setAccountRegistered] = useState(false); //계좌 등록 여부
  const [account, setAccount] = useState(""); //등록된 계좌 정보

  // 모달 열기
  const openModal = () => {
    setModalIsOpen(true);
    setMemberAccountnumber(""); // 계좌번호 초기화
    setBankName(""); // 은행이름 초기화
    setDepositorName(""); // 예금주명 초기화
    setCheckRegAccountNumber(""); // 계좌 정규식 메세지 초기화
    setCheckDepositorName(""); // 예금주 정규식 메세지 초기화
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setMemberAccountnumber(""); // 계좌번호 초기화
    setBankName(""); // 은행이름 초기화
    setDepositorName(""); // 예금주명 초기화
    setCheckRegAccountNumber(""); // 계좌 정규식 메세지 초기화
    setCheckDepositorName(""); // 예금주 정규식 메세지 초기화
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

  /*이름정규식*/
  const nameChk = () => {
    const regName = /^[가-힣a-zA-Z]{2,16}$/;

    if (regName.test(depositorName)) {
      setCheckDepositorName("");
    } else {
      setCheckDepositorName("예금주명을 정확히 입력하세요.");
    }
  };

  /*모달 스타일 적용*/
  const modalStyle = {
    content: {
      padding: "39px",
      width: "500px",
      height: "40%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
  // 은행 리스트
  const bankList = [
    { value: "국민은행", label: "국민은행" },
    { value: "신한은행", label: "신한은행" },
    { value: "IBK기업은행", label: "IBK기업은행" },
    { value: "우리은행", label: "우리은행" },
    { value: "카카오뱅크", label: "카카오뱅크" },
    { value: "케이뱅크", label: "케이뱅크" },
    { value: "토스은행", label: "토스뱅크" },
    { value: "부산은행", label: "부산은행" },
    { value: "대구은행", label: "대구은행" },
    { value: "광주은행", label: "광주은행" },
    { value: "제주은행", label: "제주은행" },
    { value: "농협은행", label: "농협은행" },
    { value: "우체국", label: "우체국" },
    { value: "새마을금고", label: "새마을금고" },
    { value: "한국씨티은행", label: "한국씨티은행" },
    { value: "하나은행", label: "하나은행" },
    { value: "신협은행", label: "신협은행" },
    { value: "NH은행", label: "NH은행" },
  ];

  // 계좌번호 추가 함수
  const addAccountNumber = () => {
    const memberNo = member.memberNo;
    const accountNumber =
      (bankName ? bankName.value : "") +
      " " +
      memberAccountnumber +
      " " +
      depositorName;

    const m = { memberNo: memberNo, memberAccountnumber: accountNumber };

    console.log(accountNumber);

    if (checkRegDepositorName === "" && checkRegAccountNumber === "") {
      axios
        .patch(backServer + "/member/addAccountNumber", m)
        .then((res) => {
          if (res.data.message === "success") {
            setModalIsOpen(false);
            setAccountRegistered(true);
            setAccount(accountNumber); // 변경된 계좌 정보 업데이트
            Swal.fire("정산 계좌가 저장되었습니다.");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("입력을 확인해주세요.");
    }
  };

  const deleteAccountNumber = () => {
    const memberNo = member.memberNo;

    const m = { memberNo: memberNo };

    axios
      .patch(backServer + "/member/deleteAccountNumber", m)
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data);
          Swal.fire("계좌가 삭제되었습니다.");

          setAccountRegistered(false);
          setAccount(""); // 계좌 정보 초기화
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    if (member.memberAccountnumber) {
      setAccountRegistered(true);
      setAccount(member.memberAccountnumber); // 초기 계좌 정보 업데이트
    } else {
      setAccountRegistered(false);
      setAccount(""); // 계좌 정보 초기화
    }
  }, [member, backServer]);

  return (
    <>
      <div className="mypage-accountNumber-wrap">
        <div className="account-title">판매자 정산 계좌</div>
        <div className="account-info-wrap">
          <div className="account-info">등록된 계좌 정보</div>
          {accountRegistered ? (
            <>
              <div className="account-text">{account}</div>
              <div className="delete-btn-box">
                <button
                  className="delete-account-btn"
                  onClick={deleteAccountNumber}
                >
                  계좌 삭제
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="account-status-msg">
                등록된 계좌 정보가 없습니다.
              </div>
              <button className="add-btn" onClick={openModal}>
                정산 계좌 추가하기
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyle}
              >
                <div className="add-accountNumber">
                  <div className="bankName-text">은행명</div>
                  <Select
                    options={bankList}
                    value={bankName}
                    onChange={setBankName}
                  />
                  <div>
                    <label>계좌번호</label>
                    <input
                      className="input-form"
                      id="memberAccountNumber"
                      type="text"
                      value={memberAccountnumber}
                      onChange={(e) => setMemberAccountnumber(e.target.value)}
                      placeholder="'-' 포함해서 입력해주세요."
                      onBlur={accountNumberChk}
                    />
                  </div>
                  <div className="reg-msg-account">{checkRegAccountNumber}</div>
                  <div>
                    <label>예금주명</label>
                    <input
                      className="input-form"
                      id="depositorName"
                      type="text"
                      value={depositorName}
                      onChange={(e) => setDepositorName(e.target.value)}
                      placeholder="예금주명을 입력해주세요."
                      onBlur={nameChk}
                    />
                  </div>
                  <div className="reg-msg-account">{checkRegDepositorName}</div>
                  <div className="accountBtn-box">
                    <button
                      className="accountNumber-saveBtn"
                      onClick={addAccountNumber}
                    >
                      저장
                    </button>
                    <button
                      className="accountNumber-closeBtn"
                      onClick={closeModal}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberAccountNumber;
