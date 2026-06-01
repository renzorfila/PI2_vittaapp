package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "areas_atuacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaAtuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;
    private String descricao;
    private String categoria;
}