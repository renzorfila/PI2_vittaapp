package com.example.vittaapp.repository;

import com.example.vittaapp.model.AreaTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaTypesRepository extends JpaRepository<AreaTypes, Long> {
    boolean existsByNome(String nome);
}
