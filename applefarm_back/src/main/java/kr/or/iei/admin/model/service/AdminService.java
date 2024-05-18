package kr.or.iei.admin.model.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.AdminProduct;
import kr.or.iei.admin.model.dto.ChatRoom;
import kr.or.iei.admin.model.dto.Dashboard;
import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.admin.model.dto.Report;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	@Autowired
	private PagiNation pagination;

	@Autowired
	private MemberDao memberDao;
	
	public Map selectRefundList(int reqPage, int selectedValue) {
		int numPerPage = 10; // 한 페이지당 게시물 수
		int pageNaviSize = 5; // 페이지 네비게이션 길이
		int totalCount = adminDao.totalCount(selectedValue); // 전체 게시물 수(전체 페이지 수 계산을 위함)
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount); // 페이징 처리에 필요한 값을 계산해서 객체로
		Refund rf = new Refund();
		rf.setSelectedValue(selectedValue);
		List list = adminDao.selectRefundList(rf);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("totalPostCount", totalCount);
		map.put("refundList", list);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int confirmRefund(Refund refund) {
		int result = adminDao.updateConfirmRefund(refund);
		result += adminDao.updateConfirmTrade(refund);
		return result;
	}

	@Transactional
	public int rejectRefund(Refund refund) {
		int result = adminDao.updateRejectRefund(refund);
		result += adminDao.updateRejectTrade(refund);
		return 0;
	}

	public Map selectProductList(String selectedValue, String filterStartDate, String filterEndDate, int reqPage) {
		AdminProduct ap = new AdminProduct();
		ap.setFilterStartDate(filterStartDate);
		ap.setFilterEndDate(filterEndDate);
		ap.setSelectedValue(selectedValue);
		int numPerPage = 10; // 한페이지당 게시물 수
		int pageNaviSize = 5; // 페이지 네비게이션 길이
		int totalCount = adminDao.productTotalCount(ap); // 전체 게시물 수(전체 페이지 수 계산을 위함)
		// 페이징 처리에 필요한 값을 계산해서 객체로 리턴받음
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		ap.setStart(pi.getStart());
		ap.setEnd(pi.getEnd());
		List list = adminDao.selectProductList(ap);
		HashMap<String, Object> map = new HashMap<String, Object>();
		// 날짜를 YYYY-MM-DD로 변경
		map.put("adminProductList", list);
		map.put("pi", pi);
		map.put("totalCount", totalCount);
		return map;
	}

	@Transactional
	public int changeIntoHide(HashMap<String, Object> checkedObject) {
		List<Object> values = new ArrayList(checkedObject.values());
		return adminDao.updateHide(values);
	}

	@Transactional
	public int changeIntoUnHide(HashMap<String, Object> checkedObject) {
		List<Object> values = new ArrayList(checkedObject.values());
		return adminDao.updateUnHide(values);
	}

	public Map selectReportList(int reqPage, int selectedValue) {
		int numPerPage = 10; // 한페이지당 게시물 수
		int pageNaviSize = 5; // 페이지 네비게이션 길이
		int totalCount = adminDao.reportTotalCount(selectedValue); // 전체 게시물 수(전체 페이지 수 계산을 위함)
		// 페이징 처리에 필요한 값을 계산해서 객체로 리턴받음
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		Report rp = new Report();
		rp.setSelectedValue(selectedValue);
		List list = adminDao.selectReportList(rp);
		HashMap<String, Object> map = new HashMap<String, Object>();
		// 날짜를 YYYY-MM-DD로 변경
		map.put("reportList", list);
		map.put("pi", pi);
		map.put("totalCount", totalCount);
		return map;

	}

	@Transactional
	public int changeReportStatus(Report report) {
		//1. reportStatus 업데이트
		int result = adminDao.changeReportStatus(report);
		
		//2. report된 table의 target에 대해 hide 처리
		if(report.getReportStatus() == 2) {
			result += adminDao.hidePost(report);
			result += adminDao.blackMember(report);
		
		//3. 유저 블랙 처리 (5분 정지)
		
		}else {
			result += adminDao.unHidePost(report);
			result += adminDao.blackMember(report);
			System.out.println("이게돌아가야해");
		}
		
		
		return result;
	}
	
	//회원관리 화면 내 블랙 처리
	@Transactional
	public void blackTimeOut() {
		
		List<Member> blackMemberCheckList = memberDao.selectBlackMemberCheckList();
		System.out.println("blackMember : "  + blackMemberCheckList);
		// 시간 계산 : 블랙
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		//블랙 지정 시간 계산
		for (Member member : blackMemberCheckList) {
			//LocalDateTime 클래스를 이용한 특정 시간 셈
			// 문자열을 LocalDateTime으로 파싱
			String blackTimeString = member.getMemberBlackTime();
			if (blackTimeString != null) {
				LocalDateTime blackTime = LocalDateTime.parse(blackTimeString, formatter);
				LocalDateTime whiteTime = blackTime.plusSeconds(180); //15초
				if (now.isAfter(whiteTime)) {
					 member.setMemberGrade(1);
					 member.setMemberBlackTime(null);
	                 memberDao.updateBlackMemberGrade(member);
				} else {
					System.out.println(member.getMemberName() + " 이용정지");
				}
			}
		}
	}

	public Map dashboard(String filterStartDate, String filterEndDate) {
		Dashboard db = new Dashboard();
		db.setFilterStartDate(filterStartDate);
		db.setFilterEndDate(filterEndDate);
		//1. 전체회원: filterEndDate 기준 전체회원 합계
		int totalMemberCount = adminDao.totalMemberCount(db); 
		
		//2. 신규유입: filterStartDate ~ filterEndDate 기준 전체 회원 합계
		int periodMemberCount = adminDao.periodMemberCount(db); 
		
		//3. 거래건수: filterStartDate ~ filterEndDate 기준 거래건수 합계
		int periodTradeCount = adminDao.periodTradeCount(db);
		
		
		//4. 거래금액: filterStartDate ~ filterEndDate 기준 거래금액 합계
		Integer periodTradeMoneyResult = adminDao.periodTradeMoney(db);
		int periodTradeMoney = (periodTradeMoneyResult != null) ? periodTradeMoneyResult : 0;

		
		// 회원수추이: filterStartDate ~ filterEndDate 사 일자별 가입일 개수
		List enrollDateCount = adminDao.enrollDateCount(db);
		
			/*
			 SELECT enroll_date, COUNT(*) AS join_count FROM member_tbl WHERE enroll_date
			 BETWEEN '2024-01-01' AND '2024-04-01' GROUP BY enroll_date; 
			 */
		// 거래대금추이: filterStartDate ~ filterEndDate 사 일자별 거래대금 합계
		//일별 거래대금 + 누적거래대금
		List tradeMoneySum = adminDao.tradeMoneySum(db);
		
	
		// 판매순위: 기간내 판매금액 상위 5명
		List topFiveSellerRank = adminDao.topFiveSellerRank(db);
		
		//구매순위: 기간내 구매금액 상위 5명
		List topFiveBuyerRank = adminDao.topFiveBuyerRank(db);
		
		//거래내역: 기간내 거래내역 데이터
		List tradeLog = adminDao.tradeLog(db);
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("totalMemberCount", totalMemberCount);
		map.put("periodMemberCount", periodMemberCount);
		map.put("periodTradeCount", periodTradeCount);
		map.put("periodTradeMoney", periodTradeMoney);
		map.put("enrollDateCount", enrollDateCount);
		map.put("tradeMoneySum", tradeMoneySum);
		map.put("topFiveSellerRank", topFiveSellerRank);
		map.put("topFiveBuyerRank", topFiveBuyerRank);
		map.put("tradeLog", tradeLog);
		System.out.println("맵" + map);
		
		return map;
	}


	public List<ChatRoom> selectChatRoomList(String memberId) {
		List<ChatRoom> list = adminDao.selectChatRoomList(memberId);
		return list;
	}

	
	
	
	
	
	
	
}

