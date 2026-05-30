package com.example.vittaapp.controller;

import com.example.vittaapp.model.Mensagem;
import com.example.vittaapp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mensagens")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService service;

    @GetMapping("/conversa/{outroId}")
    public List<Mensagem> getConversa(
            @PathVariable Long outroId,
            @RequestParam Long meId) {
        return service.getConversa(meId, outroId);
    }

    @PostMapping("/enviar")
    @ResponseStatus(HttpStatus.CREATED)
    public Mensagem enviar(@RequestBody Map<String, Object> body) {
        Long remetenteId    = Long.valueOf(body.get("remetenteId").toString());
        Long destinatarioId = Long.valueOf(body.get("destinatarioId").toString());
        String texto        = body.get("texto").toString();
        return service.enviar(remetenteId, destinatarioId, texto);
    }

    @GetMapping("/nao-lidas")
    public Map<String, Long> contarNaoLidas(@RequestParam Long userId) {
        return Map.of("total", service.contarNaoLidas(userId));
    }

    @GetMapping("/inbox")
    public List<com.example.vittaapp.model.InboxItem> getInboxProfissionais(@RequestParam Long userId) {
        return service.getInboxProfissionais(userId);
    }
}
