package com.jmendoza.springboot.twofa.repository;

import com.jmendoza.springboot.twofa.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByUsername(String username);
}
