package com.senvu.DongYanWang.common.Result;

import lombok.Data;

@Data
public class Result {

    public static final Integer SUCCESS = 200;
    public static final Integer FAILED = 500;

    Integer code;
    String message;
    Object data;

    public Result() {

    }

    public Result(Integer code) {
        this.code = code;
    }

    public Result(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Result(Integer code, Object data) {
        this.code = code;
        this.data = data;
    }

    public Result(Integer code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功
     * @return
     */
    public static Result ok () {
        return new Result(SUCCESS);
    }

    public static Result ok (Object data) {
        return new Result(SUCCESS, data);
    }

    /**
     * 失败
     * @return
     */
    public static Result failed () {
        return new Result(FAILED);
    }

    public static Result failed (String message) {
        return new Result(FAILED,message);
    }

}
