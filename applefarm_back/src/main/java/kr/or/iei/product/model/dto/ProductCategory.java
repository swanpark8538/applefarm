package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "productCategory")
@Schema(description = "제품카테고리 객체")
public class ProductCategory {

	//Product_tbl
	private String productLine;
	private String productGen;
	private String productModel;
	private String productModel2;
	private String productColor;
	private String productStorage;
	private String productMemory;
	private String productChip;
	private String productCpu;
	private String productGpu;
	private String productSize;
	private String productConnectivity;
	private String productCharge;
	//private String productThumbnail;
	//private String productSummary;
	
	//
	private String productImage;
	
	//Color_tbl
	//private String colorImage;
	
}
