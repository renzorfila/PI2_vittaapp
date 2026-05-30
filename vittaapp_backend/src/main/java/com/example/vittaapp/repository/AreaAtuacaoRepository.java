package com.example.vittaapp.repository;

import com.example.vittaapp.model.AreaAtuacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AreaAtuacaoRepository extends JpaRepository<AreaAtuacao, Long> {
    boolean existsByNome(String nome);
    List<AreaAtuacao> findByTipoId(Long tipoId);
}
