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

    // GET /api/perfis
    // GET /api/perfis?q=personal
    // GET /api/perfis?area=Pilates
    @GetMapping
    public List<PerfilProfissional> listar(
            // @RequestParam = parâmetros na URL (?q=...)
            // required = false = o parâmetro é opcional
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String area) {
        return service.listar(q, area);
    }

    @GetMapping("/{id}")
    // @PathVariable = captura o {id} da URL
    public PerfilProfissional buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    // POST /api/perfis?usuarioId=2
    // Body (JSON): { "titulo": "Personal Trainer", "cidade": "SP", ... }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // retorna HTTP 201 (criado)
    public PerfilProfissional criar(
            @RequestParam Long usuarioId,
            // @RequestBody = lê o JSON do corpo da requisição
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
    @ResponseStatus(HttpStatus.NO_CONTENT) // retorna HTTP 204 (sem conteúdo)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}