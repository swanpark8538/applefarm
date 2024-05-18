package kr.or.iei.trade.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.product.model.dto.Review;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.trade.model.dto.TradeDate;
import kr.or.iei.trade.model.dto.TradeDelivery;

@Mapper
public interface TradeDao {

	int insertTrade(Trade trade);


	Trade selectDetailTrade(Trade t);

	
	Trade selectDetailSales(Trade t);
	

	int bidTotalCount(int memberNo, int status, String startDate, String endDate);

	
	List<Bid> selectBid(HashMap<String, Object> data);

	
	int tradeExistCount(Trade trade);

	
	int selectBidPrice(Trade trade);


	int deleteBid(int bidNo);


	int deleteTradeBook(int productNo);

	int updateBid(Bid bid);


	int selectPurchaseTotalCount(HashMap<String, Object> data);


	List<Trade> selectPurchaseTrade(HashMap<String, Object> data);


	int updatePurchaseConfirm(int tradeNo);


	int insertReview(Review review);


	int updateSellerGrade(Review review);


	int insertRefund(Refund refund);


	int updateRefundTradeState(Refund refund);


	List selectDeliveryCompleted();


	List<TradeDelivery> selectDelivery();


	List<TradeDate> selectBook();


	int updateTrade(Trade trade);


	void deleteTradeBook2(int tradeNo);


	void updateDeliveryComplete(TradeDate t);

}
