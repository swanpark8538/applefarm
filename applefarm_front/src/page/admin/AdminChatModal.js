import { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminChatModal = (props) => {
  const member = props.memberInfo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");
  const [ws, sewWs] = useState({});
  useEffect(() => {
    const socket = new WebSocket(socketServer + "/allChat");
    sewWs(socket);

    return () => {
      console.log("채팅페이지에서 나감");
      socket.close();
    };
  }, []);

  //웹소켓 연결이 완료되면 실행할 함수
  const startChat = () => {
    //json 형태로 아이디 전송 (세션<->닉네임 연결위함)
    const data = {
      type: "enter",
      memberId: member.memberId,
    };
    ws.send(JSON.stringify(data));
  };

  //서버에서 데이터를 받으면 실행되는 함수
  const receiveMsg = (receiveData) => {
    const receiveStr = receiveData.data;
    //문자열을 다시 객체로 변환
    const chat = JSON.parse(receiveStr);
    console.log("받은 데이터", receiveStr);
    setChatList([...chatList, chat]);
  };

  //웹소켓 연결이 종료되면 실행할 함수
  const endChat = () => {};

  //웹소켓 객체에 각 함수를 연결
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;

  const [chatList, setChatList] = useState([]); //채팅목록
  const [chatMessage, setChatMessage] = useState(""); //전송 메시지
  const [btnStatus, setBtnStatus] = useState(true);

  const inputChatMessage = (e) => {
    const checkValue = e.target.value.replaceAll("\n", "");
    if (chatMessage === "" && checkValue === "") {
      setBtnStatus(true);
      return;
    }
    setChatMessage(e.target.value);
    setBtnStatus(false);
  };

  const sendMessage = () => {
    const data = {
      type: "chat",
      memberId: member.memberId,
      message: chatMessage,
    };
    console.log("보낸메시지: ", JSON.stringify(data));
    ws.send(JSON.stringify(data));
    setChatMessage("");
    setBtnStatus(true);
  };

  const inputKeyboard = (e) => {
    if (e.keyCode === 13 && !e.shiftKey && chatMessage !== "") {
      sendMessage();
    }
  };
  const chatAreaRef = useRef(null);
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <div className="chat-modal-current-wrap">
      {member.memberId ? (
        <div className="chat-modal-content">
          <div className="chat-header">
            <div className="roomTitle">실시간 문의</div>
          </div>

          <div className="chat-body">
            <div className="chat-message-area" ref={chatAreaRef}>
              {chatList.map((chat, index) => {
                return (
                  <ChattingMessage
                    key={"chat-message" + index}
                    chat={chat}
                    memberId={member.memberId}
                  />
                );
              })}
            </div>
          </div>

          <div className="chat-footer">
            <textarea
              className="chat-message"
              placeholder="메시지를 입력해주세요."
              value={chatMessage}
              onChange={inputChatMessage}
              onKeyUp={inputKeyboard}
            ></textarea>
            <button
              className="sendMessage"
              disabled={btnStatus}
              onClick={() => sendMessage()}
            >
              전송
            </button>
          </div>
        </div>
      ) : (
        <h3 className="one-div">
          거센 코드 파도 속 컴포넌트를 넘나들며, 최고의 개발자가 되리라 -
          <span>로그인 후 이용하시게, 취소버튼은 없으니 새로고침하시게</span>
        </h3>
      )}
    </div>
  );
};

const ChattingMessage = (props) => {
  const chat = props.chat;
  const memberId = props.memberId;

  return (
    <>
      {chat.type === "enter" ? (
        <p className="info">
          <span>{chat.memberId} 님이 입장하셨습니다.</span>
        </p>
      ) : chat.type === "out" ? (
        <p className="info">
          <span>{chat.memberId} 님이 나가셨습니다.</span>
        </p>
      ) : (
        <div
          className={chat.memberId === memberId ? "chat right" : "chat left"}
        >
          <div className="user">
            <span className="material-icons">account_circle</span>
            <span className="name">{chat.memberId}</span>
          </div>
          <div className="chatting-message">{chat.message}</div>
        </div>
      )}
    </>
  );
};

export default AdminChatModal;
