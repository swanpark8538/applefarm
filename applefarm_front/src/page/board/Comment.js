import "./board.css";
import React from "react";
import { Button1, Textarea } from "../../component/FormFrm";
import axios from "axios";

const Comment = (props) => {
  const boardNo = props.boardNo;
  const commentContent = props.commentContent;
  const setCommentContent = props.setCommentContent;
  const commentList = props.commentList;
  const setCommentList = props.setCommentList;
  const memberNo = props.memberNo;
  const selfRef = props.selfRef;
  const setSelfRef = props.setSelfRef;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const insertComment = () => {
    const obj = {
      boardNo: boardNo,
      commentWriter: memberNo,
      commentContent: commentContent,
      selfRef: selfRef,
    };
    axios
      .post(backServer + "/board/comment", obj)
      .then((res) => {
        axios
          .get(backServer + "/board/one/" + boardNo)
          .then((res) => {
            console.log("재조회", res.data);
            setCommentList(res.data.data.commentList);
            setCommentContent("");
          })
          .catch((res) => {
            console.log(res);
          });
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="comment-box">
      <div className="comment-content">
        <Textarea content={commentContent} setContent={setCommentContent} />
      </div>
      <div className="write-comment-btn">
        <Button1 text="등록" clickEvent={insertComment} />
      </div>
    </div>
  );
};

export default Comment;
