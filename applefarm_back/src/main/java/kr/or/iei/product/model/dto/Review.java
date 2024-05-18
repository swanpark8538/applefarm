package kr.or.iei.product.model.dto;

import lombok.Data;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("review")
public class Review {
	private int tradeNo;
	private int reviewSeller;
	private int reviewConsumer;
	private int productNo;
	private int reviewSatisfaction;
	private String reviewDetail;
	
	private String productSummary;
	private String memberNickname;
	
	private int sellerScore;
}
