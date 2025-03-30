package com.senvu.DongYanWang.common.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users") // 指定集合名称
public class User {
    @Id
    private String id;
    private String name;
    private int age;
    private String email;
}
