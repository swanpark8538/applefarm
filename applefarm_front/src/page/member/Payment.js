import { Select, stepLabelClasses } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AddressModal, DelModal, RequestModal } from "./Modal";

const Payment = (props) => {
  const params = useParams();
  const productNo = params.productNo;
  const bidThough = params.bid;
  const navigate = useNavigate();
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [addressList, setAddressList] = useState([]);
  const [agreeChk, setAgreeChk] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [product, setProduct] = useState([]);
  const [member, setMember] = useState([]);
  const [price, setPrice] = useState(0); //1,000,000
  const [tradeExist, setTradeExist] = useState(0); //거래내역 존재하는지 확인용 값

  //배송주소
  const [deliveryAddressNo, setDeliveryAddressNo] = useState("");
  const [deliveryZipcode, setDeliveryZipcode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState("");
  const [deliveryAddressName, setDeliveryAddressName] = useState("");
  const [deliveryAddressPhone, setDeliveryAddressPhone] = useState("");

  if (!isLogin) {
    Swal.fire("로그인 후 이용 가능합니다.")
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  }

  //console.log(product);
  //console.log(tradeExist);
  useEffect(() => {
    //구매자 정보+기본배송지+상품정보+판매유무 가져오기
    axios
      .get(backServer + "/member/paymentInfo/" + productNo + "/" + bidThough)
      .then((res) => {
        if (res.data.message === "success") {
          setTradeExist(res.data.data.tradeExist);
          if (res.data.data.tradeExist > 0) {
            //거래가 진행중(예약,결제완료 등등)일 시 구매페이지 노출 안되도록
            Swal.fire("거래 완료된 상품입니다.")
              .then(() => {
                navigate(-1);
              })
              .catch(() => {});
          }
          setMember(res.data.data.member);
          setProduct(res.data.data.product);
          setPrice(res.data.data.product.productPrice.toLocaleString());
          const data = res.data.data.address;
          setDeliveryAddressName(data.addressName);
          setDeliveryAddressPhone(data.addressPhone);
          setDeliveryZipcode(data.zipcode);
          setDeliveryAddress(data.address);
          setDeliveryAddressDetail(data.addressDetail);
          setDeliveryAddressNo(data.addressNo);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, []);
  useEffect(() => {
    //전체 주소록 불러오기
    axios
      .get(backServer + "/member/allAddress")
      .then((res) => {
        //console.log(res.data);
        if (res.data.message === "success") {
          setAddressList(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
    setDeliveryAddress(deliveryAddress);
    setDeliveryAddressDetail(deliveryAddressDetail);
    setDeliveryAddressName(deliveryAddressName);
    setDeliveryAddressPhone(deliveryAddressPhone);
    setDeliveryZipcode(deliveryZipcode);
  }, [status]);

  //console.log(product);

  const agreeFunc = (e) => {
    if (!e.target.checked) {
      setAgreeChk(true);
    } else {
      setAgreeChk(false);
    }
  };

  //새 주소 추가
  const plusAddress = () => {
    setModalOpen(true);
  };
  //주소록보기
  const [openAddress, setOpenAddress] = useState(false);
  const addressShow = () => {
    setOpenAddress(!openAddress);
  };

  const [openRequest, setOpenRequest] = useState(false);
  const requestModal = () => {
    setOpenRequest(true);
  };

  const [selectOption, setSelectOption] = useState("");
  const [freeMessage, setFreeMessage] = useState("");
  const [deliveryAddressRequest, setDeliveryAddressRequest] =
    useState("요청사항 없음");
  const [options, setOptions] = useState([
    { text: "요청사항 없음", active: true },
    { text: "문 앞에 놓아주세요", active: false },
    { text: "경비실에 맡겨 주세요", active: false },
    { text: "파손 위험 상품입니다. 배송 시 주의해주세요", active: false },
    { text: "직접 입력", active: false },
  ]);
  //console.log(product);

  //결제하기
  const buyProduct = () => {
    //거래테이블에 있는지 조회하고 있으면 거래요청 막고 이전페이지 이동
    //(동시 결제페이지 있었고 이후 한명이 먼저 결제완료 시 결제 요청받지 않도록)
    axios
      .get(backServer + "/trade/exist/" + product.productNo)
      .then((res) => {
        if (res.data.message === "success") {
          setTradeExist(res.data.data);
          if (res.data.data > 0) {
            Swal.fire("거래 완료된 상품입니다.")
              .then(() => {
                navigate(-1);
              })
              .catch(() => {});
          } else {
            //결제창
            const { IMP } = window;
            IMP.init("imp14207253");
            const date = new Date();
            const dateString =
              date.getFullYear() +
              "" +
              (date.getMonth() + 1) +
              "" +
              date.getDate() +
              "" +
              date.getHours() +
              "" +
              date.getMinutes() +
              "" +
              date.getSeconds() +
              "" +
              date.getMilliseconds();
            const paymentNumber =
              product.productNo + dateString + member.memberNo;
            const obj = {
              merchant_uid: paymentNumber, //거래정보
              name: product.productSummary, //상품정보
              amount: product.productPrice,
              buyer_email: member.memberEmail, //회원정보
              buyer_name: member.memberName,
              buyer_tel: member.memberPhone,
              buyer_addr: deliveryAddress + " " + deliveryAddressDetail, //배송정보
              buyer_postcode: deliveryZipcode,
            };
            //결제
            IMP.request_pay(
              {
                pg: "html5_inicis.INIpayTest",
                pay_method: "card",
                merchant_uid: obj.merchant_uid,
                name: obj.name,
                amount: obj.amount,
                buyer_email: obj.buyer_email,
                buyer_name: obj.buyer_name,
                buyer_tel: obj.buyer_tel,
                buyer_addr: obj.buyer_addr,
                buyer_postcode: obj.buyer_postcode,
              },
              function (rsp) {
                // callback
                if (rsp.success) {
                  console.log(rsp);
                  //alert("결제 성공");
                  //관련정보 trade_tbl에 insert
                  //조회 후 결제완료 페이지 이동
                  const trade = {
                    paymentNumber: paymentNumber,
                    tradeSeller: product.memberNo,
                    productNo: product.productNo,
                    tradePrice: product.productPrice,
                    zipcode: deliveryZipcode,
                    address: deliveryAddress,
                    addressDetail: deliveryAddressDetail,
                    addressName: deliveryAddressName,
                    addressPhone: deliveryAddressPhone,
                    addressRequest: deliveryAddressRequest,
                  };
                  if (bidThough === "y") {
                    //입찰성공통해서 들어올 시 updqte
                    console.log(trade);
                    axios
                      .patch(backServer + "/trade", trade)
                      .then((res) => {
                        console.log(res.data);
                        if (res.data.message === "success") {
                          navigate("/completePayment/" + trade.productNo);
                        } else {
                          alert("서버 오류 관리자에게 문의해주세요.");
                        }
                      })
                      .catch((res) => {
                        console.log(res.data);
                      });
                  } else {
                    //아닐시 insert
                    axios
                      .post(backServer + "/trade", trade)
                      .then((res) => {
                        console.log(res.data);
                        if (res.data.message === "success") {
                          navigate("/completePayment/" + trade.productNo);
                        } else {
                          alert("서버 오류 관리자에게 문의해주세요.");
                        }
                      })
                      .catch((res) => {
                        console.log(res.data);
                      });
                  }
                } else {
                  console.log(rsp);
                }
              }
            );
          }
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <>
      {!isLogin ||
      product === null ||
      product === undefined ||
      tradeExist > 0 ? (
        ""
      ) : (
        <div className="payment-wrap">
          <div className="payment-title">주문 / 결제</div>
          <div className="payment-content">
            <div className="payment-info-wrap">
              <div className="payment-sub-title">상품 정보</div>
              <div className="payment-info">
                <div className="payment-product">
                  <div className="payment-img-box">
                    <img
                      src={
                        backServer + "/product/img/" + product.productThumbnail
                      }
                    />
                  </div>
                  <div className="payment-product-detail">
                    {/*
                    <div>
                      <span>{product.memberNickName}</span>
                      님의 product
                    </div>
                    
                    */}
                    <div>
                      <span>{product.productSummary}</span>
                      {/**
                       <span>{product.productQuality}급</span>
                       */}
                    </div>
                  </div>
                  <div>
                    <div>{price}원</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="payment-info-wrap">
              <div className="payment-sub-title">
                배송 주소
                <div className="payment-adress-plus" onClick={plusAddress}>
                  {" "}
                  + 새 주소 추가
                </div>
                {modalOpen && (
                  <AddressModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    status={status}
                    setStatus={setStatus}
                    setDeliveryAddress={setDeliveryAddress}
                    setDeliveryAddressDetail={setDeliveryAddressDetail}
                    setDeliveryAddressName={setDeliveryAddressName}
                    setDeliveryAddressPhone={setDeliveryAddressPhone}
                    setDeliveryZipcode={setDeliveryZipcode}
                    setDeliveryAddressNo={setDeliveryAddressNo}
                    delivery="deliveryPlus"
                  />
                )}
              </div>
              <div className="payment-info">
                {deliveryAddress === "" ? (
                  ""
                ) : (
                  <>
                    <div className="payment-delivery">
                      <div className="payment-delivery-detail">
                        <table>
                          <tbody>
                            <tr>
                              <td>받는분</td>
                              <td colSpan={3}>{deliveryAddressName}</td>
                            </tr>
                            <tr>
                              <td>연락처</td>
                              <td colSpan={3}>{deliveryAddressPhone}</td>
                            </tr>
                            <tr>
                              <td>배송 주소</td>
                              <td>({deliveryZipcode})</td>
                              <td>{deliveryAddress}</td>
                              <td>{deliveryAddressDetail}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <button
                          className="delivery-address-btn"
                          onClick={addressShow}
                        >
                          주소록
                        </button>
                      </div>
                    </div>
                    <div className="delivery-request-btn-box">
                      <button
                        className="delivery-request-btn"
                        onClick={requestModal}
                      >
                        {deliveryAddressRequest}
                      </button>
                      <span className="material-icons delivery-request-icon">
                        chevron_right
                      </span>
                    </div>
                  </>
                )}

                {openRequest && (
                  <RequestModal
                    setOpenRequest={setOpenRequest}
                    openRequest={openRequest}
                    options={options}
                    setOptions={setOptions}
                    deliveryAddressRequest={deliveryAddressRequest}
                    setDeliveryAddressRequest={setDeliveryAddressRequest}
                    freeMessage={freeMessage}
                    setFreeMessage={setFreeMessage}
                    selectOption={selectOption}
                    setSelectOption={setSelectOption}
                  />
                )}
              </div>
              {openAddress && (
                <div className="payment-address-list">
                  {addressList.map((item, index) => {
                    return (
                      <AddressItem
                        key={"address" + index}
                        item={item}
                        status={status}
                        setStatus={setStatus}
                        setDeliveryAddress={setDeliveryAddress}
                        setDeliveryAddressDetail={setDeliveryAddressDetail}
                        setDeliveryAddressName={setDeliveryAddressName}
                        setDeliveryAddressPhone={setDeliveryAddressPhone}
                        setDeliveryZipcode={setDeliveryZipcode}
                        setDeliveryAddressNo={setDeliveryAddressNo}
                        setOpenAddress={setOpenAddress}
                        openAddress={openAddress}
                        deliveryAddressNo={deliveryAddressNo}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <div className="payment-agree-message">
              <input
                type="checkbox"
                id="agreeChk"
                name="agreeChk"
                onChange={agreeFunc}
              ></input>
              <label htmlFor="agreeChk">
                단순변심으로 인한 환불은 불가합니다.
              </label>
            </div>
            <div className="payment-purchase-btn-box">
              <button
                className="payment-purchase-btn"
                disabled={agreeChk || deliveryAddress === ""}
                onClick={buyProduct}
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const AddressItem = (props) => {
  const {
    item,
    status,
    setStatus,
    setDeliveryAddress,
    setDeliveryAddressDetail,
    setDeliveryAddressName,
    setDeliveryAddressPhone,
    setDeliveryZipcode,
    setDeliveryAddressNo,
    deliveryAddressNo,
    setOpenAddress,
    openAddress,
  } = props;
  //const [selected, setSelected] = useState();

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [delModalOpen, setDelModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [addressNo, setAddressNo] = useState("");
  /*
  const [addressName, setAddressName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressDefault, setAddressDefault] = useState("");*/
  const whatModal = "update";

  const handleRadioClick = (e) => {
    console.log(e.target.value);
    setAddressNo(e.target.value);
    //setSelected(e.target.value);
    setDeliveryAddressNo(item.addressNo);
    setDeliveryAddress(item.address);
    setDeliveryAddressDetail(item.addressDetail);
    setDeliveryAddressName(item.addressName);
    setDeliveryZipcode(item.zipcode);
    setDeliveryAddressPhone(item.addressPhone);
    setOpenAddress(!openAddress);
  };
  /*
  useEffect(() => {
    setAddressNo(item.addressNo);
    setAddressName(item.addressName);
    setAddressPhone(item.addressPhone);
    setZipcode(item.zipcode);
    setAddress(item.address);
    setAddressDetail(item.addressDetail);
    setAddressDefault(item.addressDefault);
  }, [item]);
*/
  const updatModalFun = () => {
    setUpdateModalOpen(true);
  };
  const delModalFun = () => {
    setDelModalOpen(true);
  };
  const addressDelFun = () => {
    axios
      .delete(backServer + "/member/address/" + item.addressNo)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setStatus(!status);
          setDelModalOpen(false);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  return (
    <div className="address-item-wrap">
      <input
        className="address-item-radio"
        type="radio"
        name="address"
        id={item.addressNo}
        defaultValue={item.addressNo}
        onChange={handleRadioClick}
        checked={deliveryAddressNo === item.addressNo}
      />
      <div className="address-item">
        <label htmlFor={item.addressNo}>
          <div className="payment-info-address">
            <div className="address-info-name">
              <span>{item.addressName}</span>
              {item.addressDefault === 1 ? (
                <span className="default-address-mark">기본 배송지</span>
              ) : (
                ""
              )}
            </div>
            <div className="address-info-address">
              <span>({item.zipcode})</span>
              <span>{item.address}</span>
              <span>{item.addressDetail}</span>
            </div>
            <div>
              <span>{item.addressPhone}</span>
            </div>
          </div>
          <div>
            <button
              className="address-btn address-list-btn"
              onClick={updatModalFun}
            >
              수정
            </button>
            {item.addressDefault !== 1 && (
              <button
                className="address-btn address-list-btn"
                onClick={delModalFun}
              >
                삭제
              </button>
            )}
          </div>
        </label>
      </div>
      {delModalOpen && (
        <DelModal
          setModalOpen={setDelModalOpen}
          clickEvent={addressDelFun}
          text="Are you sure you want to delete the address?"
          icon="delete_forever"
        />
      )}
      {updateModalOpen && (
        <AddressModal
          modalOpen={updateModalOpen}
          status={status}
          setStatus={setStatus}
          setModalOpen={setUpdateModalOpen}
          addressName={item.addressName}
          addressPhone={item.addressPhone}
          zipcode={item.zipcode}
          address={item.address}
          addressDetail={item.addressDetail}
          addressDefault={item.addressDefault}
          whatModal={whatModal}
          addressNo={item.addressNo}
          delivery="deliveryUpdate"
        />
      )}
    </div>
  );
};
export default Payment;
