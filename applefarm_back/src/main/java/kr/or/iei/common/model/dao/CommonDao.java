package kr.or.iei.common.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.product.model.dto.ProductCategory;

@Mapper
public interface CommonDao {

	List<ProductCategory> navIPhoneList();

	List<ProductCategory> navElseList();

}
