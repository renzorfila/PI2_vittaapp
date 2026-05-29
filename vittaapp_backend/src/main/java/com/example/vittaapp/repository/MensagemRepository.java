package com.example.vittaapp.repository;

import com.example.vittaapp.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query(""" 
        SELECT m FROM Mensagem m
        WHERE (m.remetente.id = :idA AND m.destinatario.id = :idB)
           OR (m.remetente.id = :idB AND m.destinatario.id = :idA)
        ORDER BY m.criadoEm ASC
    """)
    List<Mensagem> findConversa(@Param("idA") Long idA, @Param("idB") Long idB);

    long countByDestinatarioIdAndLidaFalse(Long destinatarioId);
}