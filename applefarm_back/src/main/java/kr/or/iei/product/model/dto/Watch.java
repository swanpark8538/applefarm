package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="watch")
@Schema(description = "애플워치 객체")
public class Watch {

	//Watch_tbl
	private String productLine;
	private String watchGen;
	private String watchModel;
	private String watchColor;
	private String watchImage;
	private String watchSize;
	private String watchConnectivity;
	
	//Color_tbl
	private String colorImage;
}
