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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    // Campos adicionados conforme o diagrama
    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    @Builder.Default
    @Column(name = "super_usuario")
    private Boolean superUsuario = false;

    // Staff = funcionário da plataforma (pode moderar conteúdo)
    @Builder.Default
    private Boolean staff = false;

    @Builder.Default
    @Column(name = "tem_perfil_profissional")
    private Boolean temPerfilProfissional = false;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.ativo == null)               this.ativo = true;
        if (this.superUsuario == null)        this.superUsuario = false;
        if (this.staff == null)               this.staff = false;
        if (this.temPerfilProfissional == null) this.temPerfilProfissional = false;
    }
}
