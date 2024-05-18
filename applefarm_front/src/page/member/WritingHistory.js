import axios from "axios";
import { useEffect, useState } from "react";

const WritingHistory = (props) => {
  //자유게시판(댓글있음), 1대1문의 게시판(댓글없음)

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const member = props.member;
  const memberNo = member.memberNo;
  const [board, setBoard] = useState([]);

  //자유게시판

  useEffect(() => {
    axios
      .get(backServer + "/member/getBoardInfo/" + memberNo)
      .then((res) => {
        if (res.data.message === "success") {
          setBoard(res.data.data);
          console.log(board);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [memberNo, backServer]);

  //자유게시판 댓글

  return (
    <>
      <div>내가 쓴 글</div>
      <TabMenu />
      <div>
        {board.length > 0 ? (
          <ul>
            {board.map((post, index) => (
              <li key={index}>{post.boardTitle}</li>
            ))}
          </ul>
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </>
  );
};

const MyPost = () => {
  return <div>게시물</div>;
};
const MyComment = () => {
  return <div>댓글</div>;
};

const TabMenu = () => {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    { name: "Tab1", content: "Tab menu ONE" },
    { name: "Tab2", content: "Tab menu TWO" },
  ];

  const selectMenuHandler = (index) => {
    // parameter로 현재 선택한 인덱스 값을 전달해야 하며, 이벤트 객체(event)는 쓰지 않는다
    // 해당 함수가 실행되면 현재 선택된 Tab Menu 가 갱신.
    clickTab(index);
  };
  return (
    <>
      <div>
        <TabMenu>
          // 아래 하드코딩된 내용 대신에, map을 이용한 반복으로 코드를 수정 //
          li 엘리먼트의 class명의 경우 선택된 tab 은 'submenu focused', 나머지
          2개의 tab은 'submenu'
          {/* <li className="submenu">{menuArr[0].name}</li>
          <li className="submenu">{menuArr[1].name}</li>
          <li className="submenu">{menuArr[2].name}</li> */}
          {menuArr.map((el, index) => (
            <li
              className={index === currentTab ? "submenu focused" : "submenu"}
              onClick={() => selectMenuHandler(index)}
            >
              {el.name}
            </li>
          ))}
        </TabMenu>
        <div>
          <p>{menuArr[currentTab].content}</p>
        </div>
      </div>
    </>
  );
};

export default WritingHistory;
