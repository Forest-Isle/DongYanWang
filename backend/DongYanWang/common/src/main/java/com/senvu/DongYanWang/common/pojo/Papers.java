package com.senvu.DongYanWang.common.pojo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "pages")
public class Papers {
    @Id
    public String id;
    public String title;
    public String authors;
    public String journal;
    public LocalDate publishDate;
    public Integer citations;
    public String field;
    public String subField;
    public Double impactFactor;
    public String summary;
}
