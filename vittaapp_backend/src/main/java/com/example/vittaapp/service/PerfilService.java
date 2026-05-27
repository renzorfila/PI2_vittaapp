package com.example.vittaapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.vittaapp.model.PerfilProfissional;
import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.PerfilRepository;
import com.example.vittaapp.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerfilService {
    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public List<PerfilProfissional> buscarPerfis(String q, String area){
        if (q != null && !q.isBlank()){
            return perfilRepository.findByTituloContainingIgnoreCase(q);
        }
        if (area != null && !area.isBlank()){
            List<PerfilProfissional> perfis = new ArrayList<>();
            for (PerfilProfissional perfil : perfilRepository.findAll()) {
                if (area.equals(perfil.getArea())) {
                    perfis.add(perfil);
                }
            }
            return perfis;
        }
        return perfilRepository.findAll();
    }

    public PerfilProfissional criar(PerfilProfissional perfil, Long usuarioId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        perfil.setUsuario(usuario);
        PerfilProfissional salvo = perfilRepository.save(perfil);

        usuario.setTemPerfilProfissional(true);
        usuarioRepository.save(usuario);

        return salvo;
    }

    public PerfilProfissional buscar(Long id) {
        return perfilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Perfil não encontrado: " + id));
    }

    public PerfilProfissional atualizar(Long id, PerfilProfissional dados){
        PerfilProfissional perfil = buscar(id);

        perfil.setTitulo(dados.getTitulo());
        perfil.setDescricao(dados.getDescricao());
        perfil.setCidade(dados.getCidade());
        perfil.setArea(dados.getArea());
        perfil.setValorPorSessao(dados.getValorPorSessao());
        perfil.setFormaAtendimento(dados.getFormaAtendimento());
        perfil.setExperiencia(dados.getExperiencia());

        return perfilRepository.save(perfil);
    }

    public void deletar(Long id) {
        if (!perfilRepository.existsById(id)) {
            throw new RuntimeException("Perfil não encontrado: " + id);
        }
        perfilRepository.deleteById(id);
    }

    public List<PerfilProfissional> listar(String q, String area) {
        // Em vez de jogar erro, chama o método que você já escreveu lá em cima!
        return buscarPerfis(q, area);
    }
}