package kr.or.iei.member.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import kr.or.iei.ResponseDTO;
import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Address;

import kr.or.iei.EmailSender;
import kr.or.iei.member.model.dto.Member;

import kr.or.iei.member.model.service.MemberService;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Trade;
import lombok.Getter;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/member")
@Tag(name = "MEMBER", description = "MEMBER API")
public class MemberController {
	@Autowired
	private MemberService memberService;

	@Autowired
	private EmailSender emailSender;

	@Operation(summary = "이메일 중복체크", description = "매개변수로 전달한 이메일 사용 여부 조회")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping("/email/{memberEmail}")
	public ResponseEntity<ResponseDTO> verifEmail(@PathVariable String memberEmail) {

		int duplicationEmail = memberService.selectOneEmail(memberEmail);

		if (duplicationEmail == 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "로그인 정보 이메일 중복체크", description = "매개변수로 전달한 이메일 사용 여부 조회")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping("/emailChk/{memberEmail}")
	public ResponseEntity<ResponseDTO> emailChk(@PathVariable String memberEmail) {

		int duplicationEmail = memberService.selectOneEmail(memberEmail);

		System.out.println(memberEmail + duplicationEmail);

		if (duplicationEmail == 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "이메일로 인증코드 발송", description = "매개변수로 전달한 이메일로 인증코드 발송")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping("/email/{memberEmail}")
	public ResponseEntity<ResponseDTO> sendEmail(@PathVariable String memberEmail) {

		String authCode = emailSender.sendCode(memberEmail);

		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

	}

	@Operation(summary = "아이디 중복체크", description = "매개변수로 전달한 아이디 사용 여부 조회")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping("/id/{memberId}")
	public ResponseEntity<ResponseDTO> selectOneId(@PathVariable String memberId) {

		int duplicationId = memberService.selectOneId(memberId);

		if (duplicationId == 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "닉네임 중복체크", description = "매개변수로 전달한 닉네임 사용 여부 조회")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping("/nickName/{memberNickName}")
	public ResponseEntity<ResponseDTO> selectOneNickName(@PathVariable String memberNickName) {

		int duplicationNickName = memberService.selectOneNickName(memberNickName);

		if (duplicationNickName == 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "회원가입", description = "회원 데이터를 입력 받아서 회원가입")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping("/join")
	public ResponseEntity<ResponseDTO> join(@RequestBody Member member) {

		System.out.println(member);

		String bankName = member.getBankName();
		String accountNumber = member.getMemberAccountnumber();
		String depositorName = member.getDepositorName();

		String combinedAccountInfo = bankName + " " + accountNumber + " " + depositorName;

		member.setMemberAccountnumber(combinedAccountInfo);

		int result = memberService.join(member);

		if (result > 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "로그인", description = "회원 데이터를 입력 받아서 로그인")
	@ApiResponses({ // 응답에 대한 작성 설명할 떄
			@ApiResponse(responseCode = "200", description = "응답 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody Member member) {

		String accessToken = memberService.login(member);

		if (accessToken != null) {
			if (accessToken == "black") {
				ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "black", accessToken); // 성공하면 토큰도 전달
				return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			}else if(accessToken == "withdrawMember") {
				ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "withdrawMember", accessToken); // 성공하면 토큰도 전달
				return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			} else {
				ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", accessToken); // 성공하면 토큰도 전달
				return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			}
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "주소록 추가", description = "주소록에 새 주소 추가")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중  message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/address")
	public ResponseEntity<ResponseDTO> insertAddress(@RequestBody Address address, @RequestAttribute int memberNo) {
		address.setMemberNo(memberNo);
		System.out.println(address);
		int result = memberService.insertAddress(address);
		// System.out.println(result);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(500, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "주소록 보기", description = "주소록 리스트 출력")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 data 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생"), })
	@GetMapping(value = "/address/{reqPage}")
	public ResponseEntity<ResponseDTO> selectAddress(@RequestAttribute int memberNo, @PathVariable int reqPage) {
		Map map = memberService.selectAddress(memberNo, reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "주소 삭제", description = "주소록에 저장된 주소 삭제")
	@ApiResponses({
		@ApiResponse(responseCode = "200",description = "응답 데이터 중 message 값 확인"),
		@ApiResponse(responseCode = "500",description = "서버 에러 발생")
	})
	@DeleteMapping(value = "/address/{addressNo}") 
	public ResponseEntity<ResponseDTO> deleteAddress(@PathVariable int addressNo){
		int result = memberService.deleteAddress(addressNo);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(500, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "기본배송지 변경", description = "주소록 목록에서 기본배송지 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/basicAddress")
	public ResponseEntity<ResponseDTO> updateAddressDefault(@RequestBody Address address) {
		int result = memberService.updateAddressDefault(address);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(500, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "주소록 수정", description = "주소록 목록 중 해당 주소 수정")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 값 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/address")
	public ResponseEntity<ResponseDTO> updateAddress(@RequestBody Address address, @RequestAttribute int memberNo) {
		address.setMemberNo(memberNo);
		int result = memberService.updateAddress(address);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(500, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "좋아요 조회", description = "좋아요 전체 목록 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/like")
	public ResponseEntity<ResponseDTO> selectLikeList(@RequestAttribute int memberNo) {
		List list = memberService.selectLike(memberNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@Operation(summary = "좋아요 삭제", description = "해당 좋아요 삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 중 message 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@DeleteMapping(value = "/like/{likeNo}")
	public ResponseEntity<ResponseDTO> deleteLike(@PathVariable int likeNo) {
		int result = memberService.deleteLike(likeNo);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary = "상품,회원정보 조회",description = "상품, 회원, 기본배송지 조회")
	@ApiResponses({
		@ApiResponse(responseCode = "200",description = "응답 데이터 중 message 확인"),
		@ApiResponse(responseCode = "500",description = "서버 에러 발생")
	})
	@GetMapping(value = "/paymentInfo/{productNo}/{bidThough}")
	public ResponseEntity<ResponseDTO> paymentInfo(@RequestAttribute int memberNo,@PathVariable int productNo, @PathVariable String bidThough){
		Map map = memberService.selectPaymentInfo(memberNo,productNo,bidThough);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		// Address address= memberService.basicAddress(memberNo);
		// ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success",
		// address);
		// return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}

	@Operation(summary = "전체배송지 조회", description = "기본배송지 최우선 순으로 전체 배송지 리스트 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@GetMapping(value = "/allAddress")
	public ResponseEntity<ResponseDTO> alladdress(@RequestAttribute int memberNo) {
		List list = memberService.allAddress(memberNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@GetMapping
	public ResponseEntity<ResponseDTO> getMember(@RequestAttribute int memberNo) {

		Member member = memberService.selectNo(memberNo);

		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

	}

	@GetMapping(value = "/info")
	public ResponseEntity<ResponseDTO> memberInfo(@RequestAttribute int memberNo) {

		Member member = memberService.getMemberInfo(memberNo);

		System.out.println(memberNo);

		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

	}

	@Operation(summary = "회원탈퇴", description = "회원번호로 식별해서 회원탈퇴")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@DeleteMapping(value = "/deleteMember/{memberNo}")
	public ResponseEntity<ResponseDTO> deleteMember(@RequestAttribute int memberNo) {

		System.out.println(memberNo);

		int result = memberService.deleteMember(memberNo);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "이전 비밀번호 확인", description = "회원 번호, 회원 이메일 화면에서 데이터 전송받아서 비밀번호 일치하는지 확인")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/pwCheck")
	public ResponseEntity<ResponseDTO> pwCheck(@RequestBody Member member) {

		int result = memberService.pwCheck(member);

		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "valid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "invalid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "비밀번호 변경", description = "회원 번호, 회원 이메일 화면에서 데이터 전송받아서 비밀번호 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/updatePw")
	public ResponseEntity<ResponseDTO> updatePw(@RequestBody Member member) {

		int result = memberService.updatePw(member);

		System.out.println(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "이메일 변경", description = "화면에서 회원 번호, 회원 이메일 데이터 전송받아서 이메일 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/updateEmail")
	public ResponseEntity<ResponseDTO> updateEmail(@RequestBody Member member) {

		int result = memberService.updateEmail(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "이메일 변경", description = "화면에서 회원 번호, 회원 이메일 데이터 전송받아서 이메일 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/updatePhone")
	public ResponseEntity<ResponseDTO> updatePhone(@RequestBody Member member) {

		int result = memberService.updatePhone(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "주소 추가", description = "화면에서 회원 번호, 회원 주소(은행명, 계좌번호, 예금주명) 데이터 전송받아서 주소 추가(변경)")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/addAccountNumber")
	public ResponseEntity<ResponseDTO> addAccountNumber(@RequestBody Member member) {

		int result = memberService.addAccountNumber(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "계좌 삭제", description = "화면에서 회원 번호, 회원 계좌번호 입력받아서 계좌삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/deleteAccountNumber")
	public ResponseEntity<ResponseDTO> deleteAccountNumber(@RequestBody Member member) {

		int result = memberService.deleteAccountNumber(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "아이디찾기", description = "화면에서 입력한 이메일 입력받아서 이메일로 아이디 전송")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/findId")
	public ResponseEntity<ResponseDTO> findId(@RequestBody Member member) {

		// System.out.println(member.getMemberEmail());

		String memberEmail = member.getMemberEmail();

		// 찾아올 아이디 가져오기
		String memberId = memberService.getMemberId(memberEmail);

		System.out.println(memberEmail);

		if (memberId == null) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "no email", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			System.out.println(memberId);

			// 화면에서 가져온 이메일로 아이디 전송해주기
			String id = emailSender.sendId(memberEmail, memberId);

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "비밀번호찾기(이메일인증)", description = "화면에서 입력한 이메일 입력받아서 이메일 인증, 인증 코드 전송")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/sendEmail")
	public ResponseEntity<ResponseDTO> sendEmail(@RequestBody Member member) {

		String memberEmail = member.getMemberEmail();

		// 이메일 여부
		int emailOrNot = memberService.selectOneEmail(memberEmail);

		if (emailOrNot == 0) {

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "no email", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {

			String authCode = emailSender.sendCode(memberEmail);

			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "비밀번호재설정(비밀번호 찾기)", description = "화면에서 입력한 이메일 입력받아서 비밀번호 재설정")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/resetPw")
	public ResponseEntity<ResponseDTO> resetPw(@RequestBody Member member) {

		int result = memberService.resetPw(member);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "판매내역 데이터 가져오기", description = "로그인한 회원번호로 판매내역 데이터 가져오기")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/getSalesHistory/{memberNo}")
	public ResponseEntity<ResponseDTO> getSalesHistory(@PathVariable int memberNo) {

		List<Product> product = memberService.getSalesHistory(memberNo);

		System.out.println(product);

		if (product != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product);
			return new ResponseEntity<>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "판매상품 가격 변경", description = "화면에서 상품 번호,변경할 상품 가격 데이터 가져와서 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/changeSalesPrice")
	public ResponseEntity<ResponseDTO> chageSalesPrice(@RequestBody Product product) {

		int result = memberService.changeSalesPrice(product);
		System.out.println(product);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "판매상품 삭제", description = "화면에서 상품 번호 가져와서 삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@DeleteMapping(value = "/deleteSalesProduct/{productNo}")
	public ResponseEntity<ResponseDTO> deleteSalesProduct(@PathVariable int productNo) {

		int result = memberService.deleteSalesProduct(productNo);
		System.out.println(productNo);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "송장등록", description = "화면에서 상품 번호,인보이스 번호 가져와서 송장 업데이트 및 거래 상태 배송중으로 변경")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PatchMapping(value = "/updateInvoiceNum")
	public ResponseEntity<ResponseDTO> updateInvoiceNum(@RequestBody Trade trade) {

		int result = memberService.updateInvoiceNum(trade);

		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@Operation(summary = "판매상세내역", description = "화면에서 상품 번호로 참조")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/getSalesProductDetails/{productNo}")
	public ResponseEntity<ResponseDTO> getSalesProductDetails(@PathVariable int productNo) {

		Trade getTrade = memberService.getSalesProductDetails(productNo);

		if (getTrade != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", getTrade);
			return new ResponseEntity<>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<>(response, response.getHttpStatus());

		}

	}

	@Operation(summary = "환불데이터 가져오기", description = "화면에서 회원번호로 참조")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/getRefund/{memberNo}")
	public ResponseEntity<ResponseDTO> getRefund(@PathVariable int memberNo) {

		List<Product> refund = memberService.getRefund(memberNo);

		if (refund != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", refund);
			return new ResponseEntity<>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<>(response, response.getHttpStatus());

		}

	}
	
	@Operation(summary = "거래테이블에 없는 상품데이터", description = "화면에서 회원번호로 참조")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "응답 데이터 확인"),
			@ApiResponse(responseCode = "500", description = "서버 에러 발생") })
	@PostMapping(value = "/getOnlyProduct/{memberNo}")
	public ResponseEntity<ResponseDTO> getOnlyProduct(@PathVariable int memberNo){
		
		List<Product> product = memberService.getOnlyProduct(memberNo);
		
		if (product != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product);
			return new ResponseEntity<>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<>(response, response.getHttpStatus());

		}

		
	}

	
	
	
	

}
