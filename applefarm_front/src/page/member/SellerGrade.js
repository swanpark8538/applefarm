import axios from "axios";
import "./member.css";
import { useEffect, useState } from "react";

const SellerGrade = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [bankAccount, setBankAccount] = useState(null);
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
  }, [member]);

  return (
    <>
      <div className="sellerGrade-title">판매자 등급</div>
      <div className="mypage-content-sellerGrade">
        <div className="sellerGrade-wrap">
          <div className="sellerGrade-box1">
            <div>현재등급</div>
            <div className="grade-data">{member.sellerGrade}</div>
          </div>
          <div className="sellerGrade-box2">
            <div>판매수수료(최대)</div>
            <div className="grade-data">3.0%</div>
          </div>
        </div>
        <div className="sellerGrade-info">
          <div className="grade-img-box">
            <img className="grade-img" src="../image/grade.png" />
          </div>
          <div className="grade-info-box">
            <table>
              <tbody>
                <tr>
                  <td className="grade3">LV.3</td>
                  <td>
                    <p className="charge">판매 수수료</p>
                    <p className="grade-info-text">1.0%</p>
                    <p className="total-amount">전월 총 정산 금액</p>
                    <p className="grade-info-text">
                      1,000만원 ~ 2,000만원 미만
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="grade2">LV.2</td>
                  <td>
                    <p className="charge">판매 수수료</p>
                    <p className="grade-info-text">2.0%</p>
                    <p className="total-amount">전월 총 정산 금액</p>
                    <p className="grade-info-text">200만원 ~ 1,000만원 미만</p>
                  </td>
                </tr>
                <tr>
                  <td className="grade1">LV.1</td>
                  <td>
                    <p className="charge">판매 수수료</p>
                    <p className="grade-info-text">3.0%</p>
                    <p className="total-amount">전월 총 정산 금액</p>
                    <p className="grade-info-text">200만원 미만</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="guide-content-wrap">
            <div className="guide-title">등급 산정 안내</div>
            <ul>
              <li>매원 1일 전월의 '총 정산 금액'을 반영합니다.</li>
              <li>
                '총 정산 금액'은 창고보관으로 구매 후 재판매 주문건은
                제외됩니다.
              </li>
              <li>
                별도 혜택이 적용되는 프로모션은 해당 프로모션의 수수료가
                적용됩니다.
              </li>
              <li>
                향후 팬매자의 등급 선정 기준 및 혜택은 사전 통지 후 변경될 수
                있습니다.
              </li>
              <li>모든 수수료는 VAT 별도입니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerGrade;
