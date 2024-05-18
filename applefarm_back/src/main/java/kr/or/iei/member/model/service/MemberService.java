package kr.or.iei.member.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Address;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.product.model.dao.ProductDao;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.trade.model.dao.TradeDao;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.util.JwtUtil;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private PagiNation pagination;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private ProductDao productDao;
	@Autowired
	private TradeDao tradeDao;

	@Transactional
	public int insertAddress(Address address) {
		int result = 0;
		int memberNo = address.getMemberNo();
		int count = memberDao.selectAddressCount(memberNo);
		if (count == 0) {
			address.setAddressDefault(1);
		} else {
			if (address.getAddressDefault() == 1) {
				result += memberDao.updateAddressDefault(memberNo);
				result -= count;
			}
		}
		result += memberDao.insertAddress(address);
		return result;
	}

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public Map selectAddress(int memberNo, int reqPage) {
		// 전체 배송지 리스트(기본배송지+나머지 배송지들)
		ArrayList<Address> list = new ArrayList<Address>();
		// 기본배송지
		Address basicAddress = memberDao.selectAddressBasic(memberNo);
		list.add(basicAddress);
		// 기본배송지 제외한 배송지 리스트
		int numPerPage = 3; // 페이지당 행 수 -> 성공 후 수정
		int pageNaviSize = 5;
		int totalCount = memberDao.addressNoBasicTotalCount(memberNo);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("memberNo", memberNo);
		data.put("start", pi.getStart());
		data.put("end", pi.getEnd());
		List<Address> addressList = memberDao.selectAddressList(data);
		if (!addressList.isEmpty()) {
			for (Address a : addressList) {
				list.add(a);
			}
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("addressList", list);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int deleteAddress(int addressNo) {
		return memberDao.deleteAddress(addressNo);
	}

	@Transactional
	public int updateAddressDefault(Address address) {
		int result = memberDao.updateAddressDefault(address.getMemberNo());
		result -= memberDao.selectAddressCount(address.getMemberNo());
		result += memberDao.updateAddressDefault1(address.getAddressNo());
		return result;
	}

	@Transactional
	public int updateAddress(Address address) {
		System.out.println(address);
		int result = 0;
		// 기본배송지 1인 상태로 수정요청시 update전 기본배송지상태1인거 찾아서 기본배송지상태 0으로 변경
		if (address.getAddressDefault() == 1) {
			int addressNo = memberDao.selectBasicAddressNo(address.getMemberNo());
			result += memberDao.updateBasicAddress(addressNo);
			// result += memberDao.updateSearchUpdateBasicAddress(address.getMemberNo());
			result -= 1;
		}
		result += memberDao.updateAddress(address);
		return result;
	}

	public int selectOneEmail(String memberEmail) {

		int duplicationEmail = memberDao.selectOneEmail(memberEmail);

		return duplicationEmail;
	}

	public int selectOneId(String memberId) {

		int duplicationId = memberDao.selectOneId(memberId);

		return duplicationId;
	}

	public int selectOneNickName(String memberNickName) {
		int duplicationNickName = memberDao.selectOneNickName(memberNickName);
		return duplicationNickName;
	}

	/*
	 * @Transactional public int join(Member member) {
	 * 
	 * int result = memberDao.join(member);
	 * 
	 * return result; }
	 */
	// -------------------------------관리자: 회원관리 기능 시작
	// -------------------------------//
	public Map selectMemberList(int reqPage) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = memberDao.memberTotalCount();

		// 페이지 인포 객체
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List<Member> memberList = memberDao.selectMemberList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("memberList", memberList);
		map.put("pi", pi);
		return map;
	}

	public int changeMemberGrade(Member member) {
		int result = memberDao.changeMemberGrade(member);
		return result;
	}

//-------------------------------관리자: 회원관리 기능 끝 -------------------------------//

	public String login(Member member) {
		
		
		Integer memberNo = memberDao.OneMemberNo(member.getMemberId()); // 화면에서 가져온거
		
		  if (memberNo == null) {
		        
		        return null; //회원 번호가 없으면 로그인 실패 처리(아이디 잘못입력했을 떄)
		    }
		    
		
		System.out.println(member);

		Member m = memberDao.selectNo(memberNo); // 디비에서 가져온거

		if (m.getMemberGrade() == 3) {
			String accessToken = "black";
			return accessToken;
		} else if ("1".equals(m.getMemberWithdraw())) {

			String accessToken = "withdrawMember";
			return accessToken;

		} else {
			if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
				long expiredDateMs = 300 * 60 * 1000l; // 1시간 지정
				// 아이디 인증 끝났을 때 토큰
				String accessToken = jwtUtil.createToken(m.getMemberNo(), expiredDateMs);
				System.out.println(accessToken); // accessToken은 클라이언트한테 줘야 함.
				return accessToken;
			} else {
				return null;
			}
		}
	}

	public Member selectId(int memberNo) {

		return memberDao.selectNo(memberNo);
	}

	@Transactional
	public int join(Member member) {

		int result = memberDao.join(member);

		return result;
	}

	/*
	 * //관리자: 회원관리 기능 public Map selectMemberList(int reqPage) { int numPerPage = 5;
	 * int pageNaviSize = 5; int totalCount = memberDao.memberTotalCount();
	 * 
	 * //페이지 인포 객체 PageInfo pi = pagination.getPageInfo(reqPage, numPerPage,
	 * pageNaviSize, totalCount); List memberList = memberDao.selectMemberList(pi);
	 * HashMap<String, Object> map = new HashMap<String, Object>();
	 * map.put("memberList", memberList); map.put("pi", pi); return map; }
	 */

	/*
	 * public Member login(Member member) {
	 * 
	 * Member m = memberDao.selectId(member.getMemberId());
	 * 
	 * if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(),
	 * m.getMemberPw())) {
	 * 
	 * 
	 * return m; }else { return null; }
	 * 
	 * 
	 * 
	 * }
	 */
	public List selectLike(int memberNo) {
		return memberDao.selectLike(memberNo);
	}

	public int deleteLike(int likeNo) {
		return memberDao.deleteLike(likeNo);
	}

	public List allAddress(int memberNo) {
		return memberDao.selectAddress(memberNo);
	}

	public Map selectPaymentInfo(int memberNo, int productNo, String bidThough) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		// 회원 정보
		Member member = memberDao.getMemberInfo(memberNo);
		// 주소 정보
		Address address = memberDao.selectAddressBasic(memberNo);
		// 상품 정보
		Product product = productDao.selectOneProduct(productNo);
		Trade trade = new Trade();
		trade.setTradeBuyer(memberNo);
		trade.setProductNo(productNo);
		// 상품 예약 결제로 페이지 접근시 결제 가격 조회
		if (bidThough.equals("y")) {
			int bidPrice = tradeDao.selectBidPrice(trade);
			product.setProductPrice(bidPrice);
		}
		int tradeExist = tradeDao.tradeExistCount(trade);
		map.put("member", member);
		map.put("address", address);
		map.put("product", product);
		map.put("tradeExist", tradeExist);
		return map;
	}

	public Member selectNo(int memberNo) {

		return memberDao.selectNo(memberNo);

	}

	public Member getMemberInfo(int memberNo) {

		return memberDao.getMemberInfo(memberNo);
	}

	@Transactional
	public int updateEmail(Member member) {

		return memberDao.updateEmail(member);
	}

	@Transactional
	public int deleteMember(int memberNo) {

		return memberDao.deleteMember(memberNo);

	}

	public Address basicAddress(int memberNo) {
		return memberDao.selectAddressBasic(memberNo);

	}

	// 이전 비밀번호 확인
	public int pwCheck(Member member) {

		Member m = memberDao.selectNo(member.getMemberNo());

		// db에서 조회한거
		if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {

			return 1;

		} else {

			return 0;
		}

	}

	@Transactional
	public int updatePw(Member member) {

		return memberDao.updatePw(member);
	}

	@Transactional
	public int updatePhone(Member member) {

		return memberDao.updatePhone(member);
	}

	@Transactional
	public int addAccountNumber(Member member) {

		return memberDao.addAccountNumber(member);
	}

	@Transactional
	public int deleteAccountNumber(Member member) {
		// TODO Auto-generated method stub
		return memberDao.deleteAccountNumber(member);
	}

	public String getMemberId(String memberEmail) {

		return memberDao.getMemberId(memberEmail);
	}

	@Transactional
	public int resetPw(Member member) {
		// TODO Auto-generated method stub
		return memberDao.resetPw(member);
	}

	public List<Product> getSalesHistory(int memberNo) {

		return memberDao.getSalesHistory(memberNo);
	}

	public int changeSalesPrice(Product product) {

		return memberDao.changeSalesPrice(product);
	}

	public int deleteSalesProduct(int productNo) {

		return memberDao.deleteSalesProduct(productNo);
	}

	public int updateInvoiceNum(Trade trade) {

		return memberDao.updateInvoiceNum(trade);
	}

	public Trade getSalesProductDetails(int productNo) {

		return memberDao.getSalesProductDetails(productNo);
	}

	public List<Product> getRefund(int memberNo) {

		return memberDao.getRefund(memberNo);
	}

	public List<Product> getOnlyProduct(int memberNo) {

		return memberDao.getOnlyProduct(memberNo);
	}

}
