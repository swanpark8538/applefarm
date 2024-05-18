package kr.or.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias("quality")
public class Quality {
	private String tableName;
	private String part;
	private String part2;
	private String productStatus;
	private String productStatusImage;
}
