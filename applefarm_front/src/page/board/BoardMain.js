import "./board.css";
import { Route, Routes } from "react-router-dom";
import BoardList from "./BoardList";
import SideMenu from "../../component/SideMenu";
import BoardWrite from "./BoardWrite";
import BoardView from "./BoardView";
import BoardModify from "./BoardModify";

const BoardMain = (props) => {
  const isLogin = props.isLogin;
  return (
    <div className="inner-section-wrap">
      <Routes>
        <Route path="/list" element={<BoardList isLogin={isLogin} />} />
        <Route path="/write" element={<BoardWrite isLogin={isLogin} />} />
        <Route
          path="/view/:boardNo"
          element={<BoardView isLogin={isLogin} />}
        />
        <Route
          path="/modify/:boardNo"
          element={<BoardModify isLogin={isLogin} />}
        />
      </Routes>
    </div>
  );
};

export default BoardMain;
