package kr.or.iei;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailSender {

	@Autowired
	private JavaMailSender sender;

	public String sendCode(String memberEmail) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 5; i++) {
			int flag = r.nextInt(3);
			if (flag == 0) {
				int randomCode = r.nextInt(10);
				sb.append(randomCode);
			} else if (flag == 1) {
				char randomCode = (char) (r.nextInt(26) + 65);
				sb.append(randomCode);
			} else if (flag == 2) {
				char randomCode = (char) (r.nextInt(26) + 97);
				sb.append(randomCode);
			}
		}

		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("unofficialhyokyung@gmail.com", "AppleFarm"));
			helper.setTo(memberEmail);
			helper.setSubject("AppleFarm 이메일 인증");
			helper.setText("<h1>AppleFarm 이메일 인증 안내</h1>" + "<h3>인증번호는 [<span style='color:#4389BA;'>" + sb.toString()
					+ "</span>]입니다</h3>", true);
			sender.send(message);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		}
		if (sb == null) {
			return null;
		} else {
			return sb.toString();
		}
	}

	public String sendId(String memberEmail, String memberId) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		StringBuffer sb = new StringBuffer();
		

		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("unofficialhyokyung@gmail.com", "AppleFarm"));
			helper.setTo(memberEmail);
			helper.setSubject("AppleFarm 아이디 찾기");
			helper.setText("<h1>AppleFarm 아이디 찾기 안내</h1>" + "<h3>회원님의 아이디는 [<span style='color:#4389BA;'>" + memberId
					+ "</span>]입니다</h3>", true);
			sender.send(message);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		}
		if (sb == null) {
			return null;
		} else {
			return sb.toString();
		}
		
	}
}