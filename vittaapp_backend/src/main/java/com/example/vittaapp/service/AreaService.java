package com.example.vittaapp.service;

import com.example.vittaapp.model.AreaAtuacao;
import com.example.vittaapp.model.AreaTypes;
import com.example.vittaapp.repository.AreaAtuacaoRepository;
import com.example.vittaapp.repository.AreaTypesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaAtuacaoRepository areaRepo;
    private final AreaTypesRepository tipoRepo;

    // ── AreaTypes (categorias pai) ────────────────────────────────

    public List<AreaTypes> listarTipos() {
        return tipoRepo.findAll();
    }

    public AreaTypes criarTipo(String nome) {
        if (tipoRepo.existsByNome(nome))
            throw new RuntimeException("Tipo de área já existe: " + nome);
        return tipoRepo.save(AreaTypes.builder().nome(nome).build());
    }

    public void deletarTipo(Long id) {
        if (!tipoRepo.existsById(id))
            throw new RuntimeException("Tipo não encontrado: " + id);
        tipoRepo.deleteById(id);
    }

    // ── AreaAtuacao (especialidades) ──────────────────────────────

    public List<AreaAtuacao> listarAreas() {
        return areaRepo.findAll();
    }

    public List<AreaAtuacao> listarAreasPorTipo(Long tipoId) {
        return areaRepo.findByTipoId(tipoId);
    }

    public AreaAtuacao buscarArea(Long id) {
        return areaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Área não encontrada: " + id));
    }

    public AreaAtuacao criarArea(String nome, String descricao, Long tipoId) {
        if (areaRepo.existsByNome(nome))
            throw new RuntimeException("Área já existe: " + nome);

        AreaTypes tipo = tipoId != null
            ? tipoRepo.findById(tipoId).orElseThrow(() -> new RuntimeException("Tipo não encontrado: " + tipoId))
            : null;

        return areaRepo.save(AreaAtuacao.builder()
            .nome(nome)
            .descricao(descricao)
            .tipo(tipo)
            .build());
    }

    public AreaAtuacao atualizarArea(Long id, String nome, String descricao, Long tipoId) {
        AreaAtuacao area = buscarArea(id);
        if (nome != null)      area.setNome(nome);
        if (descricao != null) area.setDescricao(descricao);
        if (tipoId != null) {
            AreaTypes tipo = tipoRepo.findById(tipoId)
                .orElseThrow(() -> new RuntimeException("Tipo não encontrado: " + tipoId));
            area.setTipo(tipo);
        }
        return areaRepo.save(area);
    }

    public void deletarArea(Long id) {
        if (!areaRepo.existsById(id))
            throw new RuntimeException("Área não encontrada: " + id);
        areaRepo.deleteById(id);
    }
}
