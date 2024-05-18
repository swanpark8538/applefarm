import { useState } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";

const Tab = (props) => {
  const { currentTab, tabMenu, setTabMenu, setCurrentTab } = props;

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeButton,
    setActiveButton,
  } = props;

  const selectMenuHandler = (index) => {
    setCurrentTab(index);
  };

  return (
    <>
      <div className="history-menu-wrap">
        <ul>
          {tabMenu.map((item, index) => (
            <li
              key={"tab" + index}
              className={
                index === currentTab
                  ? "history-menu history-menu-focus refund-menu refund-menu-focus"
                  : "history-menu refund-menu "
              }
              onClick={() => selectMenuHandler(index)}
            >
              {item}
            </li>
          ))}
        </ul>
        <DateSelect
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </div>
    </>
  );
};

const DateSelect = (props) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeButton,
    setActiveButton,
  } = props;

  // 2개월 버튼 클릭 시
  const twoMonth = () => {
    const today = dayjs();
    const twoMonthAgo = today.subtract(2, "month");
    setStartDate(twoMonthAgo);
    setEndDate(today);
    setActiveButton("twoMonth");
  };

  // 6개월 버튼 클릭 시
  const sixMonth = () => {
    const today = dayjs();
    const sixMonthsAgo = today.subtract(6, "month");
    setStartDate(sixMonthsAgo);
    setEndDate(today);
    setActiveButton("sixMonth");
  };

  // 전체 버튼 클릭 시
  const all = () => {
    // 전체 기간을 원하는 날짜로 설정
    // 현재 전체 기간 5년으로 잡아놈
    const projectStartDate = dayjs().subtract(5, "year");
    const today = dayjs();
    setStartDate(projectStartDate);
    setEndDate(today);
    setActiveButton("all"); // 추가: 버튼 활성 상태 설정
  };

  return (
    <div className="history-date-select-wrap ">
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        dateFormats={{ monthShort: "M" }}
      >
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <div className="history-date-select-btn-box">
            <button
              onClick={twoMonth}
              className={
                activeButton === "twoMonth"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              최근 2개월
            </button>
            <button
              onClick={sixMonth}
              className={
                activeButton === "sixMonth"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              6개월
            </button>
            <button
              onClick={all}
              className={
                activeButton === "all"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              전체
            </button>
          </div>
          <DatePicker
            views={["year", "month", "day"]}
            label="시작날짜"
            value={startDate}
            format="YYYY/MM/DD"
            mask={"____/__/__"}
            showDaysOutsideCurrentMonth
            onChange={(date) => setStartDate(date)}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            maxDate={endDate}
          />
          <DatePicker
            views={["year", "month", "day"]}
            label="종료날짜"
            value={endDate}
            format="YYYY/MM/DD"
            mask={"____/__/__"}
            showDaysOutsideCurrentMonth
            onChange={(date) => setEndDate(date)}
            slotProps={{
              textField: {
                size: "small",
              },
              actionBar: {
                actions: ["today"],
              },
            }}
            maxDate={dayjs()}
            minDate={startDate}
          />
          {/**조회버튼 누를때만 조회되게할지 캘린더 누를때마다 변화하게 할지 정해야댐
          <div>
            <button className="date-select-go-btn">조회</button>
          </div>
           */}
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};
export default Tab;
