package com.senvu.DongYanWang.projects.service;

import com.senvu.DongYanWang.common.dto.ProjectsDTO;
import com.senvu.DongYanWang.common.vo.ProjectsVO;

public interface ProjectsService {

    /**
     * 根据id查询projects
     * @param id
     * @return
     */
    ProjectsVO getProjectsByID(String id);

    void insertProjects(ProjectsDTO dto);
}
