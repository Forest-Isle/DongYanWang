package com.senvu.DongYanWang.projects.controller;

import com.senvu.DongYanWang.common.Result.Result;
import com.senvu.DongYanWang.common.dto.ProjectsDTO;
import com.senvu.DongYanWang.common.vo.ProjectsVO;
import com.senvu.DongYanWang.projects.service.ProjectsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("projects")
public class ProjectsController {

    @Autowired
    private ProjectsService projectsService;

    @GetMapping
    public Result getProjectsByID(String id) {
        ProjectsVO vo = projectsService.getProjectsByID(id);
        return Result.ok(vo);
    }

    @PostMapping
    public Result insertProjects(@RequestBody ProjectsDTO dto) {
        projectsService.insertProjects(dto);
        return Result.ok();
    }

}
