package kr.or.iei.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret}")
	private String secret;
	
	public String createToken(int memberNo, long expiredDateMs) {
		
		
		//토큰 만들기
		Claims claims = Jwts.claims(); //누구 id 인지 저장 (회원 식별)
		claims.put("memberNo",memberNo); //회원 아이디 불러와서 저장 (회원 식별)
		
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());  //문자열 비밀번호를 이용해서 암호화코드 생성
		
		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(new Date(System.currentTimeMillis())) //인증 시작 시간
				.setExpiration(new Date(System.currentTimeMillis()+expiredDateMs)) //인증 만료 시간(현재시간 + 1시간(내가 지정한 시간) )
				.signWith(key,SignatureAlgorithm.HS256) //암호화할 때 사용할 키값 및 알고리즘
				.compact(); //위 내용 종합해서 JWT 토큰 생성
		
		
	}
	
	
	
	//매개변수로 토큰이 만료되었는지 체크
	public boolean isExpired(String token) {
		
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		
		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody().getExpiration().before(new Date());
		
		
	}
	
	public int getMemberNo(String token) {
		
		
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		
		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody().get("memberNo",Integer.class);
				
		
	}
	
	
	

}





