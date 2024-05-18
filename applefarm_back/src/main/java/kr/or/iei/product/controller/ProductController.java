package kr.or.iei.product.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.admin.model.dto.Report;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.product.model.dto.AirpodsQualityHistory;
import kr.or.iei.product.model.dto.IpadQualityHistory;
import kr.or.iei.product.model.dto.IphoneQualityHistory;
import kr.or.iei.product.model.dto.MacbookQualityHistory;
import kr.or.iei.product.model.dto.Product;
import kr.or.iei.product.model.dto.ProductAndTerm;
import kr.or.iei.product.model.dto.ProductCategory;
import kr.or.iei.product.model.dto.ProductFile;
import kr.or.iei.product.model.dto.SalesInquiries;
import kr.or.iei.product.model.dto.SellerReview;
import kr.or.iei.product.model.dto.WatchQualityHistory;
import kr.or.iei.product.model.service.ProductService;
import kr.or.iei.trade.model.dto.Bid;
import kr.or.iei.trade.model.dto.Trade;
import kr.or.iei.util.FileUtils;
import kr.or.iei.util.JwtUtil;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/product")
@Tag(name="PRODUCT", description = "PRODUCT API")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	@Autowired
	private FileUtils fileUtils;
	@Autowired
	private JwtUtil jwtUtil;
	
	@Value("${file.root}")
	private String root;
	
	@Operation(summary="제품군 조회", description = "제품군을 받아서 해당 제품군의 정보들을 제품별 메인으로 줌으로써 이용자가 특정 상품을 선택할 수 있도록 함")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value="/category")
	public ResponseEntity<ResponseDTO> productCategory(@RequestBody HashMap<String, String> categoryMap){
		//categoryMap = {"table" : "~~_tbl", "productLine" : "~~"}
		List list = productService.selectProductCategory(categoryMap);
		if(list.size()==0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="시세 차트", description = "선택한 제품 카테고리의 기간 단위별 거래량 및 거래금액을 보여줌")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value="/chart")
	public ResponseEntity<ResponseDTO> productTradeChart(@RequestBody ProductAndTerm obj){
		Product product = obj.getProduct();
		String tempTerm = obj.getTempTerm();
		int term = 0;
		switch (tempTerm) {
		case "3일" : term = 2; break;
		case "6일" : term = 5; break;
		case "9일" : term = 8; break;
		case "12일" :term = 11; break;
		default : break;
		}
		product.setTerm(term);
		List list = productService.productTradeChart(product);
		if(list.size() == 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping(value = "/quality/{tableName}")
	public ResponseEntity<ResponseDTO> selectQualityList(@PathVariable String tableName){
		List list = productService.selectQualityList(tableName);
		
		if(list.size()==0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value = "/iphone")
	public ResponseEntity<ResponseDTO> insertIphone(@ModelAttribute Product product,@ModelAttribute IphoneQualityHistory partObject,
 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
		product.setMemberNo(memberNo);
		
		String savepath = root + "/product/";
		
		//썸네일
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumbnail(filepath);
		}
		
		ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
		if(productFile != null) {
			for(MultipartFile file : productFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ProductFile pf = new ProductFile();
				pf.setFilename(filename);
				pf.setFilepath(filepath);
				fileList.add(pf);
			}	
		}
		
		int result = productService.insertIphone(product,fileList,partObject); 
		
		if(result == 2+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	
	@PostMapping(value = "/macbook")
	public ResponseEntity<ResponseDTO> insertMacbook(@ModelAttribute Product product,@ModelAttribute MacbookQualityHistory partObject,@ModelAttribute MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){

		System.out.println(product);
		System.out.println(partObject);
		//회원번호
		product.setMemberNo(memberNo);
		
		String savepath = root + "/product/";
		
		//썸네일
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumbnail(filepath);
		}
		
		ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
		if(productFile != null) {
			for(MultipartFile file : productFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ProductFile pf = new ProductFile();
				pf.setFilename(filename);
				pf.setFilepath(filepath);
				fileList.add(pf);
			}	
		}
		
		int result = productService.insertMacbook(product,fileList,partObject); 
		
		if(result == 2+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success",  product.getProductNo());
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value = "/ipad")
	public ResponseEntity<ResponseDTO> insertIpad(@ModelAttribute Product product,@ModelAttribute IpadQualityHistory partObject,@ModelAttribute MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){

		System.out.println(product);
		System.out.println(partObject);
		//회원번호
		product.setMemberNo(memberNo);
		
		String savepath = root + "/product/";
		
		//썸네일
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumbnail(filepath);
		}
		
		ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
		if(productFile != null) {
			for(MultipartFile file : productFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ProductFile pf = new ProductFile();
				pf.setFilename(filename);
				pf.setFilepath(filepath);
				fileList.add(pf);
			}	
		}
		
		int result = productService.insertIpad(product,fileList,partObject); 
		
		if(result == 2+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success",  product.getProductNo());
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value = "/watch")
	public ResponseEntity<ResponseDTO> insertWatch(@ModelAttribute Product product,@ModelAttribute WatchQualityHistory partObject,@ModelAttribute MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){

		System.out.println(product);
		System.out.println(partObject);
		//회원번호
		product.setMemberNo(memberNo);
		
		String savepath = root + "/product/";
		
		//썸네일
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumbnail(filepath);
		}
		
		ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
		if(productFile != null) {
			for(MultipartFile file : productFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ProductFile pf = new ProductFile();
				pf.setFilename(filename);
				pf.setFilepath(filepath);
				fileList.add(pf);
			}	
		}
		
		int result = productService.insertWatch(product,fileList,partObject); 
		
		if(result == 2+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success",  product.getProductNo());
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PostMapping(value = "/airpods")
	public ResponseEntity<ResponseDTO> insertAirpods(@ModelAttribute Product product,@ModelAttribute AirpodsQualityHistory partObject,@ModelAttribute MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){

		System.out.println(product);
		System.out.println(partObject);
		//회원번호
		product.setMemberNo(memberNo);
		
		String savepath = root + "/product/";
		
		//썸네일
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumbnail(filepath);
		}
		
		ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
		if(productFile != null) {
			for(MultipartFile file : productFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ProductFile pf = new ProductFile();
				pf.setFilename(filename);
				pf.setFilepath(filepath);
				fileList.add(pf);
			}	
		}
		
		int result = productService.insertAirpods(product,fileList,partObject); 
		
		if(result == 2+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success",  product.getProductNo());
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="좋아요 눌렀는지 체크", description = "로그인 한 이용자가 해당 상품에 좋아요를 눌렀는지를 0 또는 1로 알려줌")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@GetMapping(value="/likeBoolean/{productNo}")
	public ResponseEntity<ResponseDTO> likeBoolean(@PathVariable int productNo, @RequestAttribute int memberNo){
		int likeBoolean = productService.likeBoolean(productNo, memberNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", likeBoolean);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@Operation(summary="판매상품 상세페이지")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@GetMapping(value = "/detail/{productNo}")
	public ResponseEntity<ResponseDTO> selectOneView(@PathVariable int productNo){
		HashMap<String, Object> map = productService.selectOneProduct(productNo);
		/* map.key
		 * product
		 * seller
		 * productFileList
		 * qualityHistory
		 * reliableProductList
		 */
		if(map.size()==5) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="좋아요 추가", description = "상품상세페이지에서 이용자가 그 상품에 대해 좋아요를 추가하지 않은 상태에서 좋아요버튼 클릭시 동작")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value = "/like")
	public ResponseEntity<ResponseDTO> insertLike(@RequestBody Map<String, Integer> map,@RequestAttribute int memberNo){
		int productNo = map.get("productNo");
		int result = productService.insertLike(productNo, memberNo);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="좋아요 삭제", description = "상품상세페이지에서 이용자가 그 상품에 대해 이미 좋아요를 추가한 상태에서 좋아요버튼 클릭시 동작")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@DeleteMapping(value = "/like/{productNo}")
	public ResponseEntity<ResponseDTO> deleteLike(@PathVariable int productNo,@RequestAttribute int memberNo){;
		int result = productService.deleteLike(productNo, memberNo);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="상품 판매글 삭제", description = "판매글 작성자가 해당 글 삭제시 게시물을 숨김처리")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PatchMapping(value = "/hide")
	public ResponseEntity<ResponseDTO> hideProduct(@RequestBody Map<String, Integer> map){
		int productNo = map.get("productNo");
		int result = productService.hideProduct(productNo);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	

//	
	
	@GetMapping(value = "/inquiry/{productNo}")
	public ResponseEntity<ResponseDTO> selectSalesInquiriesList(@PathVariable int productNo, @RequestParam int reqPage){
		Map map = productService.selectSalesInquiriesList(productNo, reqPage);
		System.out.println(map.size());
		if(map.size() == 2) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	
	@PostMapping(value = "/inquiry")
	public ResponseEntity<ResponseDTO> insertSalesInquiries(@RequestBody SalesInquiries salesInquiries , @RequestAttribute int memberNo){
		int result = productService.insertSalesInquiries(salesInquiries,memberNo);
		
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary="매수호가 리스트", description = "매수호가 리스트 불러오기")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@GetMapping(value = "/bid/{productNo}")
	public ResponseEntity<ResponseDTO> productBidList(@PathVariable int productNo){
		List list = productService.productBidList(productNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", list);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@Operation(summary="판매 희망가 수정", description = "상품 상세페이지에서 판매자가 자신의 상품의 판매 희망가를 수정")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PatchMapping(value = "/price")
	public ResponseEntity<ResponseDTO> productPriceUpdate(@RequestBody HashMap<String, Integer> map){
		int productPrice = map.get("productPrice");
		int productNo = map.get("productNo");
		int result = productService.productPriceUpdate(productPrice, productNo);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="판매(거래) 예약", description = "상품 상세페이지에서 판매자가 특정 구매 호가를 승낙하고, 상품은 예약중인 상태로 변경됨")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value = "/trade")
	public ResponseEntity<ResponseDTO> productTradeReserve(@RequestBody Trade trade){
		//trade에 들어있는 값 : #{tradeSeller}, #{tradeBuyer}, #{productNo}, #{tradePrice},
		int result = productService.productTradeReserve(trade);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="구매 호가 등록", description = "상품 상세페이지에서 구매자가 구매호가를 등록")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value = "/bid")
	public ResponseEntity<ResponseDTO> productBidInsert(@RequestBody Bid bid){
		int result = productService.productBidInsert(bid);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="구매 호가 수정", description = "상품 상세페이지에서 구매자가 자신이 등록한 구매 희망가를 수정")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PatchMapping(value = "/bid")
	public ResponseEntity<ResponseDTO> productBidUpdate(@RequestBody Bid bid){
		//bid에 들어있는 값 : bidNo, bidPrice
		int result = productService.productBidUpdate(bid);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@Operation(summary="구매 호가 삭제", description = "상품 상세페이지에서 구매자가 자신이 등록한 구매호가를 삭제")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@DeleteMapping(value = "/bid/{bidNo}")
	public ResponseEntity<ResponseDTO> productBidInsert(@PathVariable int bidNo){
		int result = productService.productBidDelete(bidNo);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping(value = "/review/{productNo}")
	public ResponseEntity<ResponseDTO> selectReviewList(@PathVariable int productNo, @RequestParam int reviewReqPage){
		Map map = productService.selectReviewList(productNo, reviewReqPage);
//		System.out.println(map.size());
		if(map.size() == 2) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	
	@GetMapping(value = "/seller/{productNo}")
	public ResponseEntity<ResponseDTO> selectProductList(@PathVariable int productNo, @RequestParam int sellerProductReqPage){
		Map map = productService.selectProductList(productNo, sellerProductReqPage);
//		System.out.println(map.size());
		if(map.size() == 2) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	
	@PostMapping(value = "/report")
	public ResponseEntity<ResponseDTO> insertReport(@RequestBody Report report,@RequestAttribute int memberNo){
		report.setReportingMember(memberNo);
		
	
		
		int result = productService.insertReport(report);

		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	
	@GetMapping(value = "/search/{tableName}")
	public ResponseEntity<ResponseDTO> selectProductList(@PathVariable String tableName,@RequestParam int reqPage,@RequestParam String searchWord){
		System.out.println("selectProductList");
		Map map = productService.selectProductList(tableName,reqPage,searchWord);
		
		if(map != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	

	@PatchMapping(value = "/iphone")
	public ResponseEntity<ResponseDTO> updateIphone(@ModelAttribute Product product,@ModelAttribute IphoneQualityHistory partObject,
			 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
				product.setMemberNo(memberNo);
				
				String savepath = root + "/product/";
				
				//썸네일
				if(thumbnail != null) {
					String filepath = fileUtils.upload(savepath, thumbnail);
					product.setProductThumbnail(filepath);
				}
				
				ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
				if(productFile != null) {
					for(MultipartFile file : productFile) {
						String filename = file.getOriginalFilename();
						String filepath = fileUtils.upload(savepath, file);
						ProductFile pf = new ProductFile();
						pf.setFilename(filename);
						pf.setFilepath(filepath);
						fileList.add(pf);
					}	
				}
				
				int result = productService.updateIphone(product,fileList,partObject); 
				
				System.out.println(result);
				
				if(result == 2+fileList.size()) {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
					
				}else {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
				}
	}
	
	@PatchMapping(value = "/macbook")
	public ResponseEntity<ResponseDTO> updateIphone(@ModelAttribute Product product,@ModelAttribute MacbookQualityHistory partObject,
			 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
				product.setMemberNo(memberNo);
				
				String savepath = root + "/product/";
				
				//썸네일
				if(thumbnail != null) {
					String filepath = fileUtils.upload(savepath, thumbnail);
					product.setProductThumbnail(filepath);
				}
				
				ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
				if(productFile != null) {
					for(MultipartFile file : productFile) {
						String filename = file.getOriginalFilename();
						String filepath = fileUtils.upload(savepath, file);
						ProductFile pf = new ProductFile();
						pf.setFilename(filename);
						pf.setFilepath(filepath);
						fileList.add(pf);
					}	
				}
				
				int result = productService.updateMacbook(product,fileList,partObject); 
				
				System.out.println(result);
				
				if(result == 2+fileList.size()) {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
					
				}else {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
				}
	}
	
	@PatchMapping(value = "/ipad")
	public ResponseEntity<ResponseDTO> updateIphone(@ModelAttribute Product product,@ModelAttribute IpadQualityHistory partObject,
			 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
				product.setMemberNo(memberNo);
				
				String savepath = root + "/product/";
				
				//썸네일
				if(thumbnail != null) {
					String filepath = fileUtils.upload(savepath, thumbnail);
					product.setProductThumbnail(filepath);
				}
				
				ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
				if(productFile != null) {
					for(MultipartFile file : productFile) {
						String filename = file.getOriginalFilename();
						String filepath = fileUtils.upload(savepath, file);
						ProductFile pf = new ProductFile();
						pf.setFilename(filename);
						pf.setFilepath(filepath);
						fileList.add(pf);
					}	
				}
				
				int result = productService.updateIpad(product,fileList,partObject); 
				
				System.out.println(result);
				
				if(result == 2+fileList.size()) {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
					
				}else {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
				}
	}
	
	@PatchMapping(value = "/watch")
	public ResponseEntity<ResponseDTO> updateIphone(@ModelAttribute Product product,@ModelAttribute WatchQualityHistory partObject,
			 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
				product.setMemberNo(memberNo);
				
				String savepath = root + "/product/";
				
				//썸네일
				if(thumbnail != null) {
					String filepath = fileUtils.upload(savepath, thumbnail);
					product.setProductThumbnail(filepath);
				}
				
				ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
				if(productFile != null) {
					for(MultipartFile file : productFile) {
						String filename = file.getOriginalFilename();
						String filepath = fileUtils.upload(savepath, file);
						ProductFile pf = new ProductFile();
						pf.setFilename(filename);
						pf.setFilepath(filepath);
						fileList.add(pf);
					}	
				}
				
				int result = productService.updateWatch(product,fileList,partObject); 
				
				System.out.println(result);
				
				if(result == 2+fileList.size()) {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
					
				}else {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
				}
	}
	
	@PatchMapping(value = "/airpods")
	public ResponseEntity<ResponseDTO> updateIphone(@ModelAttribute Product product,@ModelAttribute AirpodsQualityHistory partObject,
			 MultipartFile thumbnail,@ModelAttribute MultipartFile[] productFile,@RequestAttribute int memberNo){
		//회원번호
				product.setMemberNo(memberNo);
				
				String savepath = root + "/product/";
				
				//썸네일
				if(thumbnail != null) {
					String filepath = fileUtils.upload(savepath, thumbnail);
					product.setProductThumbnail(filepath);
				}
				
				ArrayList<ProductFile> fileList = new ArrayList<ProductFile>();
				if(productFile != null) {
					for(MultipartFile file : productFile) {
						String filename = file.getOriginalFilename();
						String filepath = fileUtils.upload(savepath, file);
						ProductFile pf = new ProductFile();
						pf.setFilename(filename);
						pf.setFilepath(filepath);
						fileList.add(pf);
					}	
				}
				
				int result = productService.updateAirpods(product,fileList,partObject); 
				
				System.out.println(result);
				
				if(result == 2+fileList.size()) {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product.getProductNo());
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
					
				}else {
					ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
					return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
				}
			}

	@Operation(summary="선택된 제품유형의 리스트", description = "제품별 메인페이지에서 이용자가 선택한 제품 카테고리에 부합하는 리스트를 출력")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버 에러 발생")
	})
	@PostMapping(value = "/mainList")
	public ResponseEntity<ResponseDTO> selectProductMainList(@RequestBody Product obj){
		//거래상태 상관 없이 "전체"검색 : obj.tradeState="전체"
		//판매중인 상품만 검색 : obj.tradeState = null
		Product product = obj;
		int reqPage = obj.getReqPage();
		HashMap<String, Object> map = productService.productMainList(product,reqPage);
		
		if(map != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}	
	}
	
}
