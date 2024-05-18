package kr.or.iei.trade.model.dto;


import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="delivery")
@Schema(description = "배송 객체")
public class Delivery {
	
	//trackingDetails
	private String kind;
	private int level;
	private String manName;
	private String telno;
	private String telno2;
	private String timeString;
	private String where; 
	//lastDetail
	
	
	//lastStateDetail
	
	
	

}
