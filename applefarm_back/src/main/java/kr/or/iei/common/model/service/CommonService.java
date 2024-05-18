package kr.or.iei.common.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dao.CommonDao;
import kr.or.iei.product.model.dto.ProductCategory;

@Service
public class CommonService {
	
	@Autowired
	private CommonDao commonDao;

	public HashMap navList() {
		HashMap<String, List> map = new HashMap<String, List>();
		List<ProductCategory> navIPhoneList = commonDao.navIPhoneList();
		
		List<ProductCategory> navElseList = commonDao.navElseList();
		List<ProductCategory> navMacBookList = new ArrayList<ProductCategory>();
		List<ProductCategory> navIPadList = new ArrayList<ProductCategory>();
		List<ProductCategory> navWatchlist = new ArrayList<ProductCategory>();
		List<ProductCategory> navAirPodslist = new ArrayList<ProductCategory>();
		if(navIPhoneList.size() == 0 || navElseList.size() == 0) {
			return null;
		}else {
			for(ProductCategory productCategory : navElseList) {
				String productLine = productCategory.getProductLine();
				if(productLine.equals("MacBook Pro")||productLine.equals("MacBook Air")) {
					navMacBookList.add(productCategory);
				}else if(productLine.equals("iPad Pro 12.9")||productLine.equals("iPad Pro 11")||productLine.equals("iPad Air")||productLine.equals("iPad Mini")||productLine.equals("iPad")) {
					if(productLine.equals("iPad")) {
						String productGen = productCategory.getProductGen()+"세대";
						productCategory.setProductGen(productGen);
						navIPadList.add(productCategory);
					}else {
						navIPadList.add(productCategory);
					}
				}else if(productLine.equals("Apple Watch Ultra")||productLine.equals("Apple Watch Series")||productLine.equals("Apple Watch SE")) {
					navWatchlist.add(productCategory);
				}else {
					navAirPodslist.add(productCategory);
				}
			}
			map.put("iPhone", navIPhoneList);
			map.put("MacBook", navMacBookList);
			map.put("iPad", navIPadList);
			map.put("Watch", navWatchlist);
			map.put("AirPods",navAirPodslist);
			return map;
		}
	}

}
