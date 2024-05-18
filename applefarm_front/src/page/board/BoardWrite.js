import { useState } from "react";
import BoardFrm from "./BoardFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
const BoardWrite = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  //제목, 썸네일, 내용, 첨부파일 -> 글 작성을 위해서 사용자에게 받아야 하는 정보 -> state 생성(데이터 전송용)
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [boardType, setBoardType] = useState(2);
  const [productCategory, setProductCategory] = useState(null);
  const [boardFile, setBoardFile] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  //사용자 화면 출력용 state (화면전송시 사용하지 않음)
  const [fileList, setFileList] = useState([]); //화면출력용 애들이 변수명이랑 같음
  const [boardThumbnail, setBoardThumbnail] = useState(null); //썸네일 미리보기
  const navigate = useNavigate();
  const [member, setMember] = useState({});
  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          console.log(res.data.data);
          setMember(res.data.data);
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, []);
  const write = () => {
    console.log("제목: ", boardTitle); //필수
    console.log("내용: ", boardContent); //필수
    console.log("게시판유형: ", boardType);
    console.log("상품타입: ", productCategory);
    console.log("첨부파일: ", boardFile);
    console.log("썸네일: ", thumbnail);

    if (boardTitle != "" && boardContent != "") {
      //전송용 form 객체 생성
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardContent", boardContent);
      form.append("boardType", boardType);
      form.append("productCategory", productCategory);
      form.append("memberNo", member.memberNo);
      //첨부파일도 첨부한 갯수만큼 반복해서 추가
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      //썸네일은 첨부한 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }

      axios
        .post(backServer + "/board", form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            navigate("/board/list");
          } else {
            Swal.fire({
              icon: "error",
              title: "게시글 작성 실패",
              text: res.data.message,
              confirmButtonText: "확인",
            });
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };

  return (
    <div className="board-write-wrap">
      <div className="board-frm-title">게시글 작성</div>
      <BoardFrm
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardContent={boardContent}
        setBoardContent={setBoardContent}
        boardType={boardType}
        setBoardType={setBoardType}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        fileList={fileList}
        setFileList={setFileList}
        boardThumbnail={boardThumbnail}
        setBoardThumbnail={setBoardThumbnail}
        buttonFunction={write}
        type="write"
      />
    </div>
  );
};

export default BoardWrite;
