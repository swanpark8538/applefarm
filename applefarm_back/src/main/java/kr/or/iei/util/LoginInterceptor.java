package kr.or.iei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor{

	@Autowired
	private JwtUtil jwtUtil;
	
	//컨트롤러 동작 전에 토큰에서 아이디 추출후 컨트롤에서 사용할 수 있도록 등록
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		//로그인 성공 시 헤어뎅서 인증 토큰 꺼냄
		String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
		System.out.println("헤더에서 꺼낸 정보 :"+auth);
		
		if(auth == null || auth.indexOf("null") != -1 || !auth.startsWith("Bearer ")) {
			System.out.println("인증 없고, 잘못됨");
			return false; //인증이 없거나 잘못된 경우이므로 이후 컨트롤러 실행 X 
			
		}
		
		//인증 코드 값은 형식에 맞는 상태(인증시간 만료됐는지 확인필요)
		String token = auth.split(" ")[1]; 
		if(jwtUtil.isExpired(token)) {
			System.out.println("인증시간 만료된 경우");
			return false;
			
		}
		
		//인증 정보 정상, 만료되기 전 상태 -> 정상요청 -> 이후 컨트롤러에서 로그인한 회원 아이디를 사용할 수 있도록 아이디를 추출해서 등록
		int memberNo = jwtUtil.getMemberNo(token);
		request.setAttribute("memberNo", memberNo);
		return true;
		
		
		
		
		
				
		
	}
	
	
	
	
	
	
	
	
	
	

}
