const RefundDelivery = () => {
  return (
    <div className="refundDelivery-wrap">
      <div className="refundDelivery">
        <h2>배송 & 환불 규정</h2>
        <table>
          <thead>
            <tr>
              <th>배송 상태</th>
              <th>상태 설명</th>
              <th>요청 가능 기능</th>
              <th>처리 방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>예약중</td>
              <td>
                판매자가
                <br />
                구매호가 선택
              </td>
              <td className="refundDelivery-red">예약취소</td>
              <td>
                <dt>마이페이지에서 [예약 취소]버튼 클릭시 즉시 환불 처리</dt>
                <dd>서버 상태에 따라 취소 시점에 차이가 있을 수 있습니다.</dd>
              </td>
            </tr>

            <tr>
              <td>결제 완료</td>
              <td>
                구매자가
                <br />
                상품 결제
              </td>
              <td>-</td>
              <td>
                <dt>단순변심 환불 불가</dt>
              </td>
            </tr>

            <tr>
              <td>발송 대기</td>
              <td>
                판매자가
                <br />
                상품 발송
              </td>
              <td>-</td>
              <td>
                <dt>단순변심 환불 불가</dt>
              </td>
            </tr>

            <tr>
              <td>배송중</td>
              <td>-</td>
              <td>-</td>
              <td>
                <dt>단순변심 환불 불가</dt>
              </td>
            </tr>

            <tr>
              <td>배송 완료</td>
              <td>
                배송지로
                <br />
                상품 배송 완료
              </td>
              <td className="refundDelivery-red">환불 요청</td>
              <td>
                <dt>마이페이지에서 [환불 요청]버튼 클릭시 환불요청 완료</dt>
                <dd>구매자가 AppleFarm으로 상품 배송</dd>
                <dd>당사가 상품 품질 확인 후 규정에 따라 환불요청 처리</dd>
              </td>
            </tr>

            <tr>
              <td>구매 확정</td>
              <td>
                구매자가
                <br />
                구매 확정
              </td>
              <td>-</td>
              <td>
                <dt>환불 요청 불가</dt>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundDelivery;
