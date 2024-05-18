package kr.or.iei.admin.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="chatroom")
public class ChatRoom {
	
	private int roomNo;
	private String roomTitle;
	private String participant1;
	private String participant2;
	private String roomCreateTime;
	
}
