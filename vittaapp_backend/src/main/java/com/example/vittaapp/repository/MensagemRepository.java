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

    long countByRemetenteIdAndDestinatarioIdAndLidaFalse(
    Long remetenteId,
    Long destinatarioId
);

    // Última mensagem por par de usuários envolvendo :meId
    @Query("""
        SELECT m
        FROM Mensagem m
        WHERE m.id IN (
            SELECT MAX(m2.id)
            FROM Mensagem m2
            WHERE (m2.remetente.id = :meId AND m2.destinatario.id IN (
                SELECT u.id FROM Usuario u WHERE u.tipo = 'PROFISSIONAL'
            ))
               OR (m2.destinatario.id = :meId AND m2.remetente.id IN (
                SELECT u.id FROM Usuario u WHERE u.tipo = 'PROFISSIONAL'
            ))
            GROUP BY 
                CASE 
                    WHEN m2.remetente.id = :meId THEN m2.destinatario.id
                    ELSE m2.remetente.id
                END
        )
        ORDER BY m.criadoEm DESC
    """)
    List<Mensagem> findUltimasMensagensInboxProfissionais(@Param("meId") Long meId);
}

