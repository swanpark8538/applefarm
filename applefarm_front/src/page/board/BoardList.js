import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardTable from "./BoardTable";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Button1 } from "../../component/FormFrm";

const BoardList = (props) => {
  const isLogin = props.isLogin; // 임시로 true로 설정
  const [boardList, setBoardList] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedValue, setSelectedValue] = useState("1");
  const [member, setMember] = useState({});
  const [memberGrade, setMemberGrade] = useState();

  const navigate = useNavigate();
  const writeBtn = () => {
    navigate("/board/write");
  };

  const options = [
    { value: "1", label: "전체" },
    { value: "2", label: "제목" },
    { value: "3", label: "내용" },
  ];

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          console.log(res.data.data);
          setMember(res.data.data);
          setMemberGrade(res.data.data.memberGrade);
        })
        .catch((res) => {
          console.log(res);
        });
    }

    fetchBoardList(reqPage);
  }, [reqPage]);

  const fetchBoardList = (page) => {
    let url = backServer + "/board/list/" + page;

    if (selectedKeyword) {
      url =
        backServer +
        "/board/searchList/" +
        selectedValue +
        "/" +
        selectedKeyword +
        "/" +
        page;
    }

    axios
      .get(url)
      .then((res) => {
        setBoardList(res.data.data.boardList);
        setTotalPostCount(res.data.data.totalPostCount);
        setPageInfo(res.data.data.pi);
        setIsSearchResult(!!selectedKeyword); // 검색어가 있으면 true, 없으면 false
        setSelectedKeyword("");
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching board list:", error);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log("Basicselect:", event.target.value);
  };

  const searchBtn = () => {
    if (selectedKeyword === "") {
      alert("검색어를 입력하세요");
      return;
    }
    setReqPage(1); // 검색 시 첫 페이지로 이동
    fetchBoardList(1);
  };

  return (
    <div className="board-wrap">
      <div className="board-title">
        <p>공지사항</p>
      </div>
      {isLogin && (
        <div className="board-subtitle">
          <span className="totalPostCount">총 {totalPostCount} 개의 글</span>
          {memberGrade !== 2 ? (
            " "
          ) : (
            <Button text="글쓰기" addId="writeBtn" clickEvent={writeBtn} />
          )}
        </div>
      )}
      <BoardTable
        boardList={boardList}
        pageInfo={pageInfo}
        reqPage={reqPage}
        setReqPage={setReqPage}
        isSearchResult={isSearchResult}
      />
      <div className="search_board">
        <Select changeEvent={handleSelectChange} options={options} />
        <Input
          id="search_input"
          type="text"
          data={selectedKeyword}
          setData={setSelectedKeyword}
          onKeyDown={searchBtn}
        />
        <Button1 text="검색" clickEvent={searchBtn} />
      </div>
    </div>
  );
};

export default BoardList;
