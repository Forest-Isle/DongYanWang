package com.senvu.DongYanWang.common.exception;

import com.senvu.DongYanWang.common.Result.Result;
import org.springframework.web.bind.annotation.RestController;

public class ExceptionHandler {

    private CustomException customException;

    void display(String message) {
        throw new CustomException(message);
    }

}
