package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="Macbook")
@Schema(description = "맥북 객체")
public class Macbook {

	//Macbook_tbl
	private String productLine;
	private String macbookGen;
	private String macbookModel;
	private String macbookModel2;
	private String macbookColor;
	private String macbookImage;
	private String macbookStorage;
	private String macbookMemory;
	private String macbookChip;
	private String macbookCpu;
	private String macbookGpu;
	
	//Color_tbl
	private String colorImage;
}
