package kr.or.iei.admin.model.dto;
import org.apache.ibatis.type.Alias;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="refund")
@Schema(description = "환불 객체")
public class Refund {

	//Refund Table
	@Schema(description = "환불번호", type = "int")
	private int refundNo;
	
	@Schema(description = "거래번호", type="int")
	private int tradeNo;
	
	@Schema(description = "상품번호", type="int")
	private int productNo;
	
	@Schema(description = "환불날짜", type = "string", format = "date")
	private String refundDate;
	
	@Schema(description = "환불사유", type="string" )
	private String refundReason;
	
	@Schema(description = "환불상태", type="string")
	private int refundStatus;
	
	
	//Join
	@Schema(description = "구매자", type="string")
	private String sellerNickname;
	
	@Schema(description = "판매자", type="string")
	private String buyerNickname;
	
	@Schema(description = "거래일", type="string")
	private String tradeDate;
	
	@Schema(description = "상품요약", type="string")
	private String productSummary;
	
	@Schema(description = "상품썸네일", type="string")
	private String productThumbnail;
	
	
	//Filter
	@Schema(description = "환불필터", type="int")
	private int selectedValue;

	
}



