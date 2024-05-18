package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="iPhone")
@Schema(description = "아이폰 객체")
public class Iphone {

	//Iphone_tbl
	private String productLine;
	private String productGen;
	private String productModel;
	private String productColor;
	private String productImage;
	private String productStorage;
	
	//Color_tbl
	private String colorImage;
}
