package com.transportmanagement.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.transportmanagement.entity.ClientBranch;

@Repository
public interface ClientBranchDao extends JpaRepository<ClientBranch, Integer> {
    // Custom query methods (if any) can be added here
}