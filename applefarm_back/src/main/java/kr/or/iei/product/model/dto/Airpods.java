package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="airpods")
@Schema(description = "에어팟 객체")
public class Airpods {
	
	//Airpods_tbl
	private String productLine;
	private String airpodsGen;
	private String airpodsColor;
	private String airpodsImage;
	private String airpodsCharge;
	
	//Color_tbl
	private String colorImage;
}
