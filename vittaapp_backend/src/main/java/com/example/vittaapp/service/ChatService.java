package com.example.vittaapp.service;

import com.example.vittaapp.model.InboxItem;
import com.example.vittaapp.model.Mensagem;
import com.example.vittaapp.model.Usuario;
import com.example.vittaapp.repository.MensagemRepository;
import com.example.vittaapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MensagemRepository mensagemRepo;
    private final UsuarioRepository usuarioRepo;

    // Retorna o histórico de conversa entre dois usuários
    public List<Mensagem> getConversa(Long idA, Long idB) {
        return mensagemRepo.findConversa(idA, idB);
    }

    // Envia uma nova mensagem
    public Mensagem enviar(Long remetenteId, Long destinatarioId, String texto) {
        if (texto == null || texto.isBlank()) {
            throw new RuntimeException("Mensagem não pode ser vazia");
        }

        Usuario remetente = usuarioRepo.findById(remetenteId)
            .orElseThrow(() -> new RuntimeException("Remetente não encontrado"));
        Usuario destinatario = usuarioRepo.findById(destinatarioId)
            .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        Mensagem msg = Mensagem.builder()
            .remetente(remetente)
            .destinatario(destinatario)
            .texto(texto.trim())
            .lida(false)
            .build();

        return mensagemRepo.save(msg);
    }

    // Conta mensagens não lidas de um usuário (todas as conversas)
    public long contarNaoLidas(Long usuarioId) {
        return mensagemRepo.countByDestinatarioIdAndLidaFalse(usuarioId);
    }

    // Inbox: somente conversas com profissionais
    public List<InboxItem> getInboxProfissionais(Long meId) {
        List<Mensagem> ultimas = mensagemRepo.findUltimasMensagensInboxProfissionais(meId);

        return ultimas.stream().map(m -> {
            // Define quem é o "outro" da conversa para o meu usuário
            boolean meRemetente = m.getRemetente() != null && m.getRemetente().getId() != null && m.getRemetente().getId().equals(meId);
            Long otherId = meRemetente ? m.getDestinatario().getId() : m.getRemetente().getId();
            Usuario other = meRemetente ? m.getDestinatario() : m.getRemetente();

            // unread = mensagens NÃO lidas onde eu (meId) sou o destinatário
            // (lida=false significa que o destinatário ainda não viu)
            long unread = mensagemRepo
            .countByRemetenteIdAndDestinatarioIdAndLidaFalse(otherId, meId);

            LocalDateTime time = m.getCriadoEm();

            return new InboxItem(
                otherId,
                other.getNome(),
                other.getNome() != null && !other.getNome().isBlank() ? other.getNome().trim().charAt(0) + "" : "U",
                m.getTexto(),
                time,
                unread
            );
        }).toList();
    }
}

