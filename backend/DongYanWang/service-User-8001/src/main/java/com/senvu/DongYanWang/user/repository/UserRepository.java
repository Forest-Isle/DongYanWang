package com.senvu.DongYanWang.user.repository;

import com.senvu.DongYanWang.common.pojo.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

}
