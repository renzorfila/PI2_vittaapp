package com.example.vittaapp.controller;

import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario criar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /usuarios/1
    // ─────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario dadosAtualizados) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Atualiza os campos necessários (exceto o ID e a data de criação)
                    usuario.setNome(dadosAtualizados.getNome());
                    usuario.setEmail(dadosAtualizados.getEmail());
                    usuario.setSenhaHash(dadosAtualizados.getSenhaHash());
                    
                    // Salva as alterações por cima do utilizador existente
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + id));
    }
}