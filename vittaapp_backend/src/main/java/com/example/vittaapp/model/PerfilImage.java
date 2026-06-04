package com.example.vittaapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "perfil_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imagem;

    @Column(nullable = false)
    private Integer ordem;

    // @JsonIgnore quebra o loop infinito:
    // PerfilProfissional → imagens → perfil → imagens → perfil → ...
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilProfissional perfil;
}