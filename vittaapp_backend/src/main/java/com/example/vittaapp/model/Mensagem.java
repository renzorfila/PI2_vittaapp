package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quem enviou
    @ManyToOne
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    // Quem recebe
    @ManyToOne
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    // false = não lida, true = lida
    @Column(nullable = false)
    @Builder.Default
    private Boolean lida = false;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.lida == null) this.lida = false;
    }
}