document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PROTEÇÃO DE ACESSO E VARIAVEIS DE SESSÃO ---
    
    const estaLogado = localStorage.getItem('usuarioLogado');

    if (estaLogado !== 'true') {
        // Se não estiver logado, redireciona para a página de login.
        window.location.href = '../login.html'; 
        return; 
    }
    
    // Obter dados do utilizador
    const perfil = localStorage.getItem('perfilUsuario');
    const emailCompleto = localStorage.getItem('emailUtilizador') || 'usuario@ipca.pt';
    const nomeBase = emailCompleto.split('@')[0];
    
    // 2. REFERÊNCIAS DO DOM
    const nomeDisplay = document.getElementById('nome-utilizador');
    const mensagemPerfil = document.getElementById('mensagem-perfil');
    const perfilLabel = document.getElementById('perfil-label-info');
    const menuItensContainer = document.getElementById('menu-itens-dinamicos');
    const dashboardConteudo = document.getElementById('dashboard-conteudo');
    const botaoSair = document.getElementById('btn-logout'); 
    
    // 2.1. Personalizar Cabeçalho e Sidebar
    if (nomeDisplay) nomeDisplay.textContent = nomeBase; 
    if (mensagemPerfil) mensagemPerfil.textContent = `Painel de controlo do ${perfil.charAt(0).toUpperCase() + perfil.slice(1)}.`;
    if (perfilLabel) perfilLabel.textContent = `Perfil: ${perfil.charAt(0).toUpperCase() + perfil.slice(1)}`;

    // --- 3. CONSTRUÇÃO DINÂMICA DO MENU E CONTEÚDO ---

    const menuBase = [
        { nome: 'Meus Dados Pessoais', link: 'dados_pessoais.html' },
        { nome: 'Notificações', link: 'notificacoes.html' } // Requisito: Receber notificações
    ];

    if (perfil === 'organizador') {
        // ITENS DE MENU ESPECÍFICOS PARA ORGANIZADOR (Criação, Gestão, Vendas)
        menuBase.push(
            { nome: 'Criar Evento', link: 'criar_evento.html' }, // Requisito: Criar/Editar/Eliminar eventos
            { nome: 'Gerir Eventos', link: 'gerir_eventos.html' }, // Requisito: Adicionar atividades, Gerir Participantes, Aplicar Descontos
            { nome: 'Relatórios & Vendas', link: 'relatorios.html' } // Requisito: Ver inscritos e valor arrecadado
        );
        dashboardConteudo.innerHTML = gerarConteudoOrganizador(nomeBase);
        
    } else if (perfil === 'participante') {
        // ITENS DE MENU ESPECÍFICOS PARA PARTICIPANTE (Inscrição, Agenda, Bilhetes)
        menuBase.push(
            { nome: 'Explorar Eventos', link: 'explorar_eventos.html' }, // Requisito: Lista de eventos, filtros
            { nome: 'Minhas Inscrições', link: 'meus_eventos.html' }, // Requisito: Inscrever-se, Simular Pagamento, Venda de Bilhetes
            { nome: 'Agenda & Favoritos', link: 'minha_agenda.html' }, // Requisito: Agenda de atividades, Favoritos e Lembretes
            { nome: 'Bilhetes & Reembolsos', link: 'reembolsos.html' } // Requisito: Cancelamento e reembolso
        );
        dashboardConteudo.innerHTML = gerarConteudoParticipante(nomeBase);
    }
    
    // Injetar o menu no DOM
    if (menuItensContainer) {
        menuItensContainer.innerHTML = menuBase.map(item => `
            <a href="${item.link}" class="menu-item">
                ${item.nome}
            </a>
        `).join('');
    }

    // --- 4. LÓGICA DE LOGOUT ---
    
    if (botaoSair) {
        botaoSair.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Limpa as flags de sessão e redireciona
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('perfilUsuario');
            localStorage.removeItem('emailUtilizador');
            window.location.href = '../login.html';
        });
    }
});


// --- FUNÇÕES AUXILIARES DE CONTEÚDO (WIDGETS) ---

function gerarConteudoOrganizador(nome) {
    // Foco: Gestão, Vendas e Métricas
    return `
        <h2>Visão Geral de Gestão</h2>
        <div class="widgets-grid">
            <div class="widget">
                <h3>Eventos Ativos</h3>
                <p class="widget-numero">3</p>
                <p class="widget-detalhe">1 com Descontos Ativos | 2 com Venda VIP</p>
            </div>
            <div class="widget widget-dinheiro">
                <h3>Total Arrecadado (€)</h3>
                <p class="widget-numero">€ 1 245,50</p>
                <p class="widget-detalhe">Valor total dos bilhetes Normal e VIP</p>
            </div>
            <div class="widget">
                <h3>Inscrições Totais</h3>
                <p class="widget-numero">154</p>
                <p class="widget-detalhe">Média de 51 participantes por evento</p>
            </div>
            <div class="widget widget-cta">
                <h3>Novo Evento ou Atividade?</h3>
                <a href="criar_evento.html" class="btn btn-primario btn-full">Criar Evento +</a>
            </div>
        </div>
        
        <h2 style="margin-top: 40px;">Pendências e Ações Rápidas</h2>
        <div class="widgets-grid">
             <div class="widget">
                <h3>Eventos a Publicar</h3>
                <p class="widget-numero">1</p>
                <p class="widget-detalhe">Conferência de IA pendente de horário final.</p>
            </div>
            <div class="widget">
                <h3>Aplicações de Desconto</h3>
                <p class="widget-numero">5</p>
                <p class="widget-detalhe">Grupos de estudantes à espera de aprovação.</p>
            </div>
        </div>
    `;
}

function gerarConteudoParticipante(nome) {
    // Foco: Atividades Pessoais, Agenda e Bilhetes
    return `
        <h2>Minha Área Pessoal e Agenda</h2>
        <div class="widgets-grid">
            <div class="widget">
                <h3>Inscrições Ativas</h3>
                <p class="widget-numero">2</p>
                <p class="widget-detalhe">1 Bilhete VIP | 1 Bilhete Normal</p>
            </div>
            <div class="widget widget-agenda">
                <h3>Próximo Evento (Agenda)</h3>
                <p class="widget-numero">Seminário de Cibersegurança</p>
                <p class="widget-detalhe">Dia: 2026/01/10 | Local: Auditório A</p>
            </div>
            <div class="widget">
                <h3>Atividades Favoritas</h3>
                <p class="widget-numero">5</p>
                <p class="widget-detalhe">Lembretes e Notificações Ativas</p>
            </div>
            <div class="widget widget-cta">
                <h3>Procure o seu Próximo Evento</h3>
                <a href="explorar_eventos.html" class="btn btn-primario btn-full">Explorar Eventos (Filtrar)</a>
            </div>
        </div>
        
        <h2 style="margin-top: 40px;">Gestão de Bilhetes e Notificações</h2>
        <div class="widgets-grid">
            <div class="widget">
                <h3>Notificações Importantes</h3>
                <p class="widget-numero">1</p>
                <p class="widget-detalhe">Alteração de horário no "Workshop de Design".</p>
            </div>
             <div class="widget">
                <h3>Reembolsos Pendentes</h3>
                <p class="widget-numero">0</p>
                <p class="widget-detalhe">Simular Cancelamento de Bilhete.</p>
            </div>
        </div>
    `;
}