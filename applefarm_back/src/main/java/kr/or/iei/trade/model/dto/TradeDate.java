package kr.or.iei.trade.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tradeDate")
@Schema(description = "거래 배송 날짜 객체")
public class TradeDate {
	@Schema(description = "거래 번호",type="number")
	private int tradeNo;
	@Schema(description = "거래 상태",type="String")
	private String tradeState;
	@Schema(description = "배송완료일",type="String")
	private String deliveryDate;
	@Schema(description = "거래 예약일",type="String")
	private String tradeReserveDate;
}
