import axios from "axios";
import { useEffect, useState } from "react";
import "./productSearch.css";

const ProductSearch = (props) => {
  const [tableName, setTableName] = useState("IPHONE_TBL");

  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [searchWord, setSearchWord] = useState(1);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  useEffect(() => {
    axios
      .get(
        backServer +
          "/product/search/" +
          tableName +
          "?reqPage=" +
          reqPage +
          "&searchWord=" +
          searchWord
      )
      .then((res) => {
        console.log(res.data.data);
        setProductList(res.data.data.productList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, []);

  // useEffect(()=>{

  // },[])

  return (
    <div className="prudctSearch-">
      <div className="productSearch-top">
        <div className="productSearch-top-title">
          {tableName==="IPHONE_TBL" ? (<>아이폰 검색</>) :
          tableName==="MACBOOK_TBL" ? (<>맥북 검색</>) :
          tableName==="IPAD_TBL" ? (<>아이패드 검색</>) :
          tableName==="WATCH_TBL" ? (<>애플워치 검색</>) :
          tableName==="AIRPODS_TBL" ? (<>에어팟 검색</>) : ""}</div>
      </div>
      <div className="productSearch-search"></div>
      <div className="productSearch-select"></div>
      <div className="productSearch-item"></div>
      <div className="productSearch-page"></div>
    </div>
  );
};

export default ProductSearch;
