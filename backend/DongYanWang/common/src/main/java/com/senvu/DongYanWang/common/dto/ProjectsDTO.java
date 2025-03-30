package com.senvu.DongYanWang.common.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectsDTO {

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

}
