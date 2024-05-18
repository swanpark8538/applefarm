package kr.or.iei.member.model.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
@Schema(description = "회원 정보 객체")
public class Member {
	
	@Schema(description = "회원 번호", type="number")
	private int memberNo;
	
	@Schema(description = "회원 이름" ,  type="string")
	private String memberName;
	
	@Schema(description = "회원 닉네임" , type="string")
	private String memberNickName; 
	
	@Schema(description = "회원 아이디" ,  type="string")
	private String memberId;
	
	@Schema(description = "회원 비밀번호" ,  type="string")
	private String memberPw;
	
	@Schema(description = "회원 이메일" ,  type="string")
	private String memberEmail;
	
	@Schema(description = "회원 전화번호" ,  type="string")
	private String memberPhone;

	@Schema(description = "회원 등급" ,  type="number")
	private int memberGrade;
	
	@Schema(description = "회원 계좌" , type="string")
	private String memberAccountnumber;
	
	@Schema(description = "가입일", type="string")
	private String enrollDate; 
	
	@Schema(description = "판매자 점수" , type="number")
	private int sellerScore;
	
	@Schema(description = "판매자 등급", type="number")
	private int sellerGrade;
	
	@Schema(description = "탈퇴한 회원 여부", type="string")
	private String memberWithdraw;
	
	@Schema(description = "은행명", type="string")
	private String bankName;
	
	@Schema(description = "예금주명", type="string")
	private String depositorName;
	
	@Schema(description = "멤버 블랙 타임", type="String")
	private String memberBlackTime;
}	




