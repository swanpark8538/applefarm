package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("reliableProductList")
public class ReliableProductList {
	private int productNo;
	private String productSummary;
	private int productPrice;
	private int memberNo;
	private String memberName;
	private int sellerScore;
}
