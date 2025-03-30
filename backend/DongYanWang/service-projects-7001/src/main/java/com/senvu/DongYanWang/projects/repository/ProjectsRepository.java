package com.senvu.DongYanWang.projects.repository;

import com.senvu.DongYanWang.common.pojo.Projects;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectsRepository extends MongoRepository<Projects, String> {


    List<Projects> findProjectsById(String id);
}
