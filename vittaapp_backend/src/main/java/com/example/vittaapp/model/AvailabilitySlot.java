package com.example.vittaapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "availability_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Builder.Default
    @Column(nullable = false)
    private Integer capacity = 1;

    @Builder.Default
    @Column(nullable = false)
    private Integer available = 1;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Usuario tutor;
}
