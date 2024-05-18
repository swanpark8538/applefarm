import { useNavigate } from "react-router-dom";
import { Button1, Button2, Select } from "../../component/FormFrm";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../../component/Pagination";

const AdminRefund = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER; //BackServer의 IP:Port
  const [refundList, setRefundList] = useState([]); //환불 리스트 데이터 상태변수: 컴포넌트 렌더링 시 환불 리스트를 저장하고 화면에 표시

  const options = [
    { value: 3, label: "전체" },
    { value: 0, label: "진행중" },
    { value: 1, label: "거절" },
    { value: 2, label: "승인" },
  ];
  const [selectedValue, setSelectedValue] = useState(3);

  const selectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log("환불구분:", event.target.value);
  };

  //페이지 네비게이션
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [totalPostCount, setTotalPostCount] = useState();
  const [productThumbnail, setProductThumbnail] = useState();
  const [filterStatus, setFilterStatus] = useState("all");

  //환불 리스트 조회하기
  useEffect(() => {
    axios
      .get(backServer + "/admin/manageRefund/" + reqPage + "/" + selectedValue)
      .then((res) => {
        console.log("환불내역", res.data.data.refundList);

        //페이지 관련 정보 수신 및 Set 처리
        setRefundList(res.data.data.refundList);
        setTotalPostCount(res.data.data.totalPostCount);
        setPageInfo(res.data.data.pi);
        setProductThumbnail(res.data.data.productThumbnail);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage, selectedValue]);

  return (
    <div className="mypage-current-wrap" id="mypage-current-wrap">
      <div className="mypage-current-title">
        <p className="admin-current-p">환불관리</p>
      </div>
      <div className="member-like-tbl-box" id="member-like-tbl-box">
        <table className="admin-tbl">
          <thead>
            <tr>
              <th colSpan={2} width="15%">
                상품상세
              </th>
              <th width="15%">사유</th>
              <th width="10%">판매자</th>
              <th width="10%">구매자</th>
              <th width="15%">구매일</th>
              <th width="15%">신청일</th>
              <th width="10%">
                <Select
                  options={options}
                  addId="admin-product-select"
                  changeEvent={selectChange}
                />
              </th>
              <th width="10%">환불관리</th>
            </tr>
          </thead>
          <tbody>
            {refundList.map((refund, index) => {
              return (
                <RefundItem
                  key={"refund" + index}
                  refund={refund}
                  refundList={refundList}
                  setRefundList={setRefundList}
                  pageInfo={pageInfo}
                  reqPage={reqPage}
                  setReqPage={setReqPage}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-page-wrap">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </div>
  );
};

const RefundItem = (props) => {
  const refund = props.refund;
  const backServer = process.env.REACT_APP_BACK_SERVER; //BackServer의 IP:Port

  const [buttonsVisible, setButtonsVisible] = useState(true); // 버튼 가시성 상태
  console.log("환불");
  const refundStatus = refund.refundStatus;

  const statusClass =
    refundStatus === 0
      ? "in-progress"
      : refundStatus === 1
      ? "rejected"
      : "approved";
  const statusText =
    refundStatus === 0 ? "진행중" : refundStatus === 1 ? "거절" : "승인";

  //모달
  const refundList = props.refundList;
  const setRefundList = props.setRefundList;

  //날짜 데이터
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // 한 자리 숫자일 경우 앞에 0을 붙여주기
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  //환불 승인 함수
  const confirm = (refundNo, tradeNo) => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const obj = { refundNo, tradeNo };

    Swal.fire({
      title: "환불 처리를 하시겠습니다?",
      text: "신중히 검토해주세요.",
      icon: "warning",

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
      cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
      confirmButtonText: "승인", // confirm 버튼 텍스트 지정
      cancelButtonText: "취소", // cancel 버튼 텍스트 지정
      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(backServer + "/admin/refundConfirm", obj)
          .then((res) => {
            // 환불 승인 후 환불 리스트 다시 불러오기
            props.setRefundList((prevRefunds) =>
              prevRefunds.map((item) =>
                item.refundNo === refundNo ? { ...item, refundStatus: 2 } : item
              )
            );
            Swal.fire("승인 완료", "처리일자: " + getFormattedDate());
            setButtonsVisible(false);
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };

  //환불 거절 함수
  const reject = (refundNo, tradeNo) => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const obj = { refundNo, tradeNo };

    Swal.fire({
      title: "환불거절",
      text: "신중히 검토해주세요.",
      icon: "warning",

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
      cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
      confirmButtonText: "거절", // confirm 버튼 텍스트 지정
      cancelButtonText: "취소", // cancel 버튼 텍스트 지정
      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          axios
            .patch(backServer + "/admin/refundReject", obj)
            .then((res) => {
              props.setRefundList((prevRefunds) =>
                prevRefunds.map((item) =>
                  item.refundNo === refundNo
                    ? { ...item, refundStatus: 1 }
                    : item
                )
              );
              Swal.fire("환불 거절", "처리일자: " + getFormattedDate());
              setButtonsVisible(false);
            })
            .catch((res) => {
              console.log(res);
            });
        }
      }
    });
  };

  return (
    <tr>
      <td>
        <div className="member-like-img-box">
          <a href={"http://localhost:3000/product/" + refund.productNo}>
            <img
              src={backServer + "/product/img/" + refund.productThumbnail}
              className="refund-thumbnail"
            />
          </a>
        </div>
      </td>
      <td className="likeName-td">{refund.productSummary}</td>
      <td>{refund.refundReason}</td>
      <td>{refund.sellerNickname}</td>
      <td>{refund.buyerNickname}</td>
      <td>{refund.refundDate}</td>
      <td>{refund.tradeDate}</td>
      <td id="refundStatus" className={statusClass}>
        {statusText}
      </td>
      <td className="purchase-btn-box">
        {refundStatus === 0 && (
          <>
            <Button1
              text="승인"
              addId="approvalBtn"
              clickEvent={() => confirm(refund.refundNo, refund.tradeNo)}
            />
            <Button2
              text="거절"
              addId="denyBtn"
              clickEvent={() => reject(refund.refundNo, refund.tradeNo)}
            />
          </>
        )}
      </td>
    </tr>
  );
};

export default AdminRefund;
