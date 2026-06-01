package com.example.vittaapp.controller;

import com.example.vittaapp.model.AreaAtuacao;
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

    // GET /api/areas
    @GetMapping
    public List<AreaAtuacao> listar() {
        return service.listarAreas();
    }

    // GET /api/areas/1
    @GetMapping("/{id}")
    public AreaAtuacao buscar(@PathVariable Long id) {
        return service.buscarArea(id);
    }

    // GET /api/areas/categoria/Esportes
    @GetMapping("/categoria/{categoria}")
    public List<AreaAtuacao> listarPorCategoria(@PathVariable String categoria) {
        return service.listarPorCategoria(categoria);
    }

    // POST /api/areas
    // Body: { "nome": "Pilates", "descricao": "...", "categoria": "Esportes" }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaAtuacao criar(@RequestBody Map<String, String> body) {
        return service.criarArea(body.get("nome"), body.get("descricao"), body.get("categoria"));
    }

    // PUT /api/areas/1
    @PutMapping("/{id}")
    public AreaAtuacao atualizar(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return service.atualizarArea(id, body.get("nome"), body.get("descricao"), body.get("categoria"));
    }

    // DELETE /api/areas/1
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletarArea(id);
    }
}