import { useEffect, useState } from "react";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import React from "react";
import Chart from "react-apexcharts";
import { CSVLink } from "react-csv";
import { daDK } from "@mui/x-date-pickers/locales";

const AdminDashboard = (props) => {
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [startDate, setStartDate] = useState(dayjs("2023-11-07"));
  const [endDate, setEndDate] = useState(dayjs("2024-04-02"));
  const filterStartDate = startDate.format("YYYY-MM-DD");
  const filterEndDate = endDate.format("YYYY-MM-DD");
  const [activeButton, setActiveButton] = useState(null); // 추가: 활성 버튼 상태

  const [totalMemberCount, setTotalMemberCount] = useState();
  const [periodMemberCount, setPeriodMemberCount] = useState();
  const [periodTradeCount, setPeriodTradeCount] = useState();
  const numberWithComma = (number) => {
    //숫자 천(1,000)단위 콤마
    return number.toLocaleString();
  };
  const [periodTradeMoney, setPeriodTradeMoney] = useState();

  //랭커
  const [topSellers, setTopSellers] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);

  //거래내역
  const [tradeLog, setTradeLog] = useState([]);

  // 1개월 버튼 클릭 시
  const oneMonth = () => {
    const today = dayjs();
    const oneMonthAgo = today.subtract(1, "month");
    setStartDate(oneMonthAgo);
    setEndDate(today);
    setActiveButton("oneMonth"); // 추가: 버튼 활성 상태 설정
  };

  // 6개월 버튼 클릭 시
  const sixMonth = () => {
    const today = dayjs();
    const sixMonthsAgo = today.subtract(6, "month");
    setStartDate(sixMonthsAgo);
    setEndDate(today);
    setActiveButton("sixMonth"); // 추가: 버튼 활성 상태 설정
  };

  // 전체 버튼 클릭 시
  const all = () => {
    // 전체 기간을 원하는 날짜로 설정fset
    // 예를 들어, 프로젝트 시작일부터 현재까지의 기간 등을 설정할 수 있습니다.
    // 이 예시에서는 프로젝트 시작일이 2022년 1월 1일이라고 가정합니다.
    const projectStartDate = dayjs("2023-11-07");
    const today = dayjs();
    setStartDate(projectStartDate);
    setEndDate(today);
    setActiveButton("all"); // 추가: 버튼 활성 상태 설정
  };

  const headers = [
    { label: "거래번호", key: "tradeNo" },
    { label: "상품번호", key: "productNo" },
    { label: "판매자", key: "sellerNickName" },
    { label: "구매자", key: "buyerNickName" },
    { label: "거래금액", key: "tradePrice" },
    { label: "거래일", key: "tradeDate" },
    { label: "결제상태", key: "tradeState" },
  ];

  const data = tradeLog;

  //다운로드 : Pdf or Excel

  // 구독 버튼 : 메일 입력 시, 월초 발송
  const subscribe = () => {};

  // 회원 차트
  const [options2, setOptions2] = useState({
    series: [
      {
        name: "회원수",
        type: "bar",
        data: [],
      },
    ],

    chart: {
      type: "bar",
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "회원수 추이",
      style: {
        fontSize: "20px",
        fontWeight: "900",
        fontFamily: "ns-b",
        color: "#263238",
      },
    },

    xaxis: {
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    fill: {
      colors: undefined,
      opacity: 0.9,
      type: "solid",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 100],
        colorStops: [],
      },
      image: {
        src: [],
        width: undefined,
        height: undefined,
      },
      pattern: {
        style: "verticalLines",
        width: 6,
        height: 6,
        strokeWidth: 2,
      },
    },
  });

  //거래대금 차트

  const [options, setOptions] = useState({
    series: [
      {
        name: "거래대금(좌)",
        type: "column",
        data: [],
      },
      {
        name: "누적 거래대금(우)",
        type: "area",
        style: {
          fontSize: "20px",
        },
        data: [],
      },
    ],
    chart: {
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "거래대금 추이",
      style: {
        fontSize: "20px",
        fontWeight: "900",
        fontFamily: "ns-b",
        color: "#263238",
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },

    xaxis: {
      labels: {
        format: "dd/MM",
      },
    },
    yaxis: {},
  });

  //페이지 최초 랜더링
  useEffect(() => {
    axios
      .get(
        backServer + "/admin/dashboard/" + filterStartDate + "/" + filterEndDate
      )
      .then((res) => {
        setTotalMemberCount(res.data.data.totalMemberCount);
        setPeriodMemberCount(res.data.data.periodMemberCount);
        setPeriodTradeCount(res.data.data.periodTradeCount);
        setPeriodTradeMoney(numberWithComma(res.data.data.periodTradeMoney));
        console.log(res.data.data);
        const response = res.data.data.enrollDateCount;
        const dates = response.map((item) => item.enrollDate.substring(0, 10));
        const members = response.map((item) => item.memberCount);
        setOptions2((prevOptions) => ({
          ...prevOptions,
          series: [{ ...prevOptions.series[0], data: members }],
          labels: dates,
        }));

        //일자별 (누적, 개별)거래금액
        const response2 = res.data.data.tradeMoneySum;
        const dates2 = response2.map((item) => item.tradeDate.substring(0, 10));
        const price = response2.map((item) => item.tradePrice);
        const cumulativeTradePrice = response2.map(
          (item) => item.cumulativeTradePrice
        );
        // options 객체 업데이트
        setOptions((prevOptions) => ({
          ...prevOptions,
          series: prevOptions.series.map((series, index) => ({
            ...series,
            data: index === 0 ? price : cumulativeTradePrice,
          })),
          labels: dates2,
        }));

        // 판매 랭커 데이터를 상태 변수에 저장
        const sellersData = res.data.data.topFiveSellerRank;
        const sellersData2 = sellersData.map((item) => ({
          nickname: item.sellerNickName,
          tradePrice: item.sellerTradePrice,
        }));
        setTopSellers(sellersData2);

        // 구매 랭커 데이터를 상태 변수에 저장
        const buyersData = res.data.data.topFiveBuyerRank;
        const buyersData2 = buyersData.map((item) => ({
          nickname: item.buyerNickName,
          tradePrice: item.buyerTradePrice,
        }));
        setTopBuyers(buyersData2);
        setTradeLog(res.data.data.tradeLog);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [startDate, endDate]);
  return (
    <div className="mypage-current-wrap">
      {isLogin ? (
        <div className="mypage-current-title">
          <p className="admin-current-p">대시보드</p>
          <div className="date-select-wrap">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <div className="date-wrap">
                  <Button
                    variant="contained"
                    onClick={oneMonth}
                    style={{
                      backgroundColor:
                        activeButton === "oneMonth" ? "#0d6efd" : "#9d9d9d",
                    }}
                  >
                    최근 1개월
                  </Button>
                  <Button
                    variant="contained"
                    onClick={sixMonth}
                    style={{
                      backgroundColor:
                        activeButton === "sixMonth" ? "#0d6efd" : "#9d9d9d",
                    }}
                  >
                    6개월
                  </Button>
                  <Button
                    variant="contained"
                    onClick={all}
                    style={{
                      backgroundColor:
                        activeButton === "all" ? "#0d6efd" : "#9d9d9d",
                    }}
                  >
                    전체
                  </Button>
                </div>
                <DatePicker
                  label="시작날짜"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  maxDate={endDate} // 종료 날짜 이전까지만 선택 가능
                />
                <DatePicker
                  label="종료날짜"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate} // 시작 날짜 이후부터만 선택 가능
                />
                <div className="btnWrap">
                  <div className="dashboard-btn">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "black" }}
                    >
                      <CSVLink
                        headers={headers}
                        data={data}
                        filename={
                          "applefarm_" +
                          filterStartDate +
                          "~" +
                          filterEndDate +
                          ".csv"
                        }
                        target="_blank"
                      >
                        다운로드
                      </CSVLink>
                    </Button>
                  </div>
                  <div className="dashboard-btn">
                    {/* <Button
                    variant="contained"
                    style={{ backgroundColor: "var(--main_02" }}
                    onClick={subscribe}
                  >
                    구독하기
                  </Button> */}
                  </div>
                </div>
              </DemoContainer>
            </LocalizationProvider>
          </div>

          {/* 대시보드 콘텐츠 시작*/}
          <div className="dashboard-wrap">
            <div className="summary">
              <div className="total-member">
                <p>전체회원</p>
                <span>{totalMemberCount}명</span>
              </div>
              <div className="total-member">
                <p>신규유입</p>
                <span>{periodMemberCount}명</span>
              </div>
              <div className="total-product">
                <p>거래건수</p>
                <span>{periodTradeCount}건</span>
              </div>
              <div className="tota-trade">
                <p>거래금액</p>
                <span>{periodTradeMoney}원</span>
              </div>
            </div>
            <div className="charts">
              <Chart
                options={options2}
                series={options2.series}
                type="area"
                height={280}
              />
            </div>
            <div className="charts">
              <Chart options={options} series={options.series} height={280} />
            </div>
            <div className="rank-wrap">
              <div className="top-seller">
                <ul>
                  <p className="king">판매금액 상위 Top5</p>
                  {topSellers.map((seller, index) => (
                    <li key={index} className="trade-king">
                      <span>{index + 1}위</span>
                      <span>{seller.nickname}</span>
                      <span>{numberWithComma(seller.tradePrice)}원</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="top-buyer">
                <ul>
                  <p className="king">구매금액 상위 Top5</p>
                  {topBuyers.map((buyer, index) => (
                    <li key={index} className="trade-king">
                      <span>{index + 1}위</span>
                      <span>{buyer.nickname}</span>
                      <span>{numberWithComma(buyer.tradePrice)}원</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="trade-title">거래내역</p>
            <div
              className="member-like-tbl-box charts"
              id="member-like-tbl-box"
            >
              <table className="admin-tbl" id="trade-log-tbl">
                <thead>
                  <tr>
                    <th width="10%">거래번호</th>
                    <th width="10%">상품번호</th>
                    <th width="15%">판매자</th>
                    <th width="15%">구매자</th>
                    <th width="15%">거래금액</th>
                    <th width="20%">거래일</th>
                    <th width="15%">결제상태</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeLog.map((trade, index) => (
                    <tr key={index}>
                      <td>{trade.tradeNo}</td>
                      <td>{trade.productNo}</td>
                      <td>{trade.sellerNickName}</td>
                      <td>{trade.buyerNickName}</td>
                      <td>{trade.tradePrice}</td>
                      <td>{trade.tradeDate}</td>
                      <td>{trade.tradeState}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
