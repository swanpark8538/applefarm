package kr.or.iei.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value = "like")
@Schema(description = "좋아요 객체")
public class Like {
	@Schema(description = "좋아요 번호",type="number")
	private int likeNo;
	@Schema(description = "회원 번호",type="number")
	private int memberNo;
	@Schema(description = "상품 번호",type="number")
	private int productNo;
	@Schema(description = "판매자 회원 번호",type="number")
	private int sellerNo;
	@Schema(description = "상품 요약 정보",type="number")
	private String productSummary;
	@Schema(description = "상품 등급",type="number")
	private String ProductQuality;
	@Schema(description = "상품 사진",type="number")
	private String productThumbnail;
	@Schema(description = "상품 제목",type="number")
	private String productTitle;
	@Schema(description = "판매자 닉네임",type="string")
	private String memberNickName;
	@Schema(description = "상품 가격",type="number")
	private int productPrice;
	@Schema(description = "거래 유무",type="number")
	private int trade;
}
