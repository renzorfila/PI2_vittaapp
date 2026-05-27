package com.example.vittaapp.repository;

import com.example.vittaapp.model.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByTutorId(Long tutorId);

    List<AvailabilitySlot> findByAvailableGreaterThan(int minimo);
}