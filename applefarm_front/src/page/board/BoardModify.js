import { useState } from "react";
import { useParams } from "react-router-dom";
import BoardFrm from "./BoardFrm";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BoardModify = (props) => {
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const boardNo = params.boardNo;
  //제목, 썸네일, 내용, 첨부파일 -> 데이터 담을 state 생성 -> 데이터 전송용
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); //추가 썸네일
  const [boardFile, setBoardFile] = useState([]); //추가 파일
  //사용자 화면 출력용 state (화면전송시 사용하지 않음)
  const [fileList, setFileList] = useState([]); //화면출력용 애들이 변수명이랑 같음
  const [boardThumbnail, setBoardThumbnail] = useState(null); //썸네일 미리보기

  //삭제 파일 번호를 저장할 배열
  const [delFileNo, setDelFileNo] = useState([]); //기존 첨부파일을 삭제하면 파일번호를 저장해서 전달할 state

  //썸네일 수정 체크용
  const [thumbnailCheck, setThumbnailCheck] = useState(0); //썸네일 수정 체크용
  const [oldThumbnail, setOldThumbnail] = useState(null);

  const navigate = useNavigate();
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
        })
        .catch((res) => {
          console.log(res);
        });
    }

    axios
      .get(backServer + "/board/selectModifyOneBoard/" + boardNo)
      .then((res) => {
        const board = res.data.data;
        setBoardTitle(board.boardTitle);
        setBoardContent(board.boardContent);
        setBoardThumbnail(board.boardThumbnail); //화면띄어줄 용도
        setFileList(board.fileList);
        setOldThumbnail(board.boardThumbnail); //데이터 처리용
      });
  }, []);
  const modify = () => {
    console.log("boardTitle : " + boardTitle);
    console.log("boardContent : " + boardContent);
    console.log("thumbnail : " + thumbnail);
    console.log("boardFile : " + boardFile);
    console.log("oldThumbnail : " + oldThumbnail);
    console.log("thumbnailCheck : " + thumbnailCheck);
    console.log("delFileNo : " + delFileNo);

    const form = new FormData();
    form.append("boardNo", boardNo);
    form.append("boardTitle", boardTitle);
    form.append("boardContent", boardContent);
    form.append("thumbnailCheck", thumbnailCheck);
    form.append("boardImg", oldThumbnail); //기존썸네일을 boardImg변수에 저장 -> 썸네일이 변경되지않으면 기존값으로 업데이트
    //썸네일 수정하면 추가
    if (thumbnail !== null) {
      form.append("thumbnail", thumbnail);
    }
    //첨부파일이 추가되면 전송
    for (let i = 0; i < boardFile.length; i++) {
      form.append("boardFile", boardFile[i]);
    }
    //삭제한 파일번호 배열 전송
    for (let i = 0; i < delFileNo.length; i++) {
      form.append("delFileNo", delFileNo[i]);
    }
    axios
      .patch(backServer + "/board", form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          navigate("/board/view/" + boardNo);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div className="board-modify-wrap">
      <div className="board-frm-title">게시글 수정</div>
      <BoardFrm
        boardNo={boardNo}
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardContent={boardContent}
        setBoardContent={setBoardContent}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        boardThumbnail={boardThumbnail}
        setBoardThumbnail={setBoardThumbnail}
        fileList={fileList}
        setFileList={setFileList}
        buttonFunction={modify}
        type="modify"
        delFileNo={delFileNo}
        setDelFileNo={setDelFileNo}
        thumbnailCheck={thumbnailCheck}
        setThumbnailCheck={setThumbnailCheck}
      />
    </div>
  );
};

export default BoardModify;
