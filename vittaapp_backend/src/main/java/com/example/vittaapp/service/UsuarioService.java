// service/UsuarioService.java
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
    public Usuario cadastrar(String nome, String email, String senha) {

        // 1. Verifica se o email já existe no banco
        if (repo.existsByEmail(email)) {
            throw new RuntimeException("Este email já está cadastrado");
        }

        // 2. Criptografa a senha antes de salvar
        //    NUNCA salvar senha pura no banco!
        String senhaCriptografada = hashPassword(senha);

        // 3. Cria o objeto Usuario e salva
        Usuario usuario = Usuario.builder()
            .nome(nome)
            .email(email)
            .senhaHash(senhaCriptografada)
            .temPerfilProfissional(false)
            .build();

        return repo.save(usuario);
    }

    // ── Login ─────────────────────────────────────────────────────
    public Map<String, Object> login(String email, String senha) {

        // 1. Busca o usuário pelo email
        Usuario usuario = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        // 2. Compara a senha digitada com o hash salvo no banco
        boolean senhaCorreta = matchesPassword(senha, usuario.getSenhaHash());

        if (!senhaCorreta) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        // 3. Retorna os dados do usuário e um token simples
        //    (você pode trocar por JWT depois)
        String token = "vitta-token-" + usuario.getId() + "-" + System.currentTimeMillis();

        return Map.of(
            "token", token,
            "user", Map.of(
                "id",                    usuario.getId(),
                "name",                  usuario.getNome(),
                "email",                 usuario.getEmail(),
                "temPerfilProfissional", usuario.getTemPerfilProfissional()
            )
        );
    }

    // ── Buscar usuário por ID ─────────────────────────────────────
    public Usuario buscarPorId(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));
    }

    // ── Atualizar nome do usuário ─────────────────────────────────
    public Usuario atualizar(Long id, String novoNome, String foto) {
        Usuario usuario = buscarPorId(id);
        if (novoNome != null) usuario.setNome(novoNome);
        if (foto != null)     usuario.setFoto(foto);
        return repo.save(usuario);
    }

    // ── Deletar usuário ───────────────────────────────────────────
    public void deletar(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado: " + id);
        }
        repo.deleteById(id);
    }
}