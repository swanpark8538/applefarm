package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("airpodsQualityHistory")
public class AirpodsQualityHistory {
	private int airpodsQualityHistoryNo;
	private int productNo;
	private String soundQuality;
	private String connectionStability;
	private String batteryEfficiency;
	private String exterior;
	private String charging;
	private String touchSensor;
}
