package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("salesInquiries")
public class SalesInquiries {
	private int inquiryNo;
	private int productNo;
	private String inquiryWriter;
	private String inquiryDate;
	private String inquiryContent;
}
