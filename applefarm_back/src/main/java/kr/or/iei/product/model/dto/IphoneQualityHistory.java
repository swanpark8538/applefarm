package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value = "iphoneQualityHistory")
public class IphoneQualityHistory {
	private int iphoneQualityHistoryNo;
	private int productNo;
	private String displayScreen;
	private String backPanelSide;
	private String burnIn;
	private String display;
	private String power;
	private String camera;
	private String wifi;
	private String biometricAuthentication;
	private String compass;
	private String voiceRecording;
}
