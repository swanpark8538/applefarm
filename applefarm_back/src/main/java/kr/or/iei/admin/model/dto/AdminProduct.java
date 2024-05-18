package kr.or.iei.admin.model.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="adminProduct")
@Schema(description = "상품 객체")
public class AdminProduct {

	//--------상품관리 테이블 메인--------//
	//상품테이블: 상품제목 productTitle
	//상품테이블: 판매자 회원번호(memberNo) -> 회원테이블: 아이디(memberId)
	//상품테이블: 작성일(productDate)
	//상품테이블: 상품숨기기(productHide)
	//상품구분(아이폰, 아이패드)
	
	//--------상품관리 테이블 상세 메인--------//
	//상품테이블: 상품상세설명(productExplain)
	//상품테이블: 상품 품질(productQuality)
	//상품테이블: 판매희망가(productPrice)
	//상품테이블: 상품썸네일(productThumbnail)
	private int productNo;
	private int memberNo;
	private char productQuality;
	private String productTitle;
	private String productExplain;
	private int productPrice;
	private String productDate;
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

	//회원테이블
	private String memberName;
	
	
	//날짜
	private String selectedValue;
	private String filterStartDate;
	private String filterEndDate;
	
	//페이징
	private int start;
	private int end;

}	
