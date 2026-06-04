package com.example.vittaapp.service;

import com.example.vittaapp.model.PerfilImage;
import com.example.vittaapp.model.PerfilProfissional;
import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.PerfilImageRepository;
import com.example.vittaapp.repository.PerfilRepository;
import com.example.vittaapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final PerfilRepository      perfilRepository;
    private final UsuarioRepository     usuarioRepository;
    private final PerfilImageRepository imagemRepository;

    public List<PerfilProfissional> listar(String q, String area) {
        if (q != null && !q.isBlank())
            return perfilRepository.findByTituloContainingIgnoreCase(q);
        if (area != null && !area.isBlank())
            return perfilRepository.findByAreaAtuacao(area);
        return perfilRepository.findAll();
    }

    public PerfilProfissional buscar(Long id) {
        return perfilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Perfil não encontrado: " + id));
    }

    public PerfilProfissional buscarPorUsuario(Long usuarioId) {
        return perfilRepository.findByUsuarioId(usuarioId)
            .orElseThrow(() -> new RuntimeException("Perfil não encontrado para o usuário: " + usuarioId));
    }

    public PerfilProfissional criar(PerfilProfissional perfil, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        perfil.setUsuario(usuario);
        return perfilRepository.save(perfil);
    }

    public PerfilProfissional atualizar(Long id, PerfilProfissional dados) {
        PerfilProfissional perfil = buscar(id);
        if (dados.getTitulo()           != null) perfil.setTitulo(dados.getTitulo());
        if (dados.getDescricao()        != null) perfil.setDescricao(dados.getDescricao());
        if (dados.getCidade()           != null) perfil.setCidade(dados.getCidade());
        if (dados.getValorPorSessao()   != null) perfil.setValorPorSessao(dados.getValorPorSessao());
        if (dados.getFormaAtendimento() != null) perfil.setFormaAtendimento(dados.getFormaAtendimento());
        if (dados.getExperiencia()      != null) perfil.setExperiencia(dados.getExperiencia());
        if (dados.getAreaAtuacao()      != null) perfil.setAreaAtuacao(dados.getAreaAtuacao());
        return perfilRepository.save(perfil);
    }

    public void deletar(Long id) {
        if (!perfilRepository.existsById(id))
            throw new RuntimeException("Perfil não encontrado: " + id);
        perfilRepository.deleteById(id);
    }

    public PerfilProfissional atualizarAvaliacao(PerfilProfissional perfil) {
        return perfilRepository.save(perfil);
    }

    public List<PerfilImage> listarImagens(Long perfilId) {
        return imagemRepository.findByPerfilIdOrderByOrdemAsc(perfilId);
    }

    public PerfilImage adicionarImagem(Long perfilId, String urlImagem, Integer ordem) {
        PerfilProfissional perfil = buscar(perfilId);
        return imagemRepository.save(PerfilImage.builder()
            .perfil(perfil).imagem(urlImagem).ordem(ordem).build());
    }

    public void deletarImagem(Long imagemId) {
        if (!imagemRepository.existsById(imagemId))
            throw new RuntimeException("Imagem não encontrada: " + imagemId);
        imagemRepository.deleteById(imagemId);
    }
}
