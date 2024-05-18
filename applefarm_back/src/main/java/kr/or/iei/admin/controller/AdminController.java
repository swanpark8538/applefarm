package kr.or.iei.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.admin.model.dto.ChatRoom;
import kr.or.iei.admin.model.dto.Dashboard;
import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.admin.model.dto.Report;
import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.board.model.service.BoardService;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;
import kr.or.iei.product.model.service.ProductService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/admin")
@Tag(name = "ADMIN", description = "ADMIN API")
public class AdminController {
	@Autowired
	private AdminService adminService;
	@Autowired
	private MemberService memberService;
	@Autowired
	private BoardService boardService;
	@Autowired
	private ProductService productService;

	@Operation(summary = "환불 신청 조회", description = "이 엔드포인트는 전체 환불 신청 목록을 조회합니다. 요청 페이지 번호를 기반으로 페이징 처리됩니다.")
	@ApiResponses({ // 응답에 대한 설명
			@ApiResponse(responseCode = "200", description = "응답 메시지 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/manageRefund/{reqPage}/{selectedValue}")
	public ResponseEntity<ResponseDTO> refundList(@PathVariable int reqPage, @PathVariable int selectedValue) {
		Map map = adminService.selectRefundList(reqPage, selectedValue);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "환불 승인", description = "이 엔드포인트는 접수된 환불 신청 건을 승인합니다. 환불번호와 거래번호를 기반으로 환불 상태 및 거래 상태를 업데이트합니다.")
	@ApiResponses({ // 응답에 대한 설명
			@ApiResponse(responseCode = "200", description = "응답 메시지 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/refundConfirm")
	public ResponseEntity<ResponseDTO> refundConfirm(@RequestBody Refund refund) {
		int result = adminService.confirmRefund(refund);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "환불 거절", description = "이 엔드포인트는 접수된 환불 신청 건을 거절합니다. 환불번호와 거래번호를 기반으로 환불 상태 및 거래 상태를 업데이트합니다.")
	@ApiResponses({ // 응답에 대한 설명
			@ApiResponse(responseCode = "200", description = "응답 메시지 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/refundReject")
	public ResponseEntity<ResponseDTO> refundReject(@RequestBody Refund refund) {
		int result = adminService.rejectRefund(refund);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@GetMapping(value = "/member/{reqPage}")
	public ResponseEntity<ResponseDTO> memberList(@PathVariable int reqPage) {
		Map map = memberService.selectMemberList(reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	
	@PatchMapping(value = "/memberGrade")
	public ResponseEntity<ResponseDTO> changeMemberGrade(@RequestBody Member member) {
		int result = memberService.changeMemberGrade(member);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@GetMapping(value = "/memberProduct/{selectedValue}/{filterStartDate}/{filterEndDate}/{reqPage}")
	public ResponseEntity<ResponseDTO> productList(@PathVariable String selectedValue,
			@PathVariable String filterStartDate, @PathVariable String filterEndDate, @PathVariable int reqPage) {
		Map map = adminService.selectProductList(selectedValue, filterStartDate, filterEndDate, reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@PatchMapping(value = "/hideProduct")
	public ResponseEntity<ResponseDTO> changeIntoHide(@RequestBody HashMap<String, Object> checkedObject) {
		int result = adminService.changeIntoHide(checkedObject);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@PatchMapping(value = "/unHideProduct")
	public ResponseEntity<ResponseDTO> changeIntoUnHide(@RequestBody HashMap<String, Object> checkedObject) {
		int result = adminService.changeIntoUnHide(checkedObject);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@GetMapping(value="/memberReport/{reqPage}/{selectedValue}")
	public ResponseEntity<ResponseDTO> reportMember(@PathVariable int reqPage, @PathVariable int selectedValue){
		Map map = adminService.selectReportList(reqPage, selectedValue);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	
	@PatchMapping(value = "/reportStatus")
	public ResponseEntity<ResponseDTO> changeReportStatus(@RequestBody Report report) {
		System.out.println("allreport" + report);
		int result = adminService.changeReportStatus(report);
		System.out.println("리절트 " + result);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@GetMapping(value="dashboard/{filterStartDate}/{filterEndDate}")
	public ResponseEntity<ResponseDTO> selectDashboard(@PathVariable String filterStartDate, @PathVariable String filterEndDate){
		Map map = adminService.dashboard(filterStartDate, filterEndDate);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@GetMapping(value="chatRoomList/{memberId}")
	public ResponseEntity<ResponseDTO> selectChatRoomList(@PathVariable String memberId){
		List<ChatRoom> list = adminService.selectChatRoomList(memberId);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		
	}
	
	
	
}


