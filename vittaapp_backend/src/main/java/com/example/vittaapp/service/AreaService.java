package com.example.vittaapp.service;

import com.example.vittaapp.model.AreaAtuacao;
import com.example.vittaapp.repository.AreaAtuacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaAtuacaoRepository areaRepo;

    public List<AreaAtuacao> listarAreas() {
        return areaRepo.findAll();
    }

    public List<AreaAtuacao> listarPorCategoria(String categoria) {
        return areaRepo.findByCategoria(categoria);
    }

    public AreaAtuacao buscarArea(Long id) {
        return areaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Área não encontrada: " + id));
    }

    public AreaAtuacao criarArea(String nome, String descricao, String categoria) {
        if (areaRepo.existsByNome(nome))
            throw new RuntimeException("Área já existe: " + nome);

        return areaRepo.save(AreaAtuacao.builder()
            .nome(nome)
            .descricao(descricao)
            .categoria(categoria)
            .build());
    }

    public AreaAtuacao atualizarArea(Long id, String nome, String descricao, String categoria) {
        AreaAtuacao area = buscarArea(id);
        if (nome      != null) area.setNome(nome);
        if (descricao != null) area.setDescricao(descricao);
        if (categoria != null) area.setCategoria(categoria);
        return areaRepo.save(area);
    }

    public void deletarArea(Long id) {
        if (!areaRepo.existsById(id))
            throw new RuntimeException("Área não encontrada: " + id);
        areaRepo.deleteById(id);
    }
}