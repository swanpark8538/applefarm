import React from "react";
import BoardItem from "./BoardItem";
import Pagination from "../../component/Pagination";
import { Button } from "../../component/FormFrm";
import { useNavigate } from "react-router-dom";
const BoardTable = ({
  boardList,
  pageInfo,
  reqPage,
  setReqPage,
  isSearchResult,
}) => {
  const navigate = useNavigate();

  const backList = () => {
    navigate("/board/list");
  };

  return (
    <div>
      <div className="board-tbl-box">
        <table>
          <thead>
            <tr>
              <th width="15%">번호</th>
              <th width="35%">제목</th>
              <th width="20%">닉네임</th>
              <th width="20%">작성일</th>
              <th width="10%">조회수</th>
            </tr>
          </thead>
          <tbody>
            {isSearchResult && boardList.length === 0 ? (
              <tr>
                <td colSpan="5">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              boardList.map((board, index) => (
                <BoardItem key={"board" + index} board={board} />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="board-page">
        {isSearchResult && boardList.length === 0 ? (
          //  (<Button clickEvent={backList} text="목록" />)
          ""
        ) : (
          <Pagination
            pageInfo={pageInfo}
            reqPage={reqPage}
            setReqPage={setReqPage}
          />
        )}
      </div>
    </div>
  );
};

export default BoardTable;
