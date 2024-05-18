package kr.or.iei.product.model.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="product")
@Schema(description = "판매상품 객체")
public class Product {

	//Product_tbl
	private int productNo;
	private int memberNo;
	private char productQuality;
	private String productTitle;
	private String productExplain;
	private int productPrice;
	private Date productDate;
	private char productHide;
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
	private String productThumbnail;
	private String productSummary;
	private String tableName;
	
	//productDetail, productList에 사용
	private int likeCount;
	
	//productChart에 사용
	private int term;
	
	//productBid, productList에 사용
	private String tradeState;
	

	//구매최고희망가
	private int maxBidPrice;
	
	//거래등록일
	private Date tradeDate;
	
	//변경할 판매가
	private int changePrice;
	
	//환불 날짜
	private Date refundDate;
	
	//환불 상태
	private int refundStatus;
	
	//거래금액
	private int tradePrice;
	
	//송장번호
	private String invoiceNumber;
	
	

	//productMainList에 사용
	private int reqPage;
	private String productDateToChar;

}
