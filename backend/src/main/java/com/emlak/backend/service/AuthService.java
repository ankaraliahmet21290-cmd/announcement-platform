package com.emlak.backend.service;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.dto.auth.AuthResponse;
import com.emlak.backend.dto.auth.LoginRequest;
import com.emlak.backend.dto.auth.UpdateProfileRequest;
import com.emlak.backend.dto.auth.UserProfileResponse;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.security.JwtTokenProvider;
import com.emlak.backend.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        AppUser user = appUserRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .tenantId(user.getTenant() != null ? user.getTenant().getId() : null)
                .tenantSlug(user.getTenant() != null ? user.getTenant().getSlug() : null)
                .tenantName(user.getTenant() != null ? user.getTenant().getName() : null)
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UserPrincipal principal) {
        AppUser user = appUserRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .whatsapp(user.getWhatsapp())
                .role(user.getRole())
                .photoUrl(user.getPhotoUrl())
                .tenantId(user.getTenant() != null ? user.getTenant().getId() : null)
                .tenantName(user.getTenant() != null ? user.getTenant().getName() : null)
                .tenantSlug(user.getTenant() != null ? user.getTenant().getSlug() : null)
                .build();
    }

    @Transactional
    public UserProfileResponse updateProfile(UserPrincipal principal, UpdateProfileRequest request) {
        AppUser user = appUserRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getWhatsapp() != null) {
            user.setWhatsapp(request.getWhatsapp());
        }
        if (request.getPhotoUrl() != null) {
            user.setPhotoUrl(request.getPhotoUrl());
        }
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = appUserRepository.save(user);

        return getCurrentUserProfile(principal);
    }
}
