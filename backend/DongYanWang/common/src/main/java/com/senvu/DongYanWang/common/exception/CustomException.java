package com.senvu.DongYanWang.common.exception;

import org.springframework.stereotype.Component;

public class CustomException extends RuntimeException {

    public CustomException(String message) {
        super(message);
    }
}
