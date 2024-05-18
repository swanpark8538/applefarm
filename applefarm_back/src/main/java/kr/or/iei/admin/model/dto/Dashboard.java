package kr.or.iei.admin.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "dashboard")
public class Dashboard {

	
	//날짜
	private String selectedValue;
	private String filterStartDate;
	private String filterEndDate;
	
	

	// 회원수추이: filterStartDate ~ filterEndDate 사 일자별 가입일 개수
	private String enrollDate;
	private int memberCount;
	
	
	// 거래대금추이: filterStartDate ~ filterEndDate 사 일자별 거래대금 합계
	private String tradeDate;
	private int tradePrice;
	private int cumulativeTradePrice;
	
	
	// 판매순위: 기간내 판매금액 상위 5명
	private String sellerNickName;
	private int sellerTradePrice;

	// 구매순위: 기간내 구매금액 상위 5명
	private String buyerNickName;
	private int buyerTradePrice;


	//거래내역
	private int tradeNo;
	private int productNo;
	private String zipcode;
	private String address;
	private String addressDetail;
	private String tradeState;
	
	
}
