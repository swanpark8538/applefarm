import React, { useEffect, useRef, useState } from "react";
import "./modal.css";
import { Input, Input2, InputReadOnly } from "../../component/FormFrm";
import DaumPostcode, { useDaumPostcodePopup } from "react-daum-postcode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//삭제
const DelModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const clickEvent = props.clickEvent;
  const text = props.text;
  const icon = props.icon;
  const modalBackground = useRef();
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };

  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap">
        <div className="close-icon-wrap">
          <span className="material-icons close-icon" onClick={closeModal}>
            highlight_off
          </span>
        </div>
        <div className="modal-content">
          <span className="material-icons modal-main-icon">{icon}</span>
          <p className="modal-text">{text}</p>
          <button
            className="like-delete-btn like-modal-btn"
            onClick={clickEvent}
          >
            Yes
          </button>
          <button className="like-modal-btn" onClick={closeModal}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};
//주소록
const AddressModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const {
    addressNo,
    addressName,
    setAddressName,
    addressPhone,
    setAddressPhone,
    zipcode,
    setZipcode,
    address,
    setAddress,
    addressDetail,
    setAddressDetail,
    addressDefault,
    setAddressDefault,
    whatModal,
    setDeliveryAddress,
    setDeliveryAddressDetail,
    setDeliveryAddressName,
    setDeliveryAddressPhone,
    setDeliveryZipcode,
    setDeliveryAddressNo,
    delivery,
  } = props;
  const status = props.status;
  const setStatus = props.setStatus;
  const input = useRef();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //입력용
  const [newAddressName, setNewAddressName] = useState(addressName);
  const [newAddressPhone, setNewAddressPhone] = useState(addressPhone);
  const [newZipcode, setNewZipcode] = useState(zipcode);
  const [newAddress, setNewAddress] = useState(address);
  const [newAddressDetail, setNewAddressDetail] = useState(addressDetail);
  const [newAddressDefault, setNewAddressDefault] = useState(addressDefault);

  //주소 api이용
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    const zonecode = data.zonecode;
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setNewAddress(fullAddress);
    setNewZipcode(zonecode);
    setNewAddressDetail("");
    input.current.focus();
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const changeDefault = (e) => {
    setNewAddressDefault(e.target.checked ? e.target.value : 0);
    // 체크 여부에 따라 addressDefault 값을 설정
  };
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };

  //체크 메세지
  const [nameCheck, setNameCheck] = useState("");
  const [phoneCheck, setPhoneCheck] = useState("");
  const [addressCheck, setAddressCheck] = useState("");
  const [addressDetailCheck, setAddressDetailCheck] = useState("");
  const nameReq = /^.{2,50}$/;
  const phoneReq = /^\d{2,3}-\d{3,4}-\d{4}$/;
  const addressReq = /^\s*$/;
  const addressDetailReq = /^s*$/;

  const nameChk = () => {
    if (!nameReq.test(newAddressName)) {
      setNameCheck("올바른 이름을 입력해주세요(2-50자).");
    } else {
      setNameCheck("");
    }
  };

  const phoneChk = () => {
    if (!phoneReq.test(newAddressPhone)) {
      setPhoneCheck("올바른 전화번호를 입력해주세요");
    } else {
      setPhoneCheck("");
    }
  };

  const phoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
    let formattedInput;
    if (input.length === 11) {
      formattedInput = input.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"); // 010-xxxx-xxxx 형식
    } else {
      formattedInput = input.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }
    setNewAddressPhone(formattedInput);
  };

  const addressChk = () => {
    if (addressReq.test(newZipcode)) {
      setAddressCheck("주소를 입력해주세요");
    } else {
      setAddressCheck("");
    }
  };

  const detailFunc = (e) => {
    setNewAddressDetail(e.target.value);
  };

  const addressDetailChk = () => {
    if (newAddressDetail == "") {
      setAddressDetailCheck("상세주소를 입력해주세요");
    } else {
      setAddressDetailCheck("");
    }
  };

  ////////////////////////////////////////////////////////////////////
  //새 주소 등록
  const addressEnroll = () => {
    if (
      nameReq.test(newAddressName) &&
      phoneReq.test(newAddressPhone) &&
      newZipcode !== "" &&
      newAddress !== "" &&
      newAddressDetail !== "" //필요여부 수정 예정
    ) {
      const obj = {
        addressName: newAddressName,
        addressPhone: newAddressPhone,
        zipcode: newZipcode,
        address: newAddress,
        addressDetail: newAddressDetail,
        addressDefault: newAddressDefault,
      };
      //console.log(obj);

      axios
        .post(backServer + "/member/address", obj)
        .then((res) => {
          //console.log(res.data);
          if (res.data.message === "success") {
            if (delivery === "deliveryPlus") {
              setDeliveryAddress(newAddress);
              setDeliveryAddressDetail(newAddressDetail);
              setDeliveryAddressName(newAddressName);
              setDeliveryZipcode(newZipcode);
              setDeliveryAddressPhone(newAddressPhone);
            }
            setModalOpen(false);
            setStatus(!status);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      alert("정확히 다 입력하세요");
    }
  };
  const addressUpdate = () => {
    if (
      nameReq.test(newAddressName) &&
      phoneReq.test(newAddressPhone) &&
      newZipcode !== "" &&
      newAddress !== "" &&
      newAddressDetail !== "" //필요여부 수정 예정
    ) {
      const obj = {
        addressNo,
        addressName: newAddressName,
        addressPhone: newAddressPhone,
        zipcode: newZipcode,
        address: newAddress,
        addressDetail: newAddressDetail,
        addressDefault: newAddressDefault,
      };
      console.log(obj);
      axios
        .patch(backServer + "/member/address", obj)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "success") {
            setStatus(!status);
            setModalOpen(false);
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      alert("정확히 모두 입력해주세요.");
    }
  };
  return (
    <div>
      <div className="modal">
        <div className="modal-content-wrap address-modal-content-wrap">
          <div className="close-icon-wrap">
            <span className="material-icons close-icon" onClick={closeModal}>
              highlight_off
            </span>
          </div>
          <div className="modal-content">
            <div className="modal-title">
              {whatModal === "update" ? "주소 변경" : "주소 추가"}
            </div>
            <div className="address-input-wrap">
              <div>
                <label htmlFor="addressName">이름</label>
              </div>
              <Input2
                id="addressName"
                type="text"
                data={newAddressName}
                setData={setNewAddressName}
                blurEvent={nameChk}
                placeholder="수령인의 이름"
              />
              <div className="address-checkmsg">{nameCheck}</div>
            </div>
            <div className="address-input-wrap">
              <div>
                <label htmlFor="addressPhone">전화번호</label>
              </div>
              <input
                className="input_form2"
                type="text"
                value={newAddressPhone}
                placeholder="수령할 분의 전화번호를 입력하세요(- 는 자동입력됩니다)"
                onBlur={phoneChk}
                onChange={phoneChange}
                maxLength={13}
              ></input>
              <div className="address-checkmsg">{phoneCheck}</div>
            </div>
            <div className="address-input-wrap">
              <div>
                <label htmlFor="zipcode">우편번호</label>
              </div>
              <div className="zipcode-wrap">
                <input
                  className="input_form2 address-disable-input"
                  type="text"
                  value={newZipcode}
                  readOnly
                  placeholder="우편번호를 검색하세요"
                ></input>
                <button className="zipcode-btn" onClick={handleClick}>
                  우편번호
                </button>
                <div className="address-checkmsg address-check-zip">
                  {addressCheck}
                </div>
              </div>
            </div>
            <div className="address-input-wrap">
              <div>
                <label htmlFor="address">주소</label>
              </div>
              <input
                className="input_form2 address-disable-input"
                type="text"
                value={newAddress}
                readOnly
                placeholder="우편번호 입력 후, 자동 입력됩니다"
              ></input>
            </div>
            <div className="address-input-wrap">
              <div>
                <label htmlFor="addressDetail">상세 주소</label>
              </div>
              <input
                type="text"
                value={newAddressDetail}
                placeholder="건물, 아파트, 동/호수 입력"
                onChange={detailFunc}
                className="input_form2 input_focus"
                ref={input}
                onBlur={addressDetailChk}
              ></input>
              <div className="address-checkmsg">{addressDetailCheck}</div>
            </div>
            <div className="address-default-check-box-wrap">
              {addressDefault == 1 ? (
                ""
              ) : (
                <>
                  <input
                    type="checkbox"
                    id="addressDefault"
                    defaultValue="1"
                    onChange={changeDefault}
                    checked={newAddressDefault == 1}
                  ></input>
                  <label htmlFor="addressDefault">기본 배송지로 설정</label>
                </>
              )}
            </div>
            <div className="address-input-wrap">
              <button
                className="address-modal-btn address-ok-btn"
                onClick={whatModal === "update" ? addressUpdate : addressEnroll}
                disabled={
                  !nameReq.test(newAddressName) ||
                  !phoneReq.test(newAddressPhone) ||
                  newZipcode === "" ||
                  newZipcode === undefined ||
                  newAddress === "" ||
                  newAddress === undefined ||
                  newAddressDetail === undefined ||
                  newAddressDetail === ""
                }
              >
                {whatModal === "update" ? "수정" : "등록"}
              </button>
              <button className="address-modal-btn" onClick={closeModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const RequestModal = (props) => {
  const {
    setOpenRequest,
    openRequest,
    options,
    setOptions,
    setDeliveryAddressRequest,
    deliveryAddressRequest,
    freeMessage,
    setFreeMessage,
    selectOption,
    setSelectOption,
  } = props;
  const modalBackground = useRef();
  const [isFree, setIsFree] = useState(false);
  //모달 닫기
  const closeModal = () => {
    setOpenRequest(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setOpenRequest(false);
    }
  };
  //초기 모달 상태(해당 옵션 체크되도록)
  useEffect(() => {
    const copyOptions = [...options];
    copyOptions.forEach((item) => {
      if (item.text === selectOption) {
        item.active = true;
        if (selectOption === "직접 입력") {
          setIsFree(true);
        }
      } else {
        item.active = false;
      }
    });
    setOptions(copyOptions);
  }, [setOpenRequest]);
  const changeOption = (index) => {
    const copyOptions = [...options];
    copyOptions.forEach((item) => {
      item.active = false;
    });
    copyOptions[index].active = true;
    if (copyOptions[index].text !== "직접 입력") {
      setIsFree(false);
    } else {
      setIsFree(true);
    }
    setSelectOption(copyOptions[index].text);
    setOptions(copyOptions);
  };
  //const [selectOption, setSelectOption] = useState("");
  //const [freeMessage, setFreeMessage] = useState("");
  const changeData = (e) => {
    setFreeMessage(e.target.value);
  };
  //적용하기
  const requestGo = () => {
    //console.log(freeMessage);
    //console.log(selectOption);
    if (selectOption === "직접 입력") {
      setDeliveryAddressRequest(freeMessage);
    } else {
      setDeliveryAddressRequest(selectOption);
      setFreeMessage("");
    }
    setOpenRequest(false);
  };
  return (
    <div>
      <div className="modal" ref={modalBackground} onClick={modalBack}>
        <div className="modal-content-wrap  modal-round">
          <div className="close-icon-wrap">
            <span className="material-icons close-icon" onClick={closeModal}>
              highlight_off
            </span>
          </div>
          <div className="modal-content">
            <div className="modal-title">배송 요청사항</div>
            <div className="request-message">
              {options.map((item, index) => {
                return (
                  <div key={"option" + index}>
                    <div
                      className={item.active ? "request-option" : ""}
                      onClick={() => {
                        changeOption(index);
                      }}
                    >
                      {item.text}
                      {item.active ? (
                        <span className="material-icons request-chk">
                          check
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="free-box">
                {isFree && (
                  <textarea
                    value={freeMessage}
                    placeholder="내용을 입력해주세요"
                    onChange={changeData}
                  ></textarea>
                )}
              </div>
            </div>
            <button className="request-btn" onClick={closeModal}>
              취소
            </button>
            <button className="request-btn" onClick={requestGo}>
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
//구매내역 상태선택 모달
const ProductStatus = (props) => {
  const modalBackground = useRef();
  const { setModalOpen, statusList, currentStatus, setCurrentStatus } = props;
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };
  return (
    <div>
      <div className="modal" ref={modalBackground} onClick={modalBack}>
        <div className="modal-content-wrap">
          <span
            className="material-icons close-icon status-close"
            onClick={closeModal}
          >
            highlight_off
          </span>
          <div className="modal-product-status-title">선택한 상태 보기</div>
          <div className="modal-content status-modal">
            {statusList.map((item, index) => {
              return (
                <button
                  key={"status" + index}
                  onClick={() => {
                    setCurrentStatus(index);
                    setModalOpen(false);
                  }}
                  className={
                    index == currentStatus
                      ? "status-btns current-status"
                      : "status-btns"
                  }
                  style={{ color: item.color }}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
//입찰가격수정
const BidModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const clickEvent = props.clickEvent;
  const oleBidPrice = props.bidPrice;
  const productPrice = props.productPrice;
  const { setNewBidPrice, newBidprice, productNo } = props;
  const [buyChk, setBuyChk] = useState("");
  //const [newBidprice, setNewBidPrice] = useState();
  const bidPriceRef = useRef(null);
  const modalBackground = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    bidPriceRef.current.focus();
  }, []);
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setNewBidPrice("");
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
      setNewBidPrice("");
    }
  };
  const changeData = (e) => {
    //let price = e.target.value.toLocaleString();
    let price = e.target.value.replace(/\D/g, "");
    price = price.replace(/^0+(?=\d)/, "");
    if (!isNaN(price)) {
      setNewBidPrice(price);
    }
    if (price >= productPrice) {
      setNewBidPrice(productPrice);
      setBuyChk("판매가보다 높아 판매가로 바로 구매할수 있습니다.");
    } else {
      setBuyChk("");
    }
  };
  //구매페이지 동
  const purchase = () => {
    navigate("/purchase/" + productNo + "/" + "n");
  };
  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap">
        <div className="close-icon-wrap">
          <span
            className="material-icons close-icon  status-close"
            onClick={closeModal}
          >
            highlight_off
          </span>
        </div>
        <div className="modal-content">
          <div className="modal-title modal-title2">
            원하시는 입찰가를 입력해주세요.
          </div>
          <div className="modal-title-sub-message">
            - 올바른 입력방법 : 1,000원(X) / 1000원(O) -
          </div>
          <div className="modal-title-sub-message sub-sub-s">
            0원 이상 입력가능
          </div>
          <div className="bid-change-input-box">
            <input
              id="bidPrice"
              type="text"
              value={newBidprice}
              onChange={changeData}
              placeholder={
                "판매 희망가는 " + productPrice.toLocaleString() + "원입니다."
              }
              ref={bidPriceRef}
            />
            원<div className="bid-buy-msg">{buyChk}</div>
          </div>
          {newBidprice >= productPrice ? (
            <button
              className="like-modal-btn active-bid-purchase"
              onClick={purchase}
            >
              구매
            </button>
          ) : (
            <button
              className="like-modal-btn change-status-sbtn"
              disabled={newBidprice <= 0 || newBidprice === ""}
              onClick={clickEvent}
            >
              변경
            </button>
          )}
          <button className="like-modal-btn" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
//후기작성모달
const ReviewModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  //const clickEvent = props.clickEvent;
  const trade = props.trade;
  const { status, setStatus, setSuccessModal, setSuccessText } = props;
  const modalBackground = useRef();
  const [selectLevel, setSelectLevel] = useState(null);
  const [reviewDetail, setReviewDetail] = useState("");
  const [noSelect, setNoSelect] = useState(true);

  const level = [
    { text: "별로예요", img: "/image/scoreImage/-1.svg" },
    { text: "좋아요!", img: "/image/scoreImage/0.svg" },
    { text: "최고예요!", img: "/image/scoreImage/1.svg" },
  ];
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };
  const reviewWrite = () => {
    let reviewSatisfaction;
    if (selectLevel === 0) {
      reviewSatisfaction = -1;
    } else if (selectLevel === 1) {
      reviewSatisfaction = 0;
    } else if (selectLevel === 2) {
      reviewSatisfaction = 1;
    }

    const obj = {
      tradeNo: trade.tradeNo,
      reviewSeller: trade.tradeSeller,
      productNo: trade.productNo,
      reviewSatisfaction,
      reviewDetail,
    };
    console.log(obj);
    axios
      .post(backServer + "/trade/review", obj)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setSuccessText("후기 작성이 완료되었습니다.");
          setSuccessModal(true);
          setModalOpen(false);
          setStatus(!status);
        } else {
          alert("서버 에러 발생! 관리자에게 문의하세요.");
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  const changeData = (e) => {
    setReviewDetail(e.target.value);
  };
  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap modal-size-more">
        <div className="close-icon-wrap">
          <span
            className="material-icons close-icon  status-close"
            onClick={closeModal}
          >
            highlight_off
          </span>
        </div>
        <div className="modal-content">
          <div className="modal-title modal-title2">
            판매자에 대한 후기를 남겨주세요.
          </div>
          <div className="product-info-wrap">
            <div>
              <Link to={"/product/" + trade.productNo}>
                <img src="../image/iphone.jpg"></img>
              </Link>
            </div>
            <div className="product-info-text">
              <div className="product-seller-nick">
                {trade.tradeSellerNickname}님의
              </div>
              <div>
                <Link to={"/product/" + trade.productNo}>
                  {trade.productSummary}
                </Link>
              </div>
            </div>
          </div>
          <div className="level-select">
            {level.map((item, index) => {
              return (
                <div key={"level" + index}>
                  <img
                    className={
                      index === selectLevel
                        ? "select-img current-img"
                        : "select-img"
                    }
                    src={item.img}
                    onClick={() => {
                      setSelectLevel(index);
                      setNoSelect(false);
                    }}
                  ></img>
                  <div
                    className={index === selectLevel ? "current-level" : ""}
                    onClick={() => {
                      setSelectLevel(index);
                      setNoSelect(false);
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="textarea-box-wrap">
            <textarea
              className="textarea-box"
              value={reviewDetail}
              onChange={changeData}
              placeholder="만족도를 필수로 선택 후 후기내용은 자유롭게 작성해주세요."
            ></textarea>
          </div>
          <button
            className="like-modal-btn change-status-sbtn"
            onClick={reviewWrite}
            disabled={noSelect}
          >
            작성
          </button>
          <button className="like-modal-btn" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
//완료모달
const SuccessModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const text = props.text;
  const modalBackground = useRef();
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };
  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap">
        <div className="close-icon-wrap">
          <span className="material-icons close-icon" onClick={closeModal}>
            highlight_off
          </span>
        </div>
        <div className="modal-content">
          <span className="material-icons modal-main-icon">verified</span>
          <p className="modal-text">{text}</p>
          <button
            className="like-delete-btn like-modal-btn"
            onClick={closeModal}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
//환불모달
const RefundModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const trade = props.trade;
  const { status, setStatus, setSuccessModal, setSuccessText } = props;
  const modalBackground = useRef();
  const [refundReason, setRefundReason] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };
  //환불하기
  const refundGo = () => {
    console.log("환불하기");
    const obj = {
      tradeNo: trade.tradeNo,
      productNo: trade.productNo,
      refundReason,
    };
    console.log(obj);
    axios
      .post(backServer + "/trade/refund", obj)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setSuccessText("환불신청이 완료되었습니다.");
          setSuccessModal(true);
          setModalOpen(false);
          setStatus(!status);
        } else {
          alert("서버 에러 발생! 관리자에게 문의하세요.");
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  const changeData = (e) => {
    setRefundReason(e.target.value);
  };
  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap modal-size-more">
        <div className="close-icon-wrap">
          <span
            className="material-icons close-icon  status-close"
            onClick={closeModal}
          >
            highlight_off
          </span>
        </div>
        <div className="modal-content">
          <div className="modal-title modal-title2">환불 신청</div>
          <div className="modal-sub-message">
            * 환불 신청 후 해당 상품을{" "}
            <span>서울특별시 영등포구 선유동2로 가나빌딩</span> 으로 보내주세요.
          </div>
          <div className="product-info-wrap">
            <div>
              <Link to={"/product/" + trade.productNo}>
                <img src="../image/iphone.jpg"></img>
              </Link>
            </div>
            <div className="product-info-text">
              <div className="product-seller-nick">
                {trade.tradeSellerNickname}님의
              </div>
              <div>
                <Link to={"/product/" + trade.productNo}>
                  {trade.productSummary}
                </Link>
              </div>
            </div>
          </div>

          <div className="textarea-box-wrap">
            <textarea
              className="textarea-box"
              value={refundReason}
              onChange={changeData}
              placeholder="환불사유를 작성해주세요."
              ref={inputRef}
            ></textarea>
          </div>

          <button
            className="like-modal-btn change-status-sbtn"
            onClick={refundGo}
            disabled={refundReason === ""}
          >
            신청
          </button>
          <button className="like-modal-btn" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
const TrackingModal = (props) => {
  const setModalOpen = props.setModalOpen;
  const trackingList = props.trackingList;
  const invoiceNumber = props.invoiceNumber;
  const completeYN = props.completeYN; //스케줄 1분마다 안할거면 이걸로
  const modalBackground = useRef();
  const viewer = props.viewer;
  const refModalFunc = props.refModalFunc;
  const okModalFunc = props.okModalFunc;
  const trade = props.trade;
  //모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  };
  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === modalBackground.current) {
      setModalOpen(false);
    }
  };
  const okFunc = () => {
    setModalOpen(false);
    okModalFunc();
  };
  const reFunc = () => {
    setModalOpen(false);
    refModalFunc();
  };
  return (
    <div className="modal" ref={modalBackground} onClick={modalBack}>
      <div className="modal-content-wrap big-modal">
        <span
          className="material-icons close-icon status-close"
          onClick={closeModal}
        >
          highlight_off
        </span>
        <div className="modal-tracking-title">배송조회</div>
        <div className="tracking-wrap">
          <div className="tracking-number">
            <div>송장번호</div>
            <div>{invoiceNumber}</div>
          </div>
          <div className="tracking-content">
            <table>
              <thead>
                <tr>
                  <td>배송시간</td>
                  <td>현재위치</td>
                  <td>배송내용</td>
                  <td>기사 연락처</td>
                </tr>
              </thead>
              <tbody>
                {trackingList === null ? (
                  <tr>
                    <td colSpan={4}>
                      <div>집하처리 전입니다. </div>
                    </td>
                  </tr>
                ) : (
                  trackingList.map((item, index) => {
                    return (
                      <tr key={"tracking" + index}>
                        <td>{item.timeString}</td>
                        <td>{item.where}</td>
                        <td>{item.kind}</td>
                        <td>{item.telno2}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {viewer === "c" &&
            completeYN === "Y" &&
            trade.tradeState !== "환불" &&
            trade.tradeState !== "구매확정" ? (
              <div className="tracking-btn">
                <button onClick={okFunc}>구매확정</button>
                <button onClick={reFunc}>환불신청</button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export {
  DelModal,
  AddressModal,
  RequestModal,
  ProductStatus,
  BidModal,
  ReviewModal,
  SuccessModal,
  RefundModal,
  TrackingModal,
};
