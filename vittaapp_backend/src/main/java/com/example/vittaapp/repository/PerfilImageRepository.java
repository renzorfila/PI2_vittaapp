package com.example.vittaapp.repository;

import com.example.vittaapp.model.PerfilImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerfilImageRepository extends JpaRepository<PerfilImage, Long> {
    List<PerfilImage> findByPerfilIdOrderByOrdemAsc(Long perfilId);
    void deleteByPerfilId(Long perfilId);
}
