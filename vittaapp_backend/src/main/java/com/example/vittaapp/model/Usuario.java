package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    // Enum correto — não é String, não é null
    public enum Tipo { ALUNO, PROFISSIONAL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "LONGTEXT")
    private String foto;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    // Campo tipo — substitui temPerfilProfissional
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Tipo tipo = Tipo.ALUNO;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.ativo == null) this.ativo = true;
        if (this.tipo  == null) this.tipo  = Tipo.ALUNO;
    }
}
