import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const SalesProductDetails = (props) => {
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

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const product = useParams();
  const productNo = product.productNo;
  const [trade, setTrade] = useState([]);

  const navigate = useNavigate();

  const productDetail = () => {
    navigate("/product/:");
  };

  useEffect(() => {
    axios
      .post(backServer + "/member/getSalesProductDetails/" + productNo)
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data);
          setTrade(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [productNo, backServer]);

  return (
    <>
      <div className="mypage-current-wrap">
        <h3 className="mypage-current-title">판매상세</h3>
        <table className="sales-detail-table">
          <thead>
            <tr>
              <td className="sales-status">{trade.tradeState}</td>
            </tr>
            <tr>
              <td>
                <img
                  className="sales-detail-img"
                  src={
                    backServer + "/product/img/" + `/${trade.productThumbnail}`
                  }
                  alt="iPhone"
                />
              </td>
              <td className="sales-text">{trade.productSummary}</td>
              <td className="sales-text">
                <Link to={`/product/${product.productNo}`}>
                  <button onClick={productDetail}>상품상세</button>
                </Link>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sales-detail-info-title">판매정산내역</td>
            </tr>
            <tr>
              <td className="sales-mini-title">판매금액</td>
              <td className="sales-detail-info">{trade.tradePrice}원</td>
            </tr>
            <tr>
              <td className="sales-mini-title">수수료</td>
              <td className="sales-detail-info">
                -
                {trade.sellerGrade === 1
                  ? 0.3 * trade.tradePrice
                  : trade.sellerGrade === 2
                  ? 0.2 * trade.tradePrice
                  : 0.1 * trade.tradePrice}
                원
              </td>
            </tr>
            <tr>
              <td className="sales-mini-title">정산금액</td>
              <td className="sales-detail-info">
                {trade.tradePrice -
                  (trade.sellerGrade === 1
                    ? 0.3 * trade.tradePrice
                    : trade.sellerGrade === 2
                    ? 0.2 * trade.tradePrice
                    : 0.1 * trade.tradePrice)}
                원
              </td>
            </tr>
            <tr>
              <td className="sales-mini-title">거래일시</td>
              <td className="sales-detail-info">
                {dayjs(product.productDate).format("YYYY-MM-DD")}
              </td>
            </tr>
            <tr>
              <td className="sales-detail-info-title ">판매정산계좌</td>
            </tr>
            <tr>
              <td className=" sales-mini-title">{trade.memberAccountnumber}</td>
              <td className="sales-detail-info"></td>
            </tr>
            <tr>
              <td className="sales-detail-info-title">반송주소</td>
            </tr>
            <tr>
              <td className="sales-mini-title">받는사람</td>
              <td className="sales-detail-info">{trade.memberName}</td>
            </tr>
            <tr>
              <td className="sales-mini-title">전화번호</td>
              <td className="sales-detail-info">{trade.memberPhone}</td>
            </tr>
            <tr>
              <td className="sales-mini-title">주소</td>
              <td className="sales-detail-info">
                <span>{trade.ad}</span>({trade.zipcode}) {trade.address}{" "}
                {trade.addressDetail}
              </td>
            </tr>
            <tr className="salesListBtn">
              <Link to="/mypage/salesHistory">
                <button>목록보기</button>
              </Link>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SalesProductDetails;
