package kr.or.iei.product.model.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dto.AdminProduct;
import kr.or.iei.admin.model.dto.Report;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.product.model.dao.ProductDao;
import kr.or.iei.product.model.dto.AirpodsQualityHistory;
import kr.or.iei.product.model.dto.IpadQualityHistory;
import kr.or.iei.product.model.dto.IphoneQualityHistory;
import kr.or.iei.product.model.dto.MacbookQualityHistory;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.product.model.dto.ProductCategory;
import kr.or.iei.product.model.dto.ProductFile;
import kr.or.iei.product.model.dto.SalesInquiries;
import kr.or.iei.product.model.dto.ProductTradeChart;
import kr.or.iei.product.model.dto.SellerReview;
import kr.or.iei.product.model.dto.WatchQualityHistory;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;

@Service
public class ProductService {

	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private PagiNation pagination;

	public List<ProductCategory> selectProductCategory(HashMap<String, String> categoryMap) {
		String table = categoryMap.get("table");
		String productLine = categoryMap.get("productLine");
		List list = productDao.selectProductCategory(table, productLine);
		return list;
	}
	
	public List productTradeChart(Product product) {
		List<ProductTradeChart> list = productDao.productTradeChart(product);
		//to_char(trunc(avg(t.trade_price)),'fm999,999,999,999') as trade_price_avg
		return list;
	}

	public List selectQualityList(String tableName) {	
		return productDao.selectQualityList(tableName);
	}
	
	@Transactional
	public int insertProduct(Product product, ArrayList<ProductFile> fileList) {
		int result = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result += productDao.insertProductFile(pf);
			
		}
		return result;
	}


	@Transactional
	public int insertIphone(Product product, ArrayList<ProductFile> fileList,IphoneQualityHistory iphoneQualityHistory) {
		
		int result1 = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		iphoneQualityHistory.setProductNo(product.getProductNo());

		int result2 = productDao.insertIphoneQualityHistory(iphoneQualityHistory);
		
		
		return result1+result2;
	}

	@Transactional
	public int insertMacbook(Product product, ArrayList<ProductFile> fileList,
			MacbookQualityHistory macbookQualityHistory) {
		int result1 = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		macbookQualityHistory.setProductNo(product.getProductNo());

		int result2 = productDao.insertMacbookQualityHistory(macbookQualityHistory);
		
		
		return result1+result2;
	}

	@Transactional
	public int insertIpad(Product product, ArrayList<ProductFile> fileList, IpadQualityHistory partObject) {
		int result1 = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		partObject.setProductNo(product.getProductNo());

		int result2 = productDao.insertIpadQualityHistory(partObject);
		
		
		return result1+result2;
	}

	@Transactional
	public int insertWatch(Product product, ArrayList<ProductFile> fileList, WatchQualityHistory partObject) {
		
		int result1 = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		partObject.setProductNo(product.getProductNo());

		int result2 = productDao.insertWatchQualityHistory(partObject);
		
		
		return result1+result2;
	}

	@Transactional
	public int insertAirpods(Product product, ArrayList<ProductFile> fileList, AirpodsQualityHistory partObject) {
		int result1 = productDao.insertProduct(product);
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		partObject.setProductNo(product.getProductNo());

		int result2 = productDao.insertAirpodsQualityHistory(partObject);
		
		
		return result1+result2;
	}

//	public ProductAndMember selectOneView(int productNo,int memberNo) {
//		
//		return productDao.selectOneView(productNo,memberNo);
//	}
//
//	public List selectSellerReviews(int sellerNo) {
//		return productDao.selectSellerReviews(sellerNo);
//	}
//
//	public List selectSellerProducts(int sellerNo) {
//
//		return productDao.selectSellerProducts(sellerNo);
//	}
//
//	public IphoneQualityHistory selectIphoneQualityHistory(int productNo) {
//		
//		return productDao.selectIphoneQualityHistory(productNo);
//	}
//
//	public MacbookQualityHistory selectMacbookQualityHistory(int productNo) {
//		// TODO Auto-generated method stub
//		return productDao.selectMacbookQualityHistory(productNo);
//	}
//
//	public IpadQualityHistory selectIpadQualityHistory(int productNo) {
//		// TODO Auto-generated method stub
//		return productDao.selectIpadQualityHistory(productNo);
//	}
//
//	public WatchQualityHistory selectWatchQualityHistory(int productNo) {
//		// TODO Auto-generated method stub
//		return productDao.selectWatchQualityHistory(productNo);
//	}
//
//	public AirpodsQualityHistory selectAirpodsQualityHistory(int productNo) {
//		// TODO Auto-generated method stub
//		return productDao.selectAirpodsQualityHistory(productNo);
//	}
//
//	public List selectProductFiles(int productNo) {
//		
//		return productDao.selectProductFiles(productNo);
//	}
//
//	public List selectReliableProducts(String summary) {
//		return productDao.selectReliableProducts(summary);
//	}

	public HashMap<String, Object> selectOneProduct(int productNo) {
				//memberNo 접속자
				//sellerNo 판매자
				//productNo 상품
				//tableName 테이블 이름
		
				HashMap<String, Object> map = new HashMap<String, Object>();
				//상품 124번의 상품정보 & 회원정보
				Product product= productDao.selectOneView(productNo);
				//상품 조회 결과가 없거나(에러) 숨김처리(이용자가 삭제 등) 되어있을 경우
				if(product == null || product.getProductHide() == '1') {
					return map;
				}
				map.put("product", product);
				
				int sellerNo = product.getMemberNo();
				String tableName = product.getTableName();
				String summary = product.getProductSummary();
				
				//판매자 정보
				Member seller = productDao.selectSellerInfo(sellerNo);
				if(seller==null) {
					return map;
				}
				map.put("seller",seller);
				
				//판매자(member_no=45)에 대한 후기 리스트
//				List sellerReviewList = productDao.selectSellerReviews(sellerNo);
//				if(sellerReviewList==null) {
//					return map;
//				}
//				map.put("sellerReviewList",sellerReviewList);
				
				//판매자(member_no=45)의 상품 리스트
//				List sellerProductList = productDao.selectSellerProducts(sellerNo);
//				if(sellerProductList==null) {
//					return map;
//				}
//				map.put("sellerProductList",sellerProductList);
				
				//상품 124번의 첨부파일 리스트(file_no, file_path가 필요)
				List productFileList = productDao.selectProductFiles(productNo);
				if(productFileList==null) {
					return map;
				}
				map.put("productFileList",productFileList);
				
				//상품 124번의 품질(테이블 별로 다르게)
				switch (tableName) {
				case "IPHONE_TBL" :
					map.put("qualityHistory", productDao.selectIphoneQualityHistory(productNo));
					break;
				case "MACBOOK_TBL" :
					map.put("qualityHistory", productDao.selectMacbookQualityHistory(productNo));
					break;
				case "IPAD_TBL" :
					map.put("qualityHistory", productDao.selectIpadQualityHistory(productNo));
					break;
				case "WATCH_TBL" :
					map.put("qualityHistory", productDao.selectWatchQualityHistory(productNo));
					break;
				case "AIRPODS_TBL" :
					map.put("qualityHistory", productDao.selectAirpodsQualityHistory(productNo));
					break;
				default :
					break;
				}
				
				/*
				if(tableName.equals("IPHONE_TBL")) {
					IphoneQualityHistory qualityHistory = productDao.selectIphoneQualityHistory(productNo);
					map.put("qualityHistory",qualityHistory);
				}else if(tableName.equals("MACBOOK_TBL")) {
					MacbookQualityHistory qualityHistory = productDao.selectMacbookQualityHistory(productNo);
					map.put("qualityHistory",qualityHistory);
				}else if(tableName.equals("IPAD_TBL")) {
					IpadQualityHistory qualityHistory = productDao.selectIpadQualityHistory(productNo);
					map.put("qualityHistory",qualityHistory);
				}else if(tableName.equals("WATCH_TBL")) {
					WatchQualityHistory qualityHistory = productDao.selectWatchQualityHistory(productNo);
					map.put("qualityHistory",qualityHistory);
				}else if(tableName.equals("AIRPODS_TBL")) {
					AirpodsQualityHistory qualityHistory = productDao.selectAirpodsQualityHistory(productNo);
					map.put("qualityHistory",qualityHistory);
				}
				*/
				
				//신뢰도 높은 상품 리스트
				List reliableProductList = productDao.selectReliableProducts(summary);
				if(reliableProductList==null) {
					return map;
				}
				map.put("reliableProductList",reliableProductList);
				
				return map;
	}

	public int likeBoolean(int productNo, int memberNo) {
		return productDao.likeBoolean(productNo, memberNo);
	}

	@Transactional
	public int insertLike(int productNo, int memberNo) {
		return productDao.insertLike(productNo, memberNo);
	}

	@Transactional
	public int deleteLike(int productNo, int memberNo) {
		return productDao.deleteLike(productNo, memberNo);
	}

	@Transactional
	public int hideProduct(int productNo) {
		return productDao.hideProduct(productNo);
	}


	public Map selectSalesInquiriesList(int productNo,int reqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		
		int totalCount = productDao.totalCount(productNo); // 현제 상품의 전체 게시물 수
//		System.out.println(totalCount);
		
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectSalesInquiriesList(productNo,pi);
		

		
		HashMap<String, Object> map = new HashMap<String,Object>();
		map.put("salesInquiriesList", list);
		map.put("pi", pi);
		
		return map; 
	}

	@Transactional
	public int insertSalesInquiries(SalesInquiries salesInquiries, int memberNo) {
		String inquiryWriter = productDao.selectNickName(memberNo);
//		System.out.println(inquiryWriter);
		salesInquiries.setInquiryWriter(inquiryWriter);
		
		int result = productDao.insertSalesInquiries(salesInquiries);
		
		return result;
	}

	public List productBidList(int productNo) {
		List<Bid> list = productDao.productBidList(productNo);
		return list;

	}


	public Map selectReviewList(int productNo, int reviewReqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		String sellerNo = productDao.selectSellerNo(productNo);
		int totalCount = productDao.totalReviewCount(productNo,sellerNo); // 현제 상품의 전체 게시물 수
//		System.out.println("토탈"+totalCount);
		PageInfo pi = pagination.getPageInfo(reviewReqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectReviewList(productNo,pi,sellerNo);

		
		HashMap<String, Object> map = new HashMap<String,Object>();
		map.put("reviewList", list);
		map.put("pi", pi);
		
		return map; 
	}

	public Map selectProductList(int productNo, int sellerProductReqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		String sellerNo = productDao.selectSellerNo(productNo);
		int totalCount = productDao.totalSellerProductCount(productNo,sellerNo); // 현제 상품의 전체 게시물 수
//		System.out.println("토탈"+totalCount);
		PageInfo pi = pagination.getPageInfo(sellerProductReqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectSellerProductList(productNo,pi,sellerNo);

		
		HashMap<String, Object> map = new HashMap<String,Object>();
		map.put("sellerProductList", list);
		map.put("pi", pi);
		
		return map; 
	}

	@Transactional
	public int productPriceUpdate(int productPrice, int productNo) {
		return productDao.productPriceUpdate(productPrice, productNo);
	}

	@Transactional
	public int productTradeReserve(Trade trade) {
		return productDao.productTradeReserve(trade);
	}
	
	@Transactional
	public int productBidInsert(Bid bid) {
		return productDao.productBidInsert(bid);
	}

	@Transactional
	public int productBidUpdate(Bid bid) {
		return productDao.productBidUpdate(bid);
	}

	@Transactional
	public int productBidDelete(int bidNo) {
		return productDao.productBidDelete(bidNo);
	}

	@Transactional
	public int insertReport(Report report) {
		
		return productDao.insertReport(report);
	}

	public Map selectProductList(String tableName,int reqPage, String searchWord) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		
		int totalCount = productDao.productTotalCount(tableName);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectProductList(tableName,pi,searchWord);
		System.out.println(list);
		HashMap<String, Object> map = new HashMap<String,Object>();
		
		map.put("productList", list);
		map.put("pi", pi);
		
		return map; 
	}


	@Transactional
	public int updateIphone(Product product, ArrayList<ProductFile> fileList, IphoneQualityHistory iphoneQualityHistory) {
		int result1 = productDao.updateProduct(product);
		
//		기존 사진을 제거하고 새롭게 추가.
		int result3 = productDao.deleteProductFile(product.getProductNo());
		
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		iphoneQualityHistory.setProductNo(product.getProductNo());
		int result2 = productDao.updateIphoneQualityHistory(iphoneQualityHistory);
		
		
		return result1+result2;
	}

	public int updateMacbook(Product product, ArrayList<ProductFile> fileList, MacbookQualityHistory macbookQualityHistory) {
int result1 = productDao.updateProduct(product);
		
//		기존 사진을 제거하고 새롭게 추가.
		int result3 = productDao.deleteProductFile(product.getProductNo());
		
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		macbookQualityHistory.setProductNo(product.getProductNo());
		int result2 = productDao.updateMacbookQualityHistory(macbookQualityHistory);
		
		
		return result1+result2;
	}

	public int updateIpad(Product product, ArrayList<ProductFile> fileList, IpadQualityHistory ipadQualityHistory) {
int result1 = productDao.updateProduct(product);
		
//		기존 사진을 제거하고 새롭게 추가.
		int result3 = productDao.deleteProductFile(product.getProductNo());
		
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		ipadQualityHistory.setProductNo(product.getProductNo());
		int result2 = productDao.updateIpadQualityHistory(ipadQualityHistory);
		
		
		return result1+result2;
	}

	public int updateWatch(Product product, ArrayList<ProductFile> fileList, WatchQualityHistory watchQualityHistory) {
int result1 = productDao.updateProduct(product);
		
//		기존 사진을 제거하고 새롭게 추가.
		int result3 = productDao.deleteProductFile(product.getProductNo());
		
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		watchQualityHistory.setProductNo(product.getProductNo());
		int result2 = productDao.updateIpadQualityHistory(watchQualityHistory);
		
		
		return result1+result2;
	}

	public int updateAirpods(Product product, ArrayList<ProductFile> fileList, AirpodsQualityHistory airpodsQualityHistory) {
int result1 = productDao.updateProduct(product);
		
//		기존 사진을 제거하고 새롭게 추가.
		int result3 = productDao.deleteProductFile(product.getProductNo());
		
		for(ProductFile pf: fileList) {
			pf.setProductNo(product.getProductNo());
			result1 += productDao.insertProductFile(pf);
		}
		
		airpodsQualityHistory.setProductNo(product.getProductNo());
		int result2 = productDao.updateAirpodsQualityHistory(airpodsQualityHistory);
		
		
		return result1+result2;
	}




	




	


	public HashMap<String, Object> productMainList(Product product, int reqPage) {
		int numPerPage = 12;	//한 페이지 당 게시물 
		int pageNaviSize = 5;	//페이지 네비게이션의 길
		int totalCount = productDao.productMainListTotalCount(product);	//전체 게시물 수(전체 페이지 수 계산을 위해)
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List<Product> list = productDao.productMainList(product, pi);
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("productList", list);
		map.put("pi", pi);
		//System.out.println(product);
		//System.out.println(list);
		//System.out.println(pi);
		
		return map;
	}


	
}
