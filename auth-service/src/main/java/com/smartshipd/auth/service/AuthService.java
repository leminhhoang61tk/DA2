package com.smartshipd.auth.service;

import com.smartshipd.auth.entity.UserEntity;
import com.smartshipd.auth.repository.UserRepository;
import com.smartshipd.common.dto.AuthRequest;
import com.smartshipd.common.dto.AuthResponse;
import com.smartshipd.common.dto.UserRegistrationRequest;
import com.smartshipd.common.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        if (request.getPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }
        
        boolean hasLetter = request.getPassword().matches(".*[a-zA-Z].*");
        boolean hasDigit = request.getPassword().matches(".*\\d.*");
        
        if (!hasLetter || !hasDigit) {
            throw new RuntimeException("Password must contain at least one letter and one number");
        }
        
        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserEntity.UserRole.USER);
        
        UserEntity savedUser = userRepository.save(user);
        
        String token = JwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().toString(),
                savedUser.getUserId()
        );
        
        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().toString()
        );
    }
    
    public AuthResponse login(AuthRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        String token = JwtUtil.generateToken(
                user.getEmail(),
                user.getRole().toString(),
                user.getUserId()
        );
        
        return new AuthResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString()
        );
    }
}