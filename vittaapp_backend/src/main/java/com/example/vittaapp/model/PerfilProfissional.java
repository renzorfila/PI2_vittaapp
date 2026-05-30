package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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

    private String experiencia;

    @Column(name = "forma_atendimento")
    private String formaAtendimento;

    @Column(name = "valor_por_sessao")
    private Double valorPorSessao;

    @Column(name = "avaliacao_media")
    private Double avaliacaoMedia;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // Relacionamento com Usuario (dono do perfil)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Área de atuação (mantido como texto para evitar dependência ausente)
    @Column(name = "area_atuacao")
    private String areaAtuacao;

    // Galeria de imagens do perfil
    // mappedBy = nome do campo "perfil" dentro de PerfilImage
    // cascade = quando salvar/deletar o perfil, faz o mesmo nas imagens
    @OneToMany(mappedBy = "perfil", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<PerfilImage> imagens;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.avaliacaoMedia == null) this.avaliacaoMedia = 0.0;
    }
}
