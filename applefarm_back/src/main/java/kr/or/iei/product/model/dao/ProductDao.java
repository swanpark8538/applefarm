package kr.or.iei.product.model.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.Report;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.product.model.dto.AirpodsQualityHistory;
import kr.or.iei.product.model.dto.IpadQualityHistory;
import kr.or.iei.product.model.dto.IphoneQualityHistory;
import kr.or.iei.product.model.dto.MacbookQualityHistory;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.product.model.dto.ProductFile;
import kr.or.iei.product.model.dto.SalesInquiries;
import kr.or.iei.product.model.dto.SellerReview;
import kr.or.iei.product.model.dto.WatchQualityHistory;
import kr.or.iei.util.PageInfo;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Trade;



@Mapper
public interface ProductDao {

	List selectProductCategory(String table, String productLine);

	List productTradeChart(Product product);

	List selectQualityList(String tableName);
	

	Product selectOneProduct(int productNo);

	int insertProduct(Product product);

	int insertProductFile(ProductFile pf);


	int insertIphoneQualityHistory(IphoneQualityHistory iphoneQualityHistory);

	int insertMacbookQualityHistory(MacbookQualityHistory macbookQualityHistory);

	int insertIpadQualityHistory(IpadQualityHistory partObject);

	int insertWatchQualityHistory(WatchQualityHistory partObject);

	int insertAirpodsQualityHistory(AirpodsQualityHistory partObject);

	//ProductDetail.js
	Product selectOneView(int productNo);

	List selectSellerReviews(int productNo);

	List selectSellerProducts(int sellerNo);

	List selectProductFiles(int productNo);

	IphoneQualityHistory selectIphoneQualityHistory(int productNo);

	MacbookQualityHistory selectMacbookQualityHistory(int productNo);

	IpadQualityHistory selectIpadQualityHistory(int productNo);

	WatchQualityHistory selectWatchQualityHistory(int productNo);

	AirpodsQualityHistory selectAirpodsQualityHistory(int productNo);

	List selectReliableProducts(String summary);

	int likeBoolean(int productNo, int memberNo);

	int insertLike(int productNo, int memberNo);

	int deleteLike(int productNo, int memberNo);

	int hideProduct(int productNo);

	List<Bid> productBidList(int productNo);
	
	Member selectSellerInfo(int sellerNo);

	

	int totalCount(int productNo);


	List selectSalesInquiriesList(int productNo, PageInfo pi);

	String selectNickName(int memberNo);

	int insertSalesInquiries(SalesInquiries salesInquiries);



	int totalReviewCount(int productNo, String sellerNo);

	List selectReviewList(int productNo, PageInfo pi, String sellerNo);

	String selectSellerNo(int productNo);

	int totalSellerProductCount(int productNo, String sellerNo);

	List selectSellerProductList(int productNo, PageInfo pi, String sellerNo);

	int productPriceUpdate(int productPrice, int productNo);

	int productTradeReserve(Trade trade);

	int productBidInsert(Bid bid);

	int productBidUpdate(Bid bid);

	int productBidDelete(int bidNo);

	int insertReport(Report report);

	int productTotalCount(String tableName);

	List selectProductList(String tableName, PageInfo pi, String searchWord);


	int updateProduct(Product product);

	int updateProductFile(ProductFile pf);

	int updateIphoneQualityHistory(IphoneQualityHistory iphoneQualityHistory);

	int deleteProductFile(int productNo);

	int updateMacbookQualityHistory(MacbookQualityHistory macbookQualityHistory);

	int updateIpadQualityHistory(IpadQualityHistory ipadQualityHistory);

	int updateIpadQualityHistory(WatchQualityHistory watchQualityHistory);

	int updateAirpodsQualityHistory(AirpodsQualityHistory airpodsQualityHistory);

	int productMainListTotalCount(Product product);

	List<Product> productMainList(Product product, PageInfo pi);

}