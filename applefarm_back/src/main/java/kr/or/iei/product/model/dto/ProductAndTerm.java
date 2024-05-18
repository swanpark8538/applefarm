package kr.or.iei.product.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Product객체와 조회기간을 합친 객체 - @RequestBody에서 객체를 꺼낼때 사용")
public class ProductAndTerm {
	
	private Product product;
	private String tempTerm;

}
