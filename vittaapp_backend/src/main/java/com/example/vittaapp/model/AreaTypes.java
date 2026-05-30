package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "area_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaTypes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome da categoria pai (ex: "Esportes", "Saúde", "Bem-estar")
    @Column(nullable = false, unique = true)
    private String nome;
}
