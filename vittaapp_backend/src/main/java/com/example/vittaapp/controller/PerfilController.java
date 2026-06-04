package com.example.vittaapp.controller;

import com.example.vittaapp.model.PerfilImage;
import com.example.vittaapp.model.PerfilProfissional;
import com.example.vittaapp.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
            @RequestBody Map<String, Integer> body) {
        PerfilProfissional perfil = service.buscar(id);
        Double mediaAtual = perfil.getAvaliacaoMedia() != null ? perfil.getAvaliacaoMedia() : 0.0;
        Double nota       = Double.valueOf(body.get("nota"));
        perfil.setAvaliacaoMedia(mediaAtual == 0.0 ? nota : (mediaAtual + nota) / 2.0);
        return service.atualizarAvaliacao(perfil);
    }

    @GetMapping("/{perfilId}/imagens")
    public List<PerfilImage> listarImagens(@PathVariable Long perfilId) {
        return service.listarImagens(perfilId);
    }

    @PostMapping("/{perfilId}/imagens")
    @ResponseStatus(HttpStatus.CREATED)
    public PerfilImage adicionarImagem(
            @PathVariable Long perfilId,
            @RequestBody Map<String, Object> body) {
        String  url   = (String) body.get("imagem");
        Integer ordem = Integer.valueOf(body.get("ordem").toString());
        return service.adicionarImagem(perfilId, url, ordem);
    }

    @DeleteMapping("/imagens/{imagemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarImagem(@PathVariable Long imagemId) {
        service.deletarImagem(imagemId);
    }
}
