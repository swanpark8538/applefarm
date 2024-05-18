package kr.or.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardComment;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.util.PageInfo;

@Mapper
public interface BoardDao {
	int totalCount();
	List selectBoardList(PageInfo pi);
	int selectCount();
	int insertBoard(Board board);
	int insertBoardFile(BoardFile bf);
	Board selectOneBoard(int boardNo);
	List selectOneBoardFileList(int boardNo);
	int deleteBoard(int boardNo);
	BoardFile selectOneBoardFile(int fileNo);
	List<BoardFile> selectBoardFile(int[] delFileNo);
	int deleteBoardFile(int[] delFileNo);
	int updateBoard(Board board);
	int updateReadCount(int boardNo);
	int insertComment(BoardComment boardComment);
	List selectCommentList(int boardNo);
	int deleteComment(int commentNo);
	List selectSearchBoardList(String selectedValue, String selectedKeyword, PageInfo pi);
	int totalSearchCount(String selectedValue, String selectedKeyword);
	int totalBoardCount();
	List selectTotalBoardList(PageInfo pi);


}
