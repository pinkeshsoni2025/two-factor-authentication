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
import java.util.Optional;

@RestController
@RequestMapping("/2fa")
public class TOTPController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/users")
    public @ResponseBody
    User createUser(@RequestBody User user) {
    	user.setSecret(userService.createSecret());
        User savedUser = userService.createUser(user);
        //savedUser.setPassword("");
        return savedUser;
    }
    
    @PostMapping(value = "/updateprofile/{username}")
    public  ResponseEntity<?> updateUser(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        Optional<User> existUser = userService.findByUsername(userName);
        JSONObject json = new JSONObject(requestJson);
        
        if(existUser.isPresent()) {
        	existUser.get().setFullname(json.getString("fullname"));
        	//User savedUser = userService.createUser(existUser.get());
        	User savedUser = userRepository.save(existUser.get());
            //savedUser.setPassword("");
            return ResponseEntity.ok(savedUser);
        }
        else {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username.");
        }
    	
    }
    
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody User user) {
    	
    	boolean isLogin = userService.isLoginUser(user);
        //savedUser.setPassword("");
        if(isLogin) {
        	return ResponseEntity.ok(userService.findByUsername(user.getUsername()));
        }else { 
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username and password.");
        }
    }
    
    @PostMapping(value = "/changepassword/{username}")
    public ResponseEntity<?> changePassword(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        JSONObject json = new JSONObject(requestJson);
        
        User user = new User();
        user.setPassword(json.getString("password"));
        user.setUsername(userName);
        
        boolean isLogin = userService.isLoginUser(user);
        
        if(isLogin) {
        	User existUser = userService.findByUsername(user.getUsername()).get();
        	existUser.setPassword(json.getString("new_password"));
        	User savedUser = userService.createUser(existUser);
            //savedUser.setPassword("");
            return ResponseEntity.ok(savedUser);
        	
        }else { 
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password.");
        }
        
        //return userService.validateTotp(userName, Integer.parseInt(json.getString("totpKey")));
    }

    @GetMapping(value = "/qrcode/get/{username}")
    public String generateQRCode(@PathVariable("username") String userName) throws Throwable {
        String otpProtocol = userService.generateOTPProtocol(userName);
        System.out.println(otpProtocol);
        return userService.generateQRCode(otpProtocol);
    }

    @PostMapping(value = "/qrcode/validate/{username}")
    public boolean validateTotp(@PathVariable("username") String userName, @Valid @RequestBody String requestJson) {
        JSONObject json = new JSONObject(requestJson);
        return userService.validateTotp(userName, Integer.parseInt(json.getString("totpKey")));
    }

}
