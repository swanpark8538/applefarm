package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ipadQualityHistory")
public class IpadQualityHistory {
	private int ipadQualityHistoryNo;
	private int productNo;
	private String displayScreen;
	private String backPanelSide;
	private String burnIn;
	private String display;
	private String ports;
	private String batteryEfficiency;
	private String wirelessConnectivity;
	private String camera;
	private String microphone;
	private String speakersAudioJack;
	private String biometricAuthentication;
	private String power;
	private String voiceRecording;
	private String operation;
}
