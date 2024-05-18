package kr.or.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="boardComment")
@Schema(description = "게시판 댓글 객체")
public class BoardComment {
	//COMMENT_TBL
	private int commentNo; 			//댓글 번호 : sequence   						
	private int boardNo;			//해당 댓글의 게시물 번호 : 외래키(board_tbl)		!!check
	private int commentWriter;	    	//댓글 작성자 : 로그인 사용자 					!!check
	private String commentContent;  //댓글 내용									!!check
	private int selfRef;			//대댓글 참조 번호					!!check
	private String commentHide;		//댓글 숨김 상태(0:공개, 1:비공개)				
	private String commentDate;		//댓글 작성일 : sysdate
	
	//닉네임
	private String memberNickName;  //회원 닉네임(Join 후 사용)
	private String memberId;
}
