package kr.or.iei.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.trade.service.TradeService;

@Component
public class Scheduler {
	
	@Autowired
	private AdminService adminService;
	@Autowired
	private TradeService tradeService;

	@Scheduled(fixedRate = 60000) // miliseconds
	public void updateMembmerGrade() {
        adminService.blackTimeOut();
	}
	
	//배송완료 후 7일 이후자동 구매확정
	@Scheduled(cron="0 1 * * * *")	//매일 00시에 실행	//테스트로 매시 1분에 실행으로 설정되어있음
	public void scheduledPurchase() {
		tradeService.scheduledPurchase();
	}
	
	//매일 00시에 예약상품 기간내에 결제 미완료 취소
	@Scheduled(cron="0 0 0 * * *")	//매일 00시에 실행
	public void scheduledBook() {
		tradeService.scheduledBook();
	}

/*횟수제한때문에 막아놈	
	//배송완료(하루에 한번 배송중인 거래들 송장번호를 가지고 배송완료상태,완료시간을 조회해서 배송완료시 거래테이블 업데이트
	@Scheduled(cron="0 55 * * * *")	//테스트로 매시 55분에 실행으로 설정되어있음
	public void scheduledDelivery() {
		tradeService.selectDelivery();
	}
*/	
	
}
