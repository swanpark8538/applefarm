import Tab from "./Tab";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-modal";

const RefundHistory = (props) => {
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
  }, []);

  console.log(member);

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [product, setProduct] = useState([]); //상품테이블 데이터
  const [refund, setRefund] = useState([]); //환불테이블 데이터

  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [activeButton, setActiveButton] = useState();

  const memberNo = member.memberNo;

  const [currentTab, setCurrentTab] = useState(0);
  const [tabMenu, setTabMenu] = useState(["환불 진행중", "완료"]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [filteredRefund, setFilteredRefund] = useState([]);
  const [visibleCount, setVisibleCount] = useState(1); // 화면에 보여줄 데이터 수
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    const dateFiltered = refund.filter((item) => {
      const refundDate = dayjs(item.refundDate);
      return (
        refundDate.isAfter(startDate) &&
        refundDate.isBefore(endDate.add(1, "day"))
      );
    });

    const statusFiltered = dateFiltered
      .filter((item) => {
        if (currentTab === 0) {
          return item.refundStatus === 0;
        } else if (currentTab === 1) {
          return item.refundStatus === 1 || item.refundStatus === 2;
        }
        return true;
      })
      .filter((item) => {
        if (filter === "전체") {
          return true;
        } else {
          const statusMap = { 승인: 2, 반려: 1, 환불진행중: 0 };
          return item.refundStatus === statusMap[filter];
        }
      });

    setFilteredRefund(statusFiltered);

    setVisibleCount(1);
  }, [refund, startDate, endDate, currentTab, filter]);

  //더보기
  const showMoreItems = () => {
    setVisibleCount((prev) => Math.min(prev + 2, filteredRefund.length));
  };

  //탭초기화
  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
    setVisibleCount(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    closeModal();
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
      width: "30%",
      height: "35%",
      margin: "12% auto",
      borderRadius: "15px",
      zIndex: "1001", //모달 컨텐츠 z-index
      position: "relative", //모달 컨텐츠 포지션,이게 있어야 zIndex 사용
    },
  };

  //데이터 가져오기
  useEffect(() => {
    console.log(member.memberNo);
    axios
      .post(backServer + "/member/getRefund/" + member.memberNo)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          console.log(res.data);
          setRefund(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [member.memberNo, backServer]);

  return (
    <>
      <div className="mypage-current-wrap">
        <h3 className="mypage-current-title">환불내역</h3>
        <div className="refund-history-content">
          <Tab
            tabMenu={tabMenu}
            setTabMenu={setTabMenu}
            currentTab={currentTab}
            setCurrentTab={handleTabChange}
            startDate={startDate}
            endDate={endDate}
            activeButton={activeButton}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setActiveButton={setActiveButton}
          />

          {currentTab === 0 ? (
            <>
              <table className="refundHistory-content">
                <thead>
                  <tr className="refundHistory-title">
                    <td></td>
                    <td></td>
                    <td className="refund-history-title">결제금액</td>
                    <td className="refund-history-title">상태</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefund
                    .slice(0, visibleCount)
                    .map((product, index) => (
                      <>
                        <tr key={index}>
                          <td className="refund-history-Date">
                            {dayjs(product.refundDate).format("YYYY-MM-DD")}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="refund-history-img"
                              src={
                                backServer +
                                "product/img/" +
                                product.productThumbnail
                              }
                            />
                          </td>
                          <td className="refund-info">
                            {product.productSummary}
                          </td>
                          <td className="refund-info">
                            {product.productPrice}
                            <span>원</span>
                          </td>
                          <td className="refund-info">
                            {product.refundStatus === 0
                              ? "환불진행중"
                              : product.refundStatus === 1
                              ? "반려"
                              : "승인"}
                          </td>
                        </tr>
                      </>
                    ))}
                  {visibleCount < filteredRefund.length && (
                    <tr className="refund-more-btn">
                      <button onClick={showMoreItems}>더보기</button>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <table className="refundHistory-content">
                <thead>
                  <tr className="refundHistory-title">
                    <td className="allSales-btn">
                      <button onClick={openModal}>
                        <span>{filter}</span>
                        <span className="material-icons arrow-icon">
                          arrow_right
                        </span>
                      </button>
                    </td>

                    <td></td>
                    <td className="refund-history-title">결제금액</td>
                    <td className="refund-history-title">상태</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefund
                    .slice(0, visibleCount)
                    .map((product, index) => (
                      <>
                        <tr key={index}>
                          <td className="refund-history-Date">
                            {dayjs(product.refundDate).format("YYYY-MM-DD")}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="refund-history-img"
                              src={
                                backServer +
                                "product/img/" +
                                product.productThumbnail
                              }
                            />
                          </td>
                          <td className="refund-info">
                            {product.productSummary}
                          </td>
                          <td className="refund-info">
                            {product.productPrice}
                            <span>원</span>
                          </td>
                          <td className="refund-info">
                            {product.refundStatus === 0
                              ? "환불진행중"
                              : product.refundStatus === 1
                              ? "반려"
                              : "승인"}
                          </td>
                        </tr>
                      </>
                    ))}
                  {visibleCount < filteredRefund.length && (
                    <tr className="refund-more-btn">
                      <button onClick={showMoreItems}>더보기</button>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <div className="filter-btn-wrap">
              <div className="filter-box1">
                <button onClick={() => handleFilterChange("전체")}>전체</button>
                <button onClick={() => handleFilterChange("승인")}>승인</button>
                <button onClick={() => handleFilterChange("반려")}>반려</button>
              </div>
              <div>
                <button className="sales-close-btn" onClick={closeModal}>
                  닫기
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default RefundHistory;
