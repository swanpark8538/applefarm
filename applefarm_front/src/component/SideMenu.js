import { Link, useLocation } from "react-router-dom";
import "./sideMenu.css";

const SideMenu = (props) => {
  const menuItems = props.menuItems;
  const setMenuItems = props.setMenuItems;
  const type = props.type;
  const location = useLocation();
  return (
    <div className="sideMenu">
      <ul>
        {menuItems.map((item, index) => {
          //현재 주소와 메뉴 아이템의 URL을 비교 (location.pathname === 현재 로케이션)
          const isActive = location.pathname === `/${type}/${item.url}`; //ex) type이 mypage -> /mypage/memberInfo
          return (
            <li key={index}>
              <Link
                to={`/${type}/${item.url}`}
                className={isActive ? "active-side" : ""}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
