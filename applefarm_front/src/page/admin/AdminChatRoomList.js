import { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import "./admin.css";
import AdminChatModal from "./AdminChatModal";

const AdminChatRoomList = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const chatModalBackGround = useRef();
  const setModalOpen = props.setModalOpen;
  const [chatRooms, setChatRooms] = useState([]); //채팅방 목록 저장할 상태 변수
  const [selectedRoom, setSelectedRoom] = useState(null); // 선택된 채팅방 정보를 저장할 상태 변수
  const [member, setMember] = useState();
  const imgSrc = process.env.PUBLIC_URL + "/image/apple.png";

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          console.log(res.data.data);
          setMember(res.data.data);

          // 멤버 정보를 가져온 후에 채팅방 목록을 가져옴
          axios
            .get(backServer + "/admin/chatRoomList/" + res.data.data.memberId)
            .then((res) => {
              console.log("채팅방 목록 조회 결과: ", res.data.data);
              setChatRooms(res.data.data);
            })
            .catch((res) => {
              console.log(res.data);
            });
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, []);

  //모달밖 클릭시
  const modalBack = (e) => {
    if (e.target === chatModalBackGround.current) {
      setModalOpen(false);
    }
  };
  // 채팅방 선택 시 실행
  const handleChatRoomClick = (room) => {
    setSelectedRoom(room); // 선택된 채팅방 정보 설정
    setModalOpen(true); // 모달 열기
  };

  return (
    <div
      className="chat-modal-current-wrap"
      onClick={modalBack}
      ref={chatModalBackGround}
    >
      <div className="chat-modal-content">
        {/* 채팅창 헤더 */}
        <div className="chat-header">
          <div className="chat-list">채팅</div>
        </div>
        {/* 채팅방 목록 출력 */}
        <div className="chat-room-list">
          <ul className="chat-list-ul">
            {chatRooms.map((room, index) => (
              <li
                key={"room" + index}
                className="chat-list-li"
                onClick={() => handleChatRoomClick(room)}
              >
                <div className="chat-list-div">
                  <div className="chat-list-body">
                    <img src={imgSrc} />
                    <div className="chat-title-content">
                      <p className="chat-list-title">{room.roomTitle}</p>
                      <p className="chat-list-content">내용</p>
                    </div>
                  </div>
                  <span className="chat-list-time">{room.roomCreateTime}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* 선택된 채팅방에 대한 모달 열기 */}
        {selectedRoom && (
          <AdminChatModal
            setChatOpen={setModalOpen}
            member={member}
            room={selectedRoom}
          />
        )}
      </div>
    </div>
  );
};

export default AdminChatRoomList;
