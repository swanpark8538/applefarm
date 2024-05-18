package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "productTradeChart")
@Schema(description = "거래일자별 거래량 및 평균거래가격 객체")
public class ProductTradeChart {

	private String tradeReserveDate;
	private String tradeVolume;
	private String tradePriceAvg;
}
