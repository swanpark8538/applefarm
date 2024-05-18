package kr.or.iei.trade.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "trade")
@Schema(description = "거래 객체")
public class Trade {
	@Schema(description = "거래 번호",type="number")
	private int tradeNo;
	@Schema(description = "판매자 회원 번호",type="number")
	private int tradeSeller;
	@Schema(description = "구매자 회원 번호",type="number")
	private int tradeBuyer;
	@Schema(description = "상품 번호",type="number")
	private int productNo;
	@Schema(description = "거래 예약일",type="String")
	private String tradeReserveDate;
	@Schema(description = "거래 채결일",type="String")
	private String tradeDate;
	@Schema(description = "거래 금액", type = "number")
	private int tradePrice;
	@Schema(description = "거래 상태",type="String")
	private String tradeState;
	@Schema(description = "배송지 우편번호",type="String")
	private String zipcode;
	@Schema(description = "배송지 주소",type="String")
	private String address;
	@Schema(description = "배송지 상세주소",type="String")
	private String addressDetail;
	@Schema(description = "배송받는사람 이름",type="String")
	private String addressName;
	@Schema(description = "배송받는사람 전화번호",type="String")
	private String addressPhone;
	@Schema(description = "배송 요청사항",type="String")
	private String addressRequest;
	@Schema(description = "배송 송장번호",type="String")
	private String invoiceNumber;
	@Schema(description = "결제 번호",type="number")
	private String paymentNumber;
	@Schema(description = "배송완료일",type="String")
	private String deliveryDate;
	
	
	@Schema(description = "상품 요약",type="String")
	private String productSummary;
	@Schema(description = "상품 사진",type="String")
	private String productThumbnail;
	@Schema(description = "상품 구매 가격",type="String")
	private int productPrice;
	@Schema(description = "상품 제목",type="String")
	private String productTitle;
	
	@Schema(description = "판매자 회원 닉네임",type="String")
	private String tradeSellerNickname;	
	@Schema(description = "판매자 정산 계좌",type="String")
	private String memberAccountnumber;
	@Schema(description = "구매자 회원 닉네임",type="String")
	private String tradeBuyerNickname;	
	

	@Schema(description = "리뷰작성여부",type="number")
	private int review;

	
	@Schema(description = "회원 이름 (판매 상세 내역)",type="String")
	private String memberName;
	@Schema(description = "회원 전화번호 (판매 상세 내역)",type="String")
	private String memberPhone;
	@Schema(description = "회원 판매자 등급 (판매 상세 내역)",type="number")
	private int sellerGrade;
	
	

	
}
