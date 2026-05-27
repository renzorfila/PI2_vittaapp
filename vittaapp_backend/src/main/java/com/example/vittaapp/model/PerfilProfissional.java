package com.example.vittaapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "perfil_profissional")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilProfissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;
    private String cidade;
    private String area;
    private String experiencia;

    @Column(name = "valor_por_sessao")
    private Double valorPorSessao;

    @Column(name= "forma_atendimento")
    private String formaAtendimento;

    @Column(name= "avaliacao_media")
    private Double avaliacaoMedia;

    @Column(name= "criado_em")
    private LocalDateTime criadoEm;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();   
        if (this.avaliacaoMedia == null) this.avaliacaoMedia = 0.0;

    }
      

}
