package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @OneToOne = um pagamento para um agendamento
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private Double valor;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PagamentoStatus status = PagamentoStatus.PENDENTE;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    public enum PagamentoStatus {
        PENDENTE,   // sessão ainda não aconteceu
        CONFIRMADO, // aluno confirmou e pagou
        CANCELADO   // agendamento cancelado
    }
}