package com.example.vittaapp.controller;

import com.example.vittaapp.model.AvailabilitySlot;
import com.example.vittaapp.model.Booking;
import com.example.vittaapp.service.AgendaService;
import com.example.vittaapp.model.RecurringSlot;
import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.RecurringSlotRepository;
import com.example.vittaapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService service;
    private final RecurringSlotRepository recurringRepo;
    private final UsuarioRepository usuarioRepo;

    // GET /api/agenda/slots  → todos os slots com vagas
    @GetMapping("/slots")
    public List<AvailabilitySlot> listarSlots() {
        return service.listarSlotsDisponiveis();
    }

    // GET /api/agenda/slots/tutor/1  → slots de um tutor específico
    @GetMapping("/slots/tutor/{tutorId}")
    public List<AvailabilitySlot> listarSlotsTutor(@PathVariable Long tutorId) {
        return service.listarSlotsTutor(tutorId);
    }

    @GetMapping("/recorrentes/tutor/{tutorId}")
    public List<RecurringSlot> listarRecorrentes(@PathVariable Long tutorId) {
        return recurringRepo.findByTutorIdAndAtivoTrue(tutorId);
    }
    // POST /api/agenda/slots?tutorId=1
    // Body: { "titulo": "Treino Funcional", "startTime": "2026-06-01T07:00:00", "endTime": "...", "capacity": 1 }
    @PostMapping("/slots")
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilitySlot criarSlot(
            @RequestBody AvailabilitySlot slot,
            @RequestParam Long tutorId) {
        return service.criarSlot(slot, tutorId);
    }

    @PostMapping("/recorrentes")
    @ResponseStatus(HttpStatus.CREATED)
    public RecurringSlot criarRecorrente(
            @RequestBody RecurringSlot slot,
            @RequestParam Long tutorId) {
        Usuario tutor = usuarioRepo.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor não encontrado"));
        slot.setTutor(tutor);
        slot.setAtivo(true);
        return recurringRepo.save(slot);
}

    // DELETE /api/agenda/slots/1
    @DeleteMapping("/slots/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarSlot(@PathVariable Long id) {
        service.deletarSlot(id);
    }

    // POST /api/agenda/agendar?slotId=1&studentId=2
    @PostMapping("/agendar")
    @ResponseStatus(HttpStatus.CREATED)
    public Booking agendar(
            @RequestParam Long slotId,
            @RequestParam Long studentId) {
        return service.agendar(slotId, studentId);
    }

    // PATCH /api/agenda/agendamentos/1/cancelar
    @PatchMapping("/agendamentos/{id}/cancelar")
    public Booking cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }

    // GET /api/agenda/meus?studentId=2
    @GetMapping("/meus")
    public List<Booking> meusAgendamentos(@RequestParam Long studentId) {
        return service.meusAgendamentos(studentId);
    }
}