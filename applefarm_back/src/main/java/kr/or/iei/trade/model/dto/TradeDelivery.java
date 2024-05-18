package kr.or.iei.trade.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tradeDelivery")
@Schema(description = "배송관련정보 객체")
public class TradeDelivery {	
	@Schema(description = "거래 번호",type="number")
	private int tradeNo;
	@Schema(description = "거래 상태",type="String")
	private String tradeState;
	@Schema(description = "배송 송장번호",type="String")
	private String invoiceNumber;
}
