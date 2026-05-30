package com.example.vittaapp.controller;

import com.example.vittaapp.model.AreaAtuacao;
import com.example.vittaapp.model.AreaTypes;
import com.example.vittaapp.service.AreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService service;

    // ── AreaAtuacao ───────────────────────────────────────────────

    // GET /api/areas → lista todas as especialidades
    @GetMapping
    public List<AreaAtuacao> listar() {
        return service.listarAreas();
    }

    // GET /api/areas/1
    @GetMapping("/{id}")
    public AreaAtuacao buscar(@PathVariable Long id) {
        return service.buscarArea(id);
    }

    // GET /api/areas?tipoId=2 → filtra por categoria pai
    @GetMapping("/por-tipo/{tipoId}")
    public List<AreaAtuacao> listarPorTipo(@PathVariable Long tipoId) {
        return service.listarAreasPorTipo(tipoId);
    }

    // POST /api/areas
    // Body: { "nome": "Pilates", "descricao": "...", "tipoId": 1 }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaAtuacao criar(@RequestBody Map<String, Object> body) {
        String nome      = (String) body.get("nome");
        String descricao = (String) body.get("descricao");
        Long tipoId      = body.get("tipoId") != null
            ? Long.valueOf(body.get("tipoId").toString()) : null;
        return service.criarArea(nome, descricao, tipoId);
    }

    // PUT /api/areas/1
    @PutMapping("/{id}")
    public AreaAtuacao atualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String nome      = (String) body.get("nome");
        String descricao = (String) body.get("descricao");
        Long tipoId      = body.get("tipoId") != null
            ? Long.valueOf(body.get("tipoId").toString()) : null;
        return service.atualizarArea(id, nome, descricao, tipoId);
    }

    // DELETE /api/areas/1
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletarArea(id);
    }

    // ── AreaTypes (categorias pai) ────────────────────────────────

    // GET /api/areas/tipos
    @GetMapping("/tipos")
    public List<AreaTypes> listarTipos() {
        return service.listarTipos();
    }

    // POST /api/areas/tipos
    // Body: { "nome": "Esportes" }
    @PostMapping("/tipos")
    @ResponseStatus(HttpStatus.CREATED)
    public AreaTypes criarTipo(@RequestBody Map<String, String> body) {
        return service.criarTipo(body.get("nome"));
    }

    // DELETE /api/areas/tipos/1
    @DeleteMapping("/tipos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarTipo(@PathVariable Long id) {
        service.deletarTipo(id);
    }
}
