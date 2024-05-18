package kr.or.iei.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "address")
@Schema(description = "주소 객체")
public class Address {
	@Schema(description = "주소 번호",type="number")
	private int addressNo;
	@Schema(description = "회원 번호",type="number")
	private int memberNo;
	@Schema(description = "우편번호",type="string")
	private String zipcode;
	@Schema(description = "주소",type="string")
	private String address;
	@Schema(description = "상세주소", type="string")
	private String addressDetail;
	@Schema(description = "수령인 아룸", type="string")
	private String addressName;
	@Schema(description = "수령인 전화번호",type="string")
	private String addressPhone;
	@Schema(description = "배송 요청사항", type="string")
	private String addressRequest;
	@Schema(description = "기본 배송지 여부", type="number")
	private int addressDefault;
}
