package kr.or.iei.trade.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.product.model.dto.Review;
import kr.or.iei.trade.model.dao.TradeDao;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Delivery;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.trade.model.dto.TradeDate;
import kr.or.iei.trade.model.dto.TradeDelivery;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;

@Service
public class TradeService {
	@Autowired
	private TradeDao tradeDao;
	@Autowired
	private PagiNation pagination;
	@Transactional
	public int insertTrade(Trade trade) {
		return tradeDao.insertTrade(trade);
	}
	public int updateTrade(Trade trade) {
		return tradeDao.updateTrade(trade);
	}
	public int selectExistTrade(Trade trade) {
		return tradeDao.tradeExistCount(trade);
	}
	public Trade selectDetailTrade(Trade t) {
		return tradeDao.selectDetailTrade(t);
	}
	public Trade selectDetailSales(Trade t) {
		return tradeDao.selectDetailSales(t);
	}
	public Map selectBid(int memberNo, int status, int reqPage, String startDate, String endDate) {
		int numPerPage = 5; // 페이지당 행 수 -> 성공 후 수정
		int pageNaviSize = 5;
		int totalCount = tradeDao.bidTotalCount(memberNo,status,startDate,endDate);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("memberNo", memberNo);
		data.put("start", pi.getStart());
		data.put("end", pi.getEnd());
		data.put("status",status);
		data.put("startDate",startDate);
		data.put("endDate",endDate);
		List<Bid> bidList = tradeDao.selectBid(data);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("bidList", bidList);
		map.put("pi", pi);
		return map;
	}
	@Transactional
	public int deleteBid(int bidNo, int productNo, int tradeBook) {
		int result=0;
		result+=tradeDao.deleteBid(bidNo);
		if(tradeBook==1) {
			//예약 취소시 거래테이블 내에서도 삭제
			result+=tradeDao.deleteTradeBook(productNo);
			result-=1;
		}
		return result;
	}
	@Transactional
	public int updateBid(Bid bid) {
		return tradeDao.updateBid(bid);
	}
	public Map selectPurchase(int memberNo, int tab, int status, int reqPage, String startDate, String endDate) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("memberNo", memberNo);
		data.put("tab",tab);
		data.put("status",status);
		data.put("startDate",startDate);
		data.put("endDate",endDate);
		int totalCount = tradeDao.selectPurchaseTotalCount(data);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		data.put("start", pi.getStart());
		data.put("end", pi.getEnd());
		List<Trade> tradeList = tradeDao.selectPurchaseTrade(data);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("tradeList", tradeList);
		map.put("pi", pi);
		//System.out.println(tradeList);
		return map;
	}
	@Transactional
	public int updatePurchaseConfirm(Trade trade) {
		return tradeDao.updatePurchaseConfirm(trade.getTradeNo());
	}
	@Transactional
	public int insertReview(Review review) {
		//review_tbl 후기 insert 후,member_tbl 판매자점수 update
		int result = tradeDao.insertReview(review);
		if(result>0) {
			result+= tradeDao.updateSellerGrade(review);
		}
		return result;
	}
	@Transactional
	public int insertRefund(Refund refund) {
		// refund_Tbl insert => trade_tbl(trade_state)환불로 update
		int result = tradeDao.insertRefund(refund);
		if(result>0) {
			result+=tradeDao.updateRefundTradeState(refund);
		}
		return result;
	}
	
	@Transactional
	public void scheduledPurchase() {
		//배송완료 리스트 불러오기(거래번호, 배송완료일)
		List<TradeDate> list = tradeDao.selectDeliveryCompleted();
		//System.out.println("작동중");
		//System.out.println(list);
		LocalDate now = LocalDate.now(); // 현재 날짜
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		System.out.println(now);
		// 배송 완료 시간을 가져와서 현재 날짜와 비교하여 7일이면 구매 확정으로 update
		for (TradeDate td : list) {
		    LocalDate deliveryDate = LocalDate.parse(td.getDeliveryDate(), formatter);
		    long daysBetween = ChronoUnit.DAYS.between(deliveryDate,now);
		    System.out.println(daysBetween);
		    if (daysBetween > 7) {
		        // 7일 이상 지났으면 구매 확정으로 업데이트
		        tradeDao.updatePurchaseConfirm(td.getTradeNo());
		    }
		}
	}
	
	@Transactional
	public void scheduledBook() {
		List<TradeDate> list = tradeDao.selectBook();
		System.out.println("예약리스트 : "+list);
		LocalDate now = LocalDate.now(); // 현재 날짜(시간까진 X(시간은 LocalDateTime.now())
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		System.out.println(now);
		// 예약 시간을 가져와서 현재 날짜와 비교하여 그다음날 자정시 거래테이블에서 예약취소(delete)
		for (TradeDate td : list) {
		    LocalDate bookDate = LocalDate.parse(td.getTradeReserveDate(), formatter);
		    long daysBetween = ChronoUnit.DAYS.between(bookDate,now);
		    System.out.println(daysBetween);
		    if (daysBetween >= 2) {
		        // 그다음날 자정 지났으면 거래 삭제(취소)
		    	tradeDao.deleteTradeBook2(td.getTradeNo());
		    }
		}
	}
	
	@Transactional
	public void selectDelivery() {
		//배송완료 전 배송중 상태만 가져옴
		List<TradeDelivery> list = tradeDao.selectDelivery();
		System.out.println(list);
		for(TradeDelivery td : list) {
			String invoiceNumber = td.getInvoiceNumber();
			System.out.println(invoiceNumber);			
			String url = "https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=04&t_invoice=" + invoiceNumber
					+ "&t_key=YlFOzoy1xCyv8YDqetwzAA";
			try {
				String result = Jsoup.connect(url).header("Accept", "application/json;charset=UTF-8")
						.ignoreContentType(true).get().text();
				System.out.println(result);
				JsonObject object = (JsonObject) JsonParser.parseString(result); // 객체로 데이터를 받았기 때문에 제이슨 오브젝트로 받음
				//배송완료 여부 조회,배송완료시간 가져오기
				String completeYN = object.get("completeYN").getAsString();		//완료여부
				JsonObject item = object.get("lastDetail").getAsJsonObject();
				String timeString = item.get("timeString").getAsString();		//완료시간(ex."2024-04-02 18:08:08")
				if(completeYN.equals("Y")){
					//배송완료시 거래테이블에 배송완료시간,배송상태(배송완료)로 업데이트
					TradeDate t = new TradeDate(td.getTradeNo(), "배송완료", timeString, null);
					System.out.println("t:"+t);
					tradeDao.updateDeliveryComplete(t);
				}
			} catch (IOException e) {
				e.printStackTrace();

			}
		}
	}


	
	
	
	
	
}
