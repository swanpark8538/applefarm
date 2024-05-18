package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias("sellerReview")
public class SellerReview {
	private int tradeNo;
	private int reviewSeller;
	private int reviewConsumer;
	private int productNo;
	private int reviewSatisfaction;
	private String reviewDetail;
}
