package com.example.vittaapp.controller;

import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/cadastro
    // Body: { "nome": "Renzo", "email": "renzo@email.com", "senha": "123456" }
    // ─────────────────────────────────────────────────────────────
    @PostMapping("/api/auth/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario cadastro(@RequestBody Map<String, String> body) {
        String nome  = body.get("nome");
        String email = body.get("email");
        String senha = body.get("senha");
        String tipo  = body.getOrDefault("tipo", "ALUNO"); // padrão: aluno

        if (nome == null || nome.isBlank())  throw new RuntimeException("Nome é obrigatório");
        if (email == null || email.isBlank()) throw new RuntimeException("Email é obrigatório");
        if (senha == null || senha.length() < 6) throw new RuntimeException("Senha mínimo 6 caracteres");

        return service.cadastrar(nome, email, senha, tipo);
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // Body: { "email": "renzo@email.com", "senha": "123456" }
    // Retorna: { "token": "...", "user": { "id", "name", "email", ... } }
    // ─────────────────────────────────────────────────────────────
    @PostMapping("/api/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");

        if (email == null || senha == null)
            throw new RuntimeException("Email e senha são obrigatórios");

        return service.login(email, senha);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/usuarios/{id}
    // ─────────────────────────────────────────────────────────────
    @GetMapping("/api/usuarios/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /api/usuarios/{id}
    // Body: { "nome": "Novo Nome", "foto": "https://example.com/foto.jpg" }
    // ─────────────────────────────────────────────────────────────
    @PutMapping("/api/usuarios/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.atualizar(id, body.get("nome"), body.get("foto"));
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE /api/usuarios/{id}
    // ─────────────────────────────────────────────────────────────
    @DeleteMapping("/api/usuarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
