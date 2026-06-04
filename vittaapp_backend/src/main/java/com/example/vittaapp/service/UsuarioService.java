package com.example.vittaapp.service;

import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repo;

    // Criptografia com SHA-256 (sem Spring Security)
    private static String hashPassword(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("Erro ao criptografar senha", ex);
        }
    }

    private static boolean matchesPassword(String senha, String hashSalvo) {
        return hashPassword(senha).equals(hashSalvo);
    }

    // ── Cadastro ──────────────────────────────────────────────────
    public Usuario cadastrar(String nome, String email, String senha, String tipo) {
        if (repo.existsByEmail(email))
            throw new RuntimeException("Este email já está cadastrado");

        return repo.save(Usuario.builder()
            .nome(nome)
            .email(email)
            .senhaHash(hashPassword(senha))                     // ← corrigido
            .tipo(Usuario.Tipo.valueOf(tipo.toUpperCase()))     // "aluno" → ALUNO
            .build());
    }

    // ── Login ─────────────────────────────────────────────────────
    public Map<String, Object> login(String email, String senha) {
        Usuario usuario = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!matchesPassword(senha, usuario.getSenhaHash()))
            throw new RuntimeException("Email ou senha inválidos");

        return Map.of(
            "token", "vitta-token-" + usuario.getId() + "-" + System.currentTimeMillis(),
            "user", Map.of(
                "id",    usuario.getId(),
                "name",  usuario.getNome(),
                "email", usuario.getEmail(),
                "foto",  usuario.getFoto() != null ? usuario.getFoto() : "",
                "tipo",  usuario.getTipo().toString()
            )
        );
    }

    // ── Buscar por ID ─────────────────────────────────────────────
    public Usuario buscarPorId(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));
    }

    // ── Atualizar ─────────────────────────────────────────────────
    public Usuario atualizar(Long id, String novoNome, String foto) {
        Usuario usuario = buscarPorId(id);
        if (novoNome != null) usuario.setNome(novoNome);
        if (foto != null)     usuario.setFoto(foto);
        return repo.save(usuario);
    }

    // ── Deletar ───────────────────────────────────────────────────
    public void deletar(Long id) {
        if (!repo.existsById(id))
            throw new RuntimeException("Usuário não encontrado: " + id);
        repo.deleteById(id);
    }
}