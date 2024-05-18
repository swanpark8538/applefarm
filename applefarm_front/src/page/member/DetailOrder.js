import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button1, Button2 } from "../../component/FormFrm";
//구매상세
const DetailOrder = () => {
  const pramas = useParams();
  const productNo = pramas.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [trade, setTrade] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(backServer + "/trade/detailOrder/" + productNo)
      .then((res) => {
        console.log(res.data);
        setTrade(res.data.data);
        if (res.data.data === null) {
          Swal.fire("구매내역이 없습니다.")
            .then(() => {
              navigate(-1);
            })
            .catch(() => {});
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  return (
    <>
      {trade === null ? (
        ""
      ) : (
        <div className="mypage-current-wrap">
          <h3 className="mypage-current-title">구매 상세내역</h3>
          <div className="purchase-detail-content">
            <OrderItem trade={trade} type="buyer" />
          </div>
        </div>
      )}
    </>
  );
};
//판매상세
const DetailSales = () => {
  const pramas = useParams();
  const productNo = pramas.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [trade, setTrade] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(backServer + "/trade/detailSales/" + productNo)
      .then((res) => {
        //console.log(res.data);
        setTrade(res.data.data);
        if (res.data.data === null) {
          Swal.fire("판매내역이 없습니다.")
            .then(() => {
              navigate(-1);
            })
            .catch(() => {});
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  return (
    <>
      {trade === null ? (
        ""
      ) : (
        <div className="mypage-current-wrap">
          <h3 className="mypage-current-title">판매 상세내역</h3>
          <div className="purchase-history-content">
            <OrderItem trade={trade} type="seller" />
          </div>
        </div>
      )}
    </>
  );
};
const OrderItem = (props) => {
  const trade = props.trade;
  const type = props.type;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  return (
    <>
      <div className="trade-number-info">
        <span>주문번호</span>
        <span>{trade.paymentNumber}</span>
        {type === "buyer" ? (
          <>
            <span>판매자</span>
            <span>{trade.tradeSellerNickname}</span>
          </>
        ) : (
          <>
            <span>구매자</span>
            <span>{trade.tradeBuyerNickname}</span>
          </>
        )}
      </div>
      <div className="trade-product-info">
        <div className="trade-img-box">
          <img src={backServer + "/product/img/" + trade.productThumbnail} />
        </div>
        <div>{trade.productSummary}</div>
        <div>
          {/*상품상세페이지로 이동 */}
          <Link to={"/product/" + trade.productNo}>
            <Button2 text="상품상세"></Button2>
          </Link>
        </div>
      </div>
      <div className="trade-detail-info">
        <div>{type === "buyer" ? "구매" : "판매"}정산내역</div>
        <table>
          <tbody>
            <tr>
              <td>{type === "buyer" ? "판매가" : "정산금액"}</td>
              <td>{trade.tradePrice.toLocaleString()}원</td>
            </tr>
            <tr>
              <td>거래일</td>
              <td>{trade.tradeDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {type === "seller" ? (
        <div className="trade-detail-info">
          <div>판매 정상 계좌</div>
          <table>
            <tbody>
              <tr>
                <td className="trade-member-account">
                  {trade.memberAccountnumber}
                  국민은행 32934929439349 이사랑
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
      <div className="trade-detail-info">
        <div>{type === "buyer" ? "배송 주소" : "반송 주소"}</div>
        <table>
          <tbody>
            <tr>
              <td>받는사람</td>
              <td>{trade.addressName}</td>
            </tr>
            <tr>
              <td>전화번호</td>
              <td>{trade.addressPhone}</td>
            </tr>
            <tr>
              <td>주소</td>
              <td className="trade-address-info">
                <span>({trade.zipcode})</span>
                <span>{trade.address}</span>
                <span>{trade.addressDetail}</span>
              </td>
            </tr>
            <tr>
              <td>배송요청사항</td>
              <td>{trade.addressRequest}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="history-go-btn">
        <Link
          to={
            type === "seller"
              ? "/mypage/salesHistory"
              : "/mypage/purchaseHistory"
          }
        >
          <Button2 text="구매내역 보기"></Button2>
        </Link>
      </div>
    </>
  );
};
export { DetailOrder, DetailSales };
