import { useNavigate } from "react-router-dom";

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  const boardView = () => {
    navigate("/board/view/" + board.boardNo);
  };
  return (
    <tr>
      <td>{board.boardNo}</td>
      <td onClick={boardView}>
        {board.boardTitle}
        {/* {board.boardThumbnai === null ? (
          <img src="/image/default.png" />
        ) : (
          <img src={backServer + "/board/thumbnail/" + board.boardThumbnail} />
        )} */}
      </td>
      <td>{board.memberNickName}</td>
      <td>{board.boardDate}</td>
      <td>{board.readCount}</td>
    </tr>
  );
};

export default BoardItem;
