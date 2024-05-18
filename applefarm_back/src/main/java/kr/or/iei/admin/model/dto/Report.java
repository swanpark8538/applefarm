package kr.or.iei.admin.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="report")
public class Report {
	// Report Table
	@Schema(description = "신고번호", type = "number")
	private int reportNo;
	
	@Schema(description = "신고유형", type = "number")
	private int reportType;
	
	@Schema(description = "신고대상", type = "number")
	private int reportTarget;
	
	@Schema(description = "신고내용", type = "String")
	private String reportContent;
	
	@Schema(description = "신고날짜", type = "String")
	private String reportDate;
	
	@Schema(description = "신고자", type = "number")
	private int reportingMember;
	
	@Schema(description = "피신고자", type = "int")
	private int reportedMember;
	
	@Schema(description = "처리상태", type = "int")
	private int reportStatus;
	
	@Schema(description = "처리날짜", type = "String")
	private String reportActionDate;

	// Filter
	@Schema(description = "환불필터", type = "number")
	private int selectedValue;
	
	private String reportingMemberName;
	private String reportedMemberName;
	
}
