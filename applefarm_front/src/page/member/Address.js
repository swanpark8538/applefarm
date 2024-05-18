import { useEffect, useState } from "react";
import { AddressModal, DelModal } from "./Modal";
import axios from "axios";
import Pagination from "../../component/Pagination";
const Address = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [modalOpen, setModalOpen] = useState(false);
  const [addressList, setAddressList] = useState(null);
  const [pageInfo, setPageinfo] = useState({});
  const [reqpage, setreqpage] = useState(1);
  const [status, setStatus] = useState(true);

  const [addressName, setAddressName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressDefault, setAddressDefault] = useState(0);

  const plusModal = () => {
    setModalOpen(true);
  };
  //const memberNo = 45; //임의로 설정 -> 로그인 구현후 수정 필요
  /*
  useEffect(() => {
    console.log(status);
  }, [status]);*/
  useEffect(() => {
    //주소록 불러오기
    axios
      .get(backServer + "/member/address/" + reqpage)
      .then((res) => {
        //console.log(res.data);
        //console.log(res.data.data);
        if (res.data.message === "success") {
          setAddressList(res.data.data.addressList);
          setPageinfo(res.data.data.pi);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqpage, status]);

  return (
    <div className="mypage-current-wrap">
      <div className="address-title">
        <h3 className="mypage-current-title">주소록</h3>
        <button className="address-btn basic-address-btn" onClick={plusModal}>
          새 배송지 추가
        </button>
      </div>
      <div className="address-list-wrap">
        {addressList === null ? (
          ""
        ) : addressList[0] !== null ? (
          <>
            <div className="address-list">
              <ul>
                {addressList.map((item, index) => {
                  return (
                    <AddressItem
                      key={"address" + index}
                      item={item}
                      status={status}
                      setStatus={setStatus}
                      addressList={addressList}
                      reqPage={reqpage}
                      setReqPage={setreqpage}
                    />
                  );
                })}
              </ul>
            </div>
            {pageInfo.totalPage <= 1 ? (
              ""
            ) : (
              <div className="address-page">
                <Pagination
                  pageInfo={pageInfo}
                  reqPage={reqpage}
                  setReqPage={setreqpage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="non-address">
            <div>등록된 배송지가 없습니다.</div>
            <div>새 배송지를 등록해주세요.</div>
            <div>
              <button className="address-btn" onClick={plusModal}>
                새 배송지 추가
              </button>
            </div>
          </div>
        )}
      </div>
      {modalOpen && (
        <AddressModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          status={status}
          setStatus={setStatus}
          addressName={addressName}
          setAddressName={setAddressName}
          addressPhone={addressPhone}
          setAddressPhone={setAddressPhone}
          zipcode={zipcode}
          setZipcode={setZipcode}
          address={address}
          setAddress={setAddress}
          addressDetail={addressDetail}
          setAddressDetail={setAddressDetail}
          addressDefault={addressDefault}
          setAddressDefault={setAddressDefault}
        />
      )}
    </div>
  );
};
const AddressItem = (props) => {
  const item = props.item;
  const status = props.status;
  const setStatus = props.setStatus;

  const addressList = props.addressList;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [delModalOpen, setDelModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [addressNo, setAddressNo] = useState(item.addressNo);
  const [addressName, setAddressName] = useState(item.addressName);
  const [addressPhone, setAddressPhone] = useState(item.addressPhone);
  const [zipcode, setZipcode] = useState(item.zipcode);
  const [address, setAddress] = useState(item.address);
  const [addressDetail, setAddressDetail] = useState(item.addressDetail);
  const [addressDefault, setAddressDefault] = useState(item.addressDefault);
  const whatModal = "update";

  useEffect(() => {
    setAddressNo(item.addressNo);
    setAddressName(item.addressName);
    setAddressPhone(item.addressPhone);
    setZipcode(item.zipcode);
    setAddress(item.address);
    setAddressDetail(item.addressDetail);
    setAddressDefault(item.addressDefault);
  }, [item]);

  const updatModalFun = () => {
    //console.log("수정");
    setUpdateModalOpen(true);
  };
  const delModalFun = () => {
    //console.log("삭제");
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
          //console.log(addressList.length);
          //console.log("req:" + reqPage);
          if (reqPage > 1 && addressList.length === 2) {
            setReqPage(reqPage - 1);
          }
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  const basicAddressFun = () => {
    //console.log("기본배송지");
    const obj = { memberNo: item.memberNo, addressNo: item.addressNo };
    axios
      .patch(backServer + "/member/basicAddress", obj)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setStatus(!status);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  return (
    <>
      <li className="address-info-wrap">
        <div className="address-info">
          <div className="address-info-name">
            <span>{item.addressName}</span>
            {item.addressDefault == 1 ? (
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
          <div>{item.addressPhone}</div>
        </div>
        <div className="address-btn-wrap">
          {item.addressDefault !== 1 ? (
            <button
              className="address-btn address-list-btn"
              onClick={basicAddressFun}
            >
              기본배송지
            </button>
          ) : (
            ""
          )}
          <button
            className="address-btn  address-list-btn"
            onClick={updatModalFun}
          >
            수정
          </button>
          {item.addressDefault !== 1 ? (
            <button
              className="address-btn  address-list-btn"
              onClick={delModalFun}
            >
              삭제
            </button>
          ) : (
            ""
          )}
        </div>
      </li>
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
          setModalOpen={setUpdateModalOpen}
          status={status}
          setStatus={setStatus}
          addressName={item.addressName}
          addressPhone={item.addressPhone}
          zipcode={item.zipcode}
          address={item.address}
          addressDetail={item.addressDetail}
          addressDefault={item.addressDefault}
          whatModal={whatModal}
          addressNo={item.addressNo}
        />
      )}
    </>
  );
};
export default Address;
