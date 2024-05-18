package kr.or.iei.admin.model.service;

import java.util.HashMap;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.or.iei.admin.model.dto.ChatMessage;

@Component
public class AllMemberChatHandler extends TextWebSocketHandler {

	// 멤버 닉네임에 세션정보 묶기 = 웹소켓에 접속회원정보 저장 map
	private HashMap<WebSocketSession, String> members;
	// 생성자에서 Map 객체 생성
	public AllMemberChatHandler() {
		super();
		members = new HashMap<WebSocketSession, String>();
	}

	
/*------------ 클라이언트가 웹소켓에 접속하면 호출되는 메소드 ------------*/
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 세션에서 사용자 ID 추출
//        String memberId = extractMemberIdFromSession(session);
//        // 사용자 추가
//        members.put(session, memberId);
//        // 채팅방에 입장 메시지 전송
//        sendEnterMessage(memberId);
	}

	
/*------------ 클라이언트가 데이터를 전송하면 해당 데이터를 수신하는 메소드 ------------*/
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
			
		
		// 프론트(object->json문자열 변환) -> 현재 백(json문자열 ->Json 객체변환)
		ObjectMapper om = new ObjectMapper();
		ChatMessage cm = om.readValue(message.getPayload(), ChatMessage.class); // json 형태 변환 완료
		
		//보낸이, 보낸 메시지 타입 확인
		Object obj = new String(cm.getMemberId());
		if(obj instanceof String) {
			System.out.println("스트링 타입");
		}else {
			System.out.println("스트링 아님!!!");
		}
		
		System.out.println("보낸이: " + cm.getMemberId());
		System.out.println("메시지  : " + cm.getMessage());
		System.out.println("방번호 : " + cm.getRoomNo());
		
		
		
		if (cm.getType().equals("enter")) {
			// 최초 접속하면 들어오는 type=enter -> members저장
			members.put(session, cm.getMemberId());
			
			// 입장메시지 전달
			ChatMessage sendData = new ChatMessage();
			// 아래 코드는 이사람 들어왔어 정보 싹 세팅
			sendData.setType("enter");
			sendData.setMemberId(members.get(session));
			sendData.setMessage("");
			String sendDataStr = om.writeValueAsString(sendData);
			for (WebSocketSession ws : members.keySet()) {
				ws.sendMessage(new TextMessage(sendDataStr));
			}

		} else if (cm.getType().equals("chat")) {
			// 채팅 메시지를 보낸 경우 -> 클라이언트에 메시지 전달
			ChatMessage sendData = new ChatMessage();
			sendData.setType("chat"); // 응답데이터 형식 지정
			sendData.setMemberId(members.get(session)); // 메시지 보낸사람 아이디 세팅
			sendData.setMessage(cm.getMessage());
			String sendDataStr = om.writeValueAsString(sendData); // 객체를 문자열로 변경

			// 키들을 모아주는 key
			Set<WebSocketSession> keys = members.keySet(); // members map의 모든 키를 set형태로 반환
			for (WebSocketSession ws : keys) {
				ws.sendMessage(new TextMessage(sendDataStr));
				// 객체로 데이터 묶은 다음 문자열로 변환한 다음 전송.
			}
		}
	}

	
	
	
	
	
	
/*------------ 클라이언트가 접속을 끊으면 자동으로 호출되는 메소드 ------------*/
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("클라 나감");
		ObjectMapper om = new ObjectMapper();
		ChatMessage sendData = new ChatMessage();
		sendData.setType("out");
		sendData.setMemberId(members.get(session));
		sendData.setMessage("");
		String sendDataStr = om.writeValueAsString(sendData);
		members.remove(session);
		for (WebSocketSession ws : members.keySet()) {
			ws.sendMessage(new TextMessage(sendDataStr));
		}
	}

}
