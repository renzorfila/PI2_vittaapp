package com.example.vittaapp.controller;

import com.example.vittaapp.model.PerfilProfissional;
import com.example.vittaapp.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfis")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService service;

    @GetMapping
    public List<PerfilProfissional> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String area) {
        return service.listar(q, area);
    }

    @GetMapping("/{id}")
    public PerfilProfissional buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    // NOVA ROTA — busca o perfil pelo ID do usuário dono
    // GET /api/perfis/usuario/3
    @GetMapping("/usuario/{usuarioId}")
    public PerfilProfissional buscarPorUsuario(@PathVariable Long usuarioId) {
        return service.buscarPorUsuario(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PerfilProfissional criar(
            @RequestParam Long usuarioId,
            @RequestBody PerfilProfissional perfil) {
        return service.criar(perfil, usuarioId);
    }

    @PutMapping("/{id}")
    public PerfilProfissional atualizar(
            @PathVariable Long id,
            @RequestBody PerfilProfissional dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @PostMapping("/{id}/avaliar")
    public PerfilProfissional avaliar(
        @PathVariable Long id,
        @RequestBody java.util.Map<String, Integer> body) {

    Integer nota = body.get("nota");

    PerfilProfissional perfil = service.buscar(id);

    perfil.setAvaliacaoMedia(Double.valueOf(nota));

    return service.atualizarAvaliacao(perfil);
}
}
