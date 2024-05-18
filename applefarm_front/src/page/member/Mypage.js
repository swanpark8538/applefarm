import { useEffect, useState } from "react";
import "./member.css";
import SideMenu from "../../component/SideMenu";
import { Route, Routes, useNavigate } from "react-router-dom";
import Address from "./Address";
import MemberWish from "./MemberWish";
import MemberInfo from "./MemberInfo";

import Swal from "sweetalert2";

import axios from "axios";
import DeleteMember from "./DeleteMember";

import SellerGrade from "./SellerGrade";
import MemberAccountNumber from "./MemberAccountNumber";

import { DetailOrder, DetailSales } from "./DetailOrder";
import PurchaseHistory from "./PurchaseHistory";
import SalesHistory from "./SalesHistory";
import WritingHistory from "./WritingHistory";
import RefundHistory from "./RefundHistory";
import SalesProductDetails from "./SalesProductDetails";

//로그인 정보 가져오기
const Mypage = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const logout = props.logout;

  const navigate = useNavigate();
  if (!isLogin) {
    Swal.fire("로그인 후 이용 가능합니다.")
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  }
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

  const [myInfoMenu, setMyInfoMenu] = useState([
    { url: "loginInfo", text: "로그인 정보", active: false },
    { url: "sellerGrade", text: "판매자 등급", active: false },
    { url: "memberAccountNumber", text: "판매 정산 계좌", active: false },
    { url: "address", text: "주소록", active: false },
    //{ url: "viewMyPost", text: "내가 쓴 글", active: false },
  ]);

  const [myShoppingMenu, setMyShoppingMenu] = useState([
    { url: "purchaseHistory", text: "구매내역", active: false },
    { url: "salesHistory", text: "판매내역", active: false },
    { url: "refundHistory", text: "환불내역", active: false },
    { url: "wish", text: "좋아요", active: false },
  ]);

  return (
    <div className="mypage-wrap">
      <div className="mypage-sideMenu">
        <div className="sideMenu-title">내 정보</div>
        <SideMenu
          menuItems={myInfoMenu}
          setMenuItems={setMyInfoMenu}
          type="mypage"
        />
        <div className="sideMenu-title">쇼핑 정보</div>
        <SideMenu
          menuItems={myShoppingMenu}
          setMenuItems={setMyShoppingMenu}
          type="mypage"
        />
      </div>
      <div className="mypage-content">
        <Routes>
          <Route
            path="/loginInfo"
            element={
              <MemberInfo
                member={member}
                setMember={setMember}
                logout={logout}
              />
            }
          />
          <Route
            path="/deleteMember"
            element={
              <DeleteMember
                member={member}
                setMember={setMember}
                logout={logout}
              />
            }
          />
          <Route
            path="/sellerGrade"
            element={<SellerGrade member={member} setMember={setMember} />}
          />
          <Route
            path="/memberAccountNumber"
            element={
              <MemberAccountNumber member={member} setMember={setMember} />
            }
          />
          <Route path="/address" element={<Address />}></Route>
          <Route path="/wish" element={<MemberWish />}></Route>
          <Route path="/detailOrder/:productNo" element={<DetailOrder />} />
          <Route path="/purchaseHistory" element={<PurchaseHistory />} />
          <Route path="/detailSales/:productNo" element={<DetailSales />} />
          <Route
            path="/salesHistory"
            element={<SalesHistory member={member} setMember={setMember} />}
          />
          <Route
            path="/viewMyPost"
            element={<WritingHistory member={member} setMember={setMember} />}
          />

          <Route
            path="/refundHistory"
            element={<RefundHistory member={member} setMember={setMember} />}
          />
          <Route
            path="/salesProductDetails/:productNo"
            element={
              <SalesProductDetails member={member} setMember={setMember} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Mypage;
