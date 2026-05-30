package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "recurring_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Título do slot recorrente (ex: "Pilates matinal - segundas")
    @Column(nullable = false)
    private String titulo;

    // Dia da semana: 1=segunda, 2=terça, ... 7=domingo
    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana;

    // Horário de início e fim (ex: 07:00 e 08:00)
    @Column(name = "horario_comeco", nullable = false)
    private LocalTime horarioComeco;

    @Column(name = "horario_fim", nullable = false)
    private LocalTime horarioFim;

    // Período de vigência do slot recorrente
    @Column(name = "data_comeco")
    private LocalDate dataComeco;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    // Quantos alunos cabem por ocorrência
    @Column(nullable = false)
    private Integer capacidade;

    // Se false, o slot está pausado e não gera novos AvailabilitySlots
    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // Profissional dono deste slot recorrente
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Usuario tutor;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
