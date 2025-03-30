package com.senvu.DongYanWang.user.service.impl;

import com.senvu.DongYanWang.common.pojo.User;
import com.senvu.DongYanWang.user.repository.UserRepository;
import com.senvu.DongYanWang.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public void insertUser(User user) {
        userRepository.save(user);
    }

}
