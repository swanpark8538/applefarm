import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-content1">
          <Link to="#">이용약관</Link>
          <Link to="#">개인정보취급</Link>
          <Link to="/ref">인재채용</Link>
          <Link to="#">제휴문의</Link>
          <div className="footer-content-wrap">
            <div className="footer-content2">
              <div>AppleFarm 주식회사 · 대표: 박성완</div>
              <div>사업자등록번호 : 491-64-00661</div>
              <div>통신판매업: 제 2021-성남분당C-0093호</div>
              <div>사업장소재지: 서울특별시 영등포구 선유동2로 사랑빌딩</div>
            </div>
            <div className="footer-last-text">
              AppleFarm(주)는 통신판매 중개자로서 통신판매의 당사자가 아닙니다.
              본 상품은 개별판매자가 등록한 상품으로 상품, 상품정보, 거래에 관한
              의무와 책임은 각 판매자에게 있습니다. 단, 이용약관 및 정책, 기타
              거래 체결 과정에서 고지하는 내용 등에 따라 검수하고 보증하는
              내용에 대한 책임은 AppleFarm(주)에 있습니다.
            </div>
          </div>
        </div>
        <div className="footer-wrap">
          <div className="footer-wrap2">
            <div className="icon-box">
              <Link to="#">
                <img className="insta-img" src="../image/insta.png" />
              </Link>
              <Link to="#">
                <img className="facebook-img" src="../image/facebook.png" />
              </Link>
              <Link to="#">
                <img className="youtube-img" src="../image/youtube.png" />
              </Link>
            </div>
            <div>
              <div>고객센터 1588-8282</div>
              <div>운영시간 평일 10:00 ~ 18:00 (토,일 공휴일 휴무)</div>
              <div>점심시간 평일 13:00 ~ 14:00 </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
