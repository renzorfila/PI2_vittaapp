package com.example.vittaapp.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.vittaapp.model.PerfilProfissional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<PerfilProfissional, Long> {

    // SELECT * FROM perfis WHERE area = ?
    List<PerfilProfissional> findByAreaAtuacao(String areaAtuacao);

    // SELECT * FROM perfis WHERE titulo LIKE %?% (case insensitive)
    List<PerfilProfissional> findByTituloContainingIgnoreCase(String q);

    // SELECT * FROM perfis WHERE cidade = ?
    List<PerfilProfissional> findByCidade(String cidade);

    // SELECT * FROM perfis WHERE area = ? AND cidade = ?
    List<PerfilProfissional> findByAreaAtuacaoAndCidade(String areaAtuacao, String cidade);

    // SELECT * FROM perfis WHERE usuario_id = ?
    Optional<PerfilProfissional> findByUsuarioId(Long usuarioId);


}
