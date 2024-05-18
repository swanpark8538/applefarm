import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../component/Pagination";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { Select } from "../../component/FormFrm";
import { Checkbox } from "@mui/material";
import "./admin.css";

const AdminProduct = (props) => {
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [startDate, setStartDate] = useState(dayjs("2023-11-07"));
  const [endDate, setEndDate] = useState(dayjs("2024-04-02"));
  const filterStartDate = startDate.format("YYYY-MM-DD");
  const filterEndDate = endDate.format("YYYY-MM-DD");
  const [activeButton, setActiveButton] = useState(null); // 추가: 활성 버튼 상태
  const [checkedList, setCheckedList] = useState([]);
  const [productHideChange, setProductHideChange] = useState(false); // 숨김 상태 변경 감지 상태 추가

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
    // 전체 기간을 원하는 날짜로 설정
    // 예를 들어, 프로젝트 시작일부터 현재까지의 기간 등을 설정할 수 있습니다.
    // 이 예시에서는 프로젝트 시작일이 2022년 1월 1일이라고 가정합니다.
    const projectStartDate = dayjs("2022-01-01");
    const today = dayjs();
    setStartDate(projectStartDate);
    setEndDate(today);
    setActiveButton("all"); // 추가: 버튼 활성 상태 설정
  };

  const options = [
    { value: "0", label: "전체" },
    { value: "IPHONE_TBL", label: "IPHONE" },
    { value: "MACBOOK_TBL", label: "MACBOOK" },
    { value: "IPAD_TBL", label: "IPAD" },
    { value: "WATCH_TBL", label: "WATCH" },
    { value: "AIRPODS_TBL", label: "AIRPODS" },
  ];
  const [selectedValue, setSelectedValue] = useState(0);

  const selectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    axios
      .get(
        backServer +
          "/admin/memberProduct/" +
          selectedValue +
          "/" +
          filterStartDate +
          "/" +
          filterEndDate +
          "/" +
          reqPage
      )
      .then((res) => {
        setProductList(res.data.data.adminProductList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [reqPage, startDate, endDate, selectedValue, productHideChange]);

  const checkHide = () => {
    const checkedObject = {};
    checkedList.forEach((value, index) => {
      checkedObject[`item${index}`] = value; // 각 값(value)을 특정 키(item0, item1, ...)와 연결하여 객체 생성
    });
    axios
      .patch(backServer + "/admin/hideProduct", checkedObject)
      .then((res) => {
        setProductHideChange(!productHideChange);
      })
      .catch((res) => {
        console.log(res.data);
      });
  };

  const checkUnHide = () => {
    const checkedObject = {};
    checkedList.forEach((value, index) => {
      checkedObject[`item${index}`] = value; // 각 값(value)을 특정 키(item0, item1, ...)와 연결하여 객체 생성
    });
    axios
      .patch(backServer + "/admin/unHideProduct", checkedObject)
      .then((res) => {
        setProductHideChange(!productHideChange);
      })
      .catch((res) => {
        console.log(res.data);
      });
  };

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">
        <p className="admin-current-p">상품 관리</p>
        <div className="date-select-wrap">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <div>
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
              />
              <DatePicker
                label="종료날짜"
                value={endDate}
                onChange={(date) => setEndDate(date)}
              />
              <div className="btnWrap">
                <div>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "black" }}
                    onClick={checkHide}
                  >
                    숨김
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "var(--main_01" }}
                    onClick={checkUnHide}
                  >
                    공개
                  </Button>
                </div>
              </div>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <div className="member-like-tbl-box" id="member-like-tbl-box">
        <table className="admin-tbl">
          <thead>
            <tr>
              <th width="15%">
                <Select
                  options={options}
                  addId="admin-product-select"
                  changeEvent={selectChange}
                />
              </th>
              <th width="25%">제목</th>
              <th width="15%">작성자</th>
              <th width="25%">작성일</th>
              <th width="10%">숨김상태</th>
              <th width="10%">체크박스</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => {
              return (
                <ProductItem
                  key={"product" + index}
                  product={product}
                  setProductList={setProductList}
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  setProductHideChange={setProductHideChange}
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

const ProductItem = (props) => {
  const { product, checkedList, setCheckedList } = props;
  const [productHide, setProductHide] = useState(product.productHide);

  useEffect(() => {
    setProductHide(product.productHide);
  }, [product.productHide]);

  const checkboxChange = (productNo) => {
    setCheckedList((checkedList) => {
      if (checkedList.includes(productNo)) {
        // 이미 선택된 상품일 경우, 선택 해제
        return checkedList.filter((item) => item !== productNo);
      } else {
        // 선택되지 않은 상품일 경우, 선택
        return [...checkedList, productNo]; // 새로운 배열에 productNo 추가
      }
    });
  };

  return (
    <tr>
      <td>
        {product.tableName === "IPHONE_TBL"
          ? "아이폰"
          : product.tableName === "MACBOOK_TBL"
          ? "맥북"
          : product.tableName === "IPAD_TBL"
          ? "아이팬드"
          : product.tableName === "AIRPODS_TBL"
          ? "에어팟"
          : product.tableName === "WATCH_TBL"
          ? "애플워치"
          : "전체"}
      </td>
      <td>
        <a
          className="adminalink"
          href={"http://localhost:3000/product/" + product.productNo}
        >
          {product.productTitle}
        </a>
      </td>
      <td>{product.memberName}</td>
      <td>{product.productDate}</td>
      <td>{product.productHide === "0" ? "공개" : "비공개"}</td>
      <td>
        <Checkbox onChange={() => checkboxChange(product.productNo)} />
      </td>
    </tr>
  );
};

export default AdminProduct;
