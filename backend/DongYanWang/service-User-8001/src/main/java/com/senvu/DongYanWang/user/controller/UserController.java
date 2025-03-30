package com.senvu.DongYanWang.user.controller;

import com.senvu.DongYanWang.common.Result.Result;
import com.senvu.DongYanWang.common.pojo.User;
import com.senvu.DongYanWang.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("test")
    public String test() {
        return "Test Success!!!";
    }

    @PostMapping("create")
    public Result create() {
        User user = new User();
        user.setAge(18);
        user.setName("小明");
        user.setEmail("dongyanwang@gmail.com");
        userService.insertUser(user);
        return new Result(Result.SUCCESS);
    }
}
