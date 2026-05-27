package com.example.vittaapp.service;

import com.example.vittaapp.model.*;
import com.example.vittaapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final SlotRepository    slotRepo;
    private final BookingRepository bookingRepo;
    private final UsuarioRepository usuarioRepo;

    public List<AvailabilitySlot> listarSlotsDisponiveis() {
        return slotRepo.findByAvailableGreaterThan(0);
    }

    public List<AvailabilitySlot> listarSlotsTutor(Long tutorId) {
        return slotRepo.findByTutorId(tutorId);
    }

    public AvailabilitySlot criarSlot(AvailabilitySlot slot, Long tutorId) {
        Usuario tutor = usuarioRepo.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor não encontrado"));
        slot.setTutor(tutor);
        slot.setAvailable(slot.getCapacity());
        return slotRepo.save(slot);
    }

    public void deletarSlot(Long id) {
        if (!slotRepo.existsById(id))
            throw new RuntimeException("Slot não encontrado");
        slotRepo.deleteById(id);
    }

    @Transactional
    public Booking agendar(Long slotId, Long studentId) {
        AvailabilitySlot slot = slotRepo.findById(slotId)
            .orElseThrow(() -> new RuntimeException("Slot não encontrado"));

        if (slot.getAvailable() <= 0)
            throw new RuntimeException("Sem vagas disponíveis");

        Usuario student = usuarioRepo.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        slot.setAvailable(slot.getAvailable() - 1);
        slotRepo.save(slot);

        return bookingRepo.save(Booking.builder()
            .slot(slot)
            .student(student)
            .status(Booking.BookingStatus.CONFIRMED)
            .build());
    }

    @Transactional
    public Booking cancelar(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        AvailabilitySlot slot = booking.getSlot();
        slot.setAvailable(slot.getAvailable() + 1);
        slotRepo.save(slot);

        return bookingRepo.save(booking);
    }

    public List<Booking> meusAgendamentos(Long studentId) {
        return bookingRepo.findByStudentId(studentId);
    }
}