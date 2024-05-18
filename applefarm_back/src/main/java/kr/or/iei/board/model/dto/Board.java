package kr.or.iei.board.model.dto;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
@Schema(description = "게시판 객체")
public class Board {
	
	//BOARD_TBL
	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private String memberNickName;
	private int memberNo;
	private String memberId;
	private int readCount;
	private int boardType;
	private String productCategory;
	private String boardHide;
	private String boardDate;
	private String boardThumbnail;
	private List fileList; //첨부파일
	
	
	//수정, 삭제
	private int[] delFileNo;
	private int thumbnailCheck;
}
