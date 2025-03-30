package com.senvu.DongYanWang.projects.service.impl;

import com.senvu.DongYanWang.common.dto.ProjectsDTO;
import com.senvu.DongYanWang.common.pojo.Projects;
import com.senvu.DongYanWang.common.vo.ProjectsVO;
import com.senvu.DongYanWang.projects.repository.ProjectsRepository;
import com.senvu.DongYanWang.projects.service.ProjectsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectsServiceImpl implements ProjectsService {

    @Autowired
    private ProjectsRepository projectsRepository;

    /**
     * 根据id查询projects
     * @param id
     * @return
     */
    @Override
    public ProjectsVO getProjectsByID(String id) {
        List<Projects> projectsById = projectsRepository.findProjectsById(id);
        ProjectsVO projectsVO = new ProjectsVO();
        if (projectsById.isEmpty() || projectsById == null) {
            return projectsVO;
        }
        Projects projects = projectsById.get(0);
        BeanUtils.copyProperties(projects, projectsVO);
        return projectsVO;
    }

    @Override
    public void insertProjects(ProjectsDTO dto) {
        Projects projects = new Projects();
        BeanUtils.copyProperties(dto, projects);
        LocalDateTime time = LocalDateTime.now();
        projects.setCreateTime(time);
        projects.setUpdateTime(time);
        projectsRepository.insert(projects);
    }

}
