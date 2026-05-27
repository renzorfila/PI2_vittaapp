package com.example.vittaapp.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
// Lombok: gera getters, setters, equals, hashCode e toString
@Data
// Lombok: gera construtor sem argumentos (obrigatório no JPA)
@NoArgsConstructor
// Lombok: gera construtor com todos os argumentos
@AllArgsConstructor
// Lombok: habilita o padrão Builder (Usuario.builder().nome("...").build())
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nullable = false significa NOT NULL no banco
    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    // Guardamos a senha já com hash (nunca salvar senha pura!)
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    // Indica se o usuário já criou um perfil de profissional
    @Builder.Default
    @Column(name = "tem_perfil_profissional")
    private Boolean temPerfilProfissional = false;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // @PrePersist = executa antes de salvar no banco pela primeira vez
    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.temPerfilProfissional == null) {
            this.temPerfilProfissional = false;
        }
    }
}