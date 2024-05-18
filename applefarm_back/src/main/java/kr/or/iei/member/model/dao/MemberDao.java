package kr.or.iei.member.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.Refund;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.member.model.dto.Address;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.util.PageInfo;

@Mapper
public interface MemberDao {

	int insertAddress(Address address);

	int updateAddressDefault(int memberNo);

	int selectAddressCount(int memberNo);

	List selectAddress(int memberNo);

	Address selectAddressBasic(int memberNo);

	int addressNoBasicTotalCount(int memberNo);

	List selectAddressList(HashMap<String, Object> data);

	int deleteAddress(int addressNo);

	int updateAddressDefault1(int addressNo);

	int selectOneEmail(String memberEmail);

	int selectOneId(String memberId);

	int selectOneNickName(String memberNickName);

	int join(Member member);

	int memberTotalCount();

	// -------------------------------관리자: 회원관리 기능-------------------------------
	List selectMemberList(PageInfo pi);
	// -------------------------------관리자: 회원관리 기능-------------------------------

	int updateSearchUpdateBasicAddress(int memberNo);

	int updateAddress(Address address);

	int selectBasicAddressNo(int memberNo);

	int updateBasicAddress(int addressNo);

	List selectLike(int memberNo);

	int changeMemberGrade(Member member);

	void updateMemberGrader();

	void updateBlackMemberGrade(Member member);

	Member selectNo(int memberNo);

	Integer OneMemberNo(String memberId);

	Member getMemberInfo(int memberNo);

	int deleteLike(int likeNo);

	int updateEmail(Member member);

	int deleteMember(int memberNo);

	int updatePw(Member member);

	List<Member> selectBlackMemberCheckList();

	int updatePhone(Member member);

	int addAccountNumber(Member member);

	int deleteAccountNumber(Member member);

	String getMemberId(String memberEmail);

	int resetPw(Member member);

	List<Product> getSalesHistory(int memberNo);

	int changeSalesPrice(Product product);

	int deleteSalesProduct(int productNo);

	int updateInvoiceNum(Trade trade);

	Trade getSalesProductDetails(int productNo);

	List<Product> getRefund(int memberNo);

	List<Product> getOnlyProduct(int memberNo);










	

}
