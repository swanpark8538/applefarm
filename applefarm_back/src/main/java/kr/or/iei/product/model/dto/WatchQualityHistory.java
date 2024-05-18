package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("watchQualityHistory")
public class WatchQualityHistory {
	private int watchQualityHistoryNo;
	private int productNo;
	private String displayScreen;
	private String backPanelSide;
	private String burnIn;
	private String display;
	private String digitalCrownButton;
	private String batteryEfficiency;
	private String wirelessConnectivity;
	private String microphone;
	private String speaker;
	private String power;
	private String voiceRecording;
	private String operation;
}
