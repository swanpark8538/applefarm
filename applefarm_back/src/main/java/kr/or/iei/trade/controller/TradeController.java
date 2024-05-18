package kr.or.iei.trade.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.admin.model.dto.Refund;

import kr.or.iei.product.model.dto.Review;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Delivery;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.trade.service.TradeService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/trade")
@Tag(name = "TRADE", description = "TRADE API")
public class TradeController {
	@Autowired
	private TradeService tradeService;

	@Operation(summary = "상품가 결제완료", description = "상품 결제 후 거래내역 생성")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중  message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping
	public ResponseEntity<ResponseDTO> insertTrade(@RequestBody Trade trade, @RequestAttribute int memberNo) {
		trade.setTradeBuyer(memberNo);
		//System.out.println(trade);
		int result = tradeService.insertTrade(trade);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	@Operation(summary = "입찰가 결제완료", description = "상품 결제 후 거래테이블 상태 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중  message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping
	public ResponseEntity<ResponseDTO> updateTrade(@RequestBody Trade trade, @RequestAttribute int memberNo) {
		trade.setTradeBuyer(memberNo);
		int result = tradeService.updateTrade(trade);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@Operation(summary = "판매 유무", description = "거래되었는지 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중  message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/exist/{productNo}")
	public ResponseEntity<ResponseDTO> selectExistTrade(@PathVariable int productNo, @RequestAttribute int memberNo) {
		Trade trade = new Trade();
		trade.setProductNo(productNo);
		trade.setTradeBuyer(memberNo);
		int result = tradeService.selectExistTrade(trade);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", result);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "구매 거래 내역 상세", description = "구매 거래 관련 정보 상세 보기")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/detailOrder/{productNo}")
	public ResponseEntity<ResponseDTO> selectDetailOrder(@PathVariable int productNo, @RequestAttribute int memberNo) {
		Trade t = new Trade();
		t.setProductNo(productNo);
		t.setTradeBuyer(memberNo);
		Trade trade = tradeService.selectDetailTrade(t);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", trade);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "판매 거래 내역 상세", description = "판매 거래 관련 정보 상세 보기")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/detailSales/{productNo}")
	public ResponseEntity<ResponseDTO> selectDetailSales(@PathVariable int productNo, @RequestAttribute int memberNo) {
		Trade t = new Trade();
		t.setProductNo(productNo);
		t.setTradeSeller(memberNo);
		Trade trade = tradeService.selectDetailSales(t);
		//System.out.println(trade);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", trade);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "구매입찰내역 조회", description = "상태,페이지,기간을 받아서 구매 입찰내역 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/bid/{status}/{reqPage}/{startDate}/{endDate}")
	public ResponseEntity<ResponseDTO> selectBid(@RequestAttribute int memberNo, @PathVariable int status,
			@PathVariable int reqPage, @PathVariable String startDate, @PathVariable String endDate) {
		Map map = tradeService.selectBid(memberNo, status, reqPage, startDate, endDate);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "입찰 취소", description = "입찰번호 받아 입찰데이터 삭제,예약상태일 시 거래테이블 내 예약도 삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@DeleteMapping(value = "/bid/{bidNo}/{productNo}/{tradeBook}")
	public ResponseEntity<ResponseDTO> deleteBid(@PathVariable int bidNo, @PathVariable int productNo,
			@PathVariable int tradeBook) {
		int result = tradeService.deleteBid(bidNo, productNo, tradeBook);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "입찰 취소", description = "입찰번호 받아 입찰데이터 삭제,예약상태일 시 거래테이블 내 예약도 삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/bid")
	public ResponseEntity<ResponseDTO> updateBid(@RequestBody Bid bid) {
		int result = tradeService.updateBid(bid);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "구매내역 조회", description = "현재 탭,상태,페이지,기간을 받아서 구매내역 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/purchase/{tab}/{status}/{reqPage}/{startDate}/{endDate}")
	public ResponseEntity<ResponseDTO> selectPurchase(@RequestAttribute int memberNo, @PathVariable int tab,
			@PathVariable int status, @PathVariable int reqPage, @PathVariable String startDate,
			@PathVariable String endDate) {
		Map map = tradeService.selectPurchase(memberNo, tab, status, reqPage, startDate, endDate);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "구매확정", description = "거래상태 구매확정으로 업데이트")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/purchaseConfirm")
	public ResponseEntity<ResponseDTO> purchaseConfirm(@RequestBody Trade trade) {
		int result = tradeService.updatePurchaseConfirm(trade);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "후기작성", description = "거래번호, 판매자회원번호, 만족도, 후기내용을 받아 후기등록")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/review")
	public ResponseEntity<ResponseDTO> insertReview(@RequestBody Review review, @RequestAttribute int memberNo) {
		review.setReviewConsumer(memberNo);
		int result = tradeService.insertReview(review);
		if (result == 2) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "환불신청", description = "거래번호, 상품번호, 환불사유를 받아 환불신청")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/refund")
	public ResponseEntity<ResponseDTO> insertRefund(@RequestBody Refund refund) {
		int result = tradeService.insertRefund(refund);
		if (result == 2) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	@Operation(summary = "배송조회", description = "송장번호 받아서 배송상태 조회, api이용")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/tracking/{invoiceNumber}")
	public ResponseEntity<ResponseDTO> trackingHistory(@PathVariable String invoiceNumber) {
		String url = "https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=04&t_invoice=" + invoiceNumber
				+ "&t_key=YlFOzoy1xCyv8YDqetwzAA";
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		ArrayList<Delivery> list = new ArrayList<Delivery>();

		try {
			// HTTP 헤더를 적절히 설정
			String result = Jsoup.connect(url).header("Accept", "application/json;charset=UTF-8")
					.ignoreContentType(true).get().text();

			System.out.println(result);
			
			JsonObject object = (JsonObject) JsonParser.parseString(result); // 객체로 데이터를 받았기 때문에 제이슨 오브젝트로 받음
			JsonArray items = object.get("trackingDetails").getAsJsonArray();
			// 겟.키값.해당하는 형태
			String completeYN = object.get("completeYN").getAsString();	//배송완료 여부
			for (int i = 0; i < items.size(); i++) {
				JsonObject item = items.get(i).getAsJsonObject();
				String kind = item.get("kind").getAsString();
				int level = item.get("level").getAsInt();
				String manName = item.get("manName").getAsString();
				String telno = item.get("telno").getAsString();
				String telno2 = item.get("telno2").getAsString();
				String timeString = item.get("timeString").getAsString();
				String where = item.get("where").getAsString();
				Delivery d = new Delivery(kind, level, manName, telno, telno2, timeString, where);
				list.add(d);
			}
			map.put("completeYN", completeYN);
			map.put("list",list);
		} catch (IOException e) {
			e.printStackTrace();

		}
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<>(response, response.getHttpStatus());
	}

}
