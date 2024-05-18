package kr.or.iei.trade.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "bid")
@Schema(description = "매수호가(입찰) 객체")
public class Bid {

	private int bidNo;
	private int productNo;
	private int memberNo;
	private int bidPrice;
	private String bidDate; //Date타입 말고 String으로 했습니다!!!
	
	@Schema(description = "거래상태",type="Number")// 내가 산게 아니라 다른사람에 의해 품절됐는지
	private int tradeStatus;
	@Schema(description = "동일상품 최고입찰희망가",type="Number")
	private int maxPrice;
	@Schema(description = "상품 요약",type="String")
	private String productSummary;
	@Schema(description = "상품 사진",type="String")
	private String productThumbnail;
	@Schema(description = "상품 판매자 가격",type="int")
	private int productPrice;
	
	@Schema(description = "상품 예약",type="int")//예약상태인지
	private int tradeBook;
	
	private String productTitle;
}
