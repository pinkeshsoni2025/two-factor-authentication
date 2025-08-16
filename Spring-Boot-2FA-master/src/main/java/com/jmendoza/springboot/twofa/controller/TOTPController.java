package com.jmendoza.springboot.twofa.controller;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.jmendoza.springboot.twofa.model.User;
import com.jmendoza.springboot.twofa.repository.UserRepository;
import com.jmendoza.springboot.twofa.security.TOTPAuthenticator;
import com.jmendoza.springboot.twofa.service.UserService;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/2fa")
public class TOTPController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    private HashMap<String, String> ErrorMessage(String message) {
    	HashMap<String, String> hashError = new HashMap<String, String>();
    	hashError.put("message",message);
    	return hashError;
    }

    @PostMapping(value = "/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
    	Optional<User> userExist = userService.findByUsername(user.getUsername());
    	
    	if(!userExist.isPresent()) {
    		user.setSecret(userService.createSecret());
        	LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        	user.setCreatedAt(now);
        	user.setCreatedBy(user.getUsername());
            User savedUser = userService.createUser(user);
            //savedUser.setPassword("");
            HashMap<String, User> hashUser = new HashMap<String, User>();
        	hashUser.put("data",savedUser);
        	return ResponseEntity.ok(hashUser);
    	}else {
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("User already exist"));
    	}
    }
    
    private User SetUpdatedUserField(String username, User user) {
    	LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
    	user.setUpdatedBy(username);
    	user.setUpdatedAt(now);
    	
    	return user;
    }
    
    @PostMapping(value = "/updateprofile/{username}")
    public  ResponseEntity<?> updateUser(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        Optional<User> existUser = userService.findByUsername(userName);
        JSONObject json = new JSONObject(requestJson);
        
        if(existUser.isPresent()) {
        	existUser.get().setFullname(json.getString("fullname"));
        	//User savedUser = userService.createUser(existUser.get());
        	
        	existUser.get().setBio(json.getString("bio"));
        	
        	SetUpdatedUserField(userName, existUser.get());
        	User savedUser = userRepository.save(existUser.get());
            //savedUser.setPassword("");
            HashMap<String, User> hashUser = new HashMap<String, User>();
        	hashUser.put("data",savedUser);
        	return ResponseEntity.ok(hashUser);
        }
        else {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("Invalid username."));
        }
    	
    }
    
    private User get() {
		// TODO Auto-generated method stub
		return null;
	}

	@PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody User user) {
    	
    	boolean isLogin = userService.isLoginUser(user);
        //savedUser.setPassword("");
        if(isLogin) {
        	HashMap<String, User> hashUser = new HashMap<String, User>();
        	hashUser.put("data",userService.findByUsername(user.getUsername()).get());
        	return ResponseEntity.ok(hashUser);
        }else { 
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("Invalid username and password."));
        }
    }
    
    @PostMapping(value = "/changepassword/{username}")
    public ResponseEntity<?> changePassword(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        JSONObject json = new JSONObject(requestJson);
 
        User user = new User();
        user.setPassword(json.getString("password"));
        SetUpdatedUserField(userName,user);
        user.setUsername(userName);
        
        boolean isLogin = userService.isLoginUser(user);
        
        if(isLogin) {
        	User existUser = userService.findByUsername(user.getUsername()).get();
        	existUser.setPassword(json.getString("new_password"));
        	User savedUser = userService.createUser(existUser);
            //savedUser.setPassword("");
        	HashMap<String, User> hashUser = new HashMap<String, User>();
        	hashUser.put("data",savedUser);
        	return ResponseEntity.ok(hashUser);
        	
        }else { 
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("Invalid crrent password."));
        }
        
        //return userService.validateTotp(userName, Integer.parseInt(json.getString("totpKey")));
    }

    @GetMapping(value = "/qrcode/get/{username}")
    public ResponseEntity<?> generateQRCode(@PathVariable("username") String userName) throws Throwable {
        String otpProtocol = userService.generateOTPProtocol(userName);
        System.out.println(otpProtocol);
        String url =  userService.generateQRCode(otpProtocol);
        HashMap<String, String> hashUser = new HashMap<String,  String>();
    	hashUser.put("data",url);
    	return ResponseEntity.ok(hashUser);
    }

    @PostMapping(value = "/qrcode/validate/{username}")
    public boolean validateTotp(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        JSONObject json = new JSONObject(requestJson);
        return userService.validateTotp(userName, Integer.parseInt(json.getString("totpKey")));
    }
    
    @PostMapping(value = "/mfa/{username}")
    public  ResponseEntity<?> updateMFA(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        Optional<User> existUser = userService.findByUsername(userName);
        JSONObject json = new JSONObject(requestJson);
        
        if(existUser.isPresent()) {
        	
        	if(existUser.get().getMfa() != Boolean.valueOf(json.getString("mfa"))) {
        		existUser.get().setMfa(Boolean.valueOf(json.getString("mfa")));
        	}else {
        		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("MFA already Updated"));
           
        	}
        	SetUpdatedUserField(userName, existUser.get());
        	User savedUser = userRepository.save(existUser.get());
            //savedUser.setPassword("");
        	HashMap<String, User> hashUser = new HashMap<String, User>();
        	hashUser.put("data",savedUser);
        	return ResponseEntity.ok(hashUser);
        }
        else {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorMessage("Invalid username."));
        }
    	
    }

}
