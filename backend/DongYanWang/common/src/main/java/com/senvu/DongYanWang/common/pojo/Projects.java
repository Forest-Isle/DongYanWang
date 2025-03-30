package com.senvu.DongYanWang.common.pojo;

import lombok.Data;
import org.springframework.data.mongodb.core.annotation.Collation;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "projects")
public class Projects {

    public String id;
    public String title;
    public String professor;
    public String school;
    public String department;
    public String category;
    public String duration;
    public String deadline;
    public String requirements;
    public String description;
    public List<String> tags;
    public String applicants;
    public String maxApplicants;
    public String views;
    public String likes;
    public String comments;
    public Double professorRating;
    public String image;
    public LocalDateTime createTime;
    public LocalDateTime updateTime;

}
