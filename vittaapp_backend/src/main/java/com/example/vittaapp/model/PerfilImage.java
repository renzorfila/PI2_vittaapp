package com.example.vittaapp.model;

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

    // Caminho ou URL da imagem armazenada
    @Column(nullable = false)
    private String imagem;

    // Define a ordem de exibição na galeria (0 = foto principal)
    @Column(nullable = false)
    private Integer ordem;

    // Perfil ao qual esta imagem pertence
    @ManyToOne
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilProfissional perfil;
}
