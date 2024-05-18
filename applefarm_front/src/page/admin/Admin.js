import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"; // useNavigate를 import합니다.
import Swal from "sweetalert2";

import SideMenu from "../../component/SideMenu";
import AdminDashboard from "./AdminDashboard";
import AdminMember from "./AdminMember";
import AdminProduct from "./AdminProduct";
import AdminRefund from "./AdminRefund";
import AdminReport from "./AdminReport";
import AdminChatRoomList from "./AdminChatRoomList";
import axios from "axios";

const AdminMain = (props) => {
  const navigate = useNavigate(); // navigate 함수를 가져옵니다.
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;

  if (!isLogin) {
    Swal.fire("로그인 후 이용 가능합니다.")
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  }
  const [adminMenu, setAdminMenu] = useState([
    { url: "dashboard", text: "대시보드", active: false },
    { url: "manageMember", text: "회원관리", active: false },
    { url: "manageProduct", text: "상품관리", active: false },
    { url: "manageRefund", text: "환불관리", active: false },
    { url: "manageReport", text: "신고관리", active: false },
  ]);

  const [member, setMember] = useState({});
  const [memberGrade, setMemberGrade] = useState();

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          console.log(res.data.data);
          setMember(res.data.data);
          setMemberGrade(res.data.data.memberGrade);

          if (res.data.data.memberGrade !== 2) {
            Swal.fire("관리자가 아니면 물러가라").then(() => {
              navigate("/");
            });
          }
        })

        .catch((res) => {
          console.log(res);
        });
    } else {
      Swal.fire("로그인 후 이용 가능합니다.").then(() => {
        navigate("/"); // navigate 함수를 사용합니다.
      });
    }
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="admin-wrap">
      <div className="admin-sideMenu">
        <div className="admin-title">관리자 메뉴</div>
        <div className="sideMenu-wrap">
          <SideMenu
            menuItems={adminMenu}
            setMenuItems={setAdminMenu}
            type="admin"
          />
        </div>
      </div>
      <div className="admin-section-wrap">
        <Routes>
          <Route
            path="/dashboard"
            element={<AdminDashboard isLogin={isLogin} />}
          />
          <Route path="/manageMember" element={<AdminMember />} />
          <Route path="/manageProduct" element={<AdminProduct />} />
          <Route path="/manageRefund" element={<AdminRefund />} />
          <Route path="/manageReport" element={<AdminReport />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminMain;
