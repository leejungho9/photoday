package com.photoday.photoday.security.service;

import com.photoday.photoday.user.entity.User;

import java.util.Optional;

public interface AuthUserService {
    Long getLoginUserId();

    Long checkLogin();

    String getLoginUserEmail();

    Optional<User> getLoginUser();

    void setNewPassword(String email);
}
