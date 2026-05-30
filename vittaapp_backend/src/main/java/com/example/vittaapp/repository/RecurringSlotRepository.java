package com.example.vittaapp.repository;

import com.example.vittaapp.model.RecurringSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecurringSlotRepository extends JpaRepository<RecurringSlot, Long> {
    List<RecurringSlot> findByTutorId(Long tutorId);
    List<RecurringSlot> findByTutorIdAndAtivoTrue(Long tutorId);
}
