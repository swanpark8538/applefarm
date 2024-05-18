package kr.or.iei.util;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import kr.or.iei.member.model.dto.Member;




@Aspect
@Component
public class PasswordEncAdvice {
	
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder; 
	
	//비밀번호 암호화
	

	
	//적용할 메소드
	@Pointcut(value="execution (int kr.or.iei.member.model.service.MemberService.updatePw(kr.or.iei.member.model.dto.Member)) || execution (int kr.or.iei.member.model.service.MemberService.join(kr.or.iei.member.model.dto.Member)) || execution (int kr.or.iei.member.model.service.MemberService.resetPw(kr.or.iei.member.model.dto.Member))")
	public void pwEncPointcut(){} 
	
	//위에 메소드 시작하기 전에(before) 실행
	
	@Before(value="pwEncPointcut()")
	public void pwEncAdvice(JoinPoint jp) {
		
		Object[] args = jp.getArgs();
		
		Member member = (Member)args[0]; 
		String encPw = bCryptPasswordEncoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		
	}
	

	

}






