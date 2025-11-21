document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PROTEÇÃO DE ACESSO E VARIAVEIS DE SESSÃO ---
    
    const estaLogado = localStorage.getItem('usuarioLogado');

    if (estaLogado !== 'true') {
        // Se não estiver logado, redireciona para a página de login.
        // O '../' é necessário porque estamos na subpasta 'plataforma_gestao'.
        window.location.href = '../login.html'; 
        return; 
    }
    
    // Obter dados do utilizador do Local Storage
    const perfil = localStorage.getItem('perfilUsuario');
    const emailCompleto = localStorage.getItem('emailUtilizador') || 'usuario@ipca.pt';
    // Usar o nome antes do '@' como nome de utilizador
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
    if (mensagemPerfil) mensagemPerfil.textContent = `O seu painel de ${perfil.charAt(0).toUpperCase() + perfil.slice(1)}.`;
    if (perfilLabel) perfilLabel.textContent = `Perfil: ${perfil.charAt(0).toUpperCase() + perfil.slice(1)}`;

    // --- 3. CONSTRUÇÃO DINÂMICA DO MENU E CONTEÚDO ---

    // Menu Comum a ambos
    const menuBase = [
        { nome: 'Meus Dados Pessoais', link: 'dados_pessoais.html' }
    ];

    if (perfil === 'organizador') {
        // ITENS DE MENU ESPECÍFICOS PARA ORGANIZADOR
        menuBase.push(
            { nome: 'Criar Evento', link: 'criar_evento.html' }, // Requisito: Criar eventos
            { nome: 'Gerir Eventos', link: 'gerir_eventos.html' }, // Requisito: Editar, eliminar, gerir participantes/descontos
            { nome: 'Relatórios & Vendas', link: 'relatorios.html' } // Requisito: Valor arrecadado e inscrições
        );
        dashboardConteudo.innerHTML = gerarConteudoOrganizador(nomeBase);
        
    } else if (perfil === 'participante') {
        // ITENS DE MENU ESPECÍFICOS PARA PARTICIPANTE
        menuBase.push(
            { nome: 'Explorar Eventos', link: 'explorar_eventos.html' }, // Requisito: Lista de eventos, filtros
            { nome: 'Minhas Inscrições', link: 'meus_eventos.html' }, // Requisito: Inscrever-se, comprar bilhetes
            { nome: 'Agenda & Favoritos', link: 'minha_agenda.html' }, // Requisito: Agenda de atividades, favoritos, lembretes
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
            // Limpa as flags de sessão no Local Storage para terminar a sessão
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('perfilUsuario');
            localStorage.removeItem('emailUtilizador');
            
            // Redireciona de volta para a página de login
            window.location.href = '../login.html';
        });
    }
});


// --- FUNÇÕES AUXILIARES DE CONTEÚDO (WIDGETS) ---

function gerarConteudoOrganizador(nome) {
    // Conteúdo focado em gestão, vendas e métricas (Requisitos de Organizador)
    return `
        <h2>Painel de Gestão e Vendas</h2>
        <div class="widgets-grid">
            <div class="widget">
                <h3>Eventos Ativos</h3>
                <p class="widget-numero">3</p>
                <p class="widget-detalhe">1 com Inscrições Abertas</p>
            </div>
            <div class="widget widget-dinheiro">
                <h3>Total Arrecadado (€)</h3>
                <p class="widget-numero">€ 1 245,50</p>
                <p class="widget-detalhe">Vendas de Bilhetes Normal e VIP</p>
            </div>
            <div class="widget">
                <h3>Participantes Registados</h3>
                <p class="widget-numero">154</p>
                <p class="widget-detalhe">Inclui todos os eventos</p>
            </div>
            <div class="widget widget-cta">
                <h3>Próxima Ação: Descontos?</h3>
                <a href="gerir_eventos.html" class="btn btn-secundario btn-full">Gerir Descontos</a>
            </div>
        </div>
    `;
}

function gerarConteudoParticipante(nome) {
    // Conteúdo focado em atividades pessoais, agenda e bilhetes (Requisitos de Participante)
    return `
        <h2>Minhas Atividades e Agenda</h2>
        <div class="widgets-grid">
            <div class="widget">
                <h3>Inscrições Ativas</h3>
                <p class="widget-numero">2</p>
                <p class="widget-detalhe">Um evento tem alteração de local (Notificado)</p>
            </div>
            <div class="widget widget-agenda">
                <h3>Próximo Evento</h3>
                <p class="widget-numero">Conferência Web Dev</p>
                <p class="widget-detalhe">Dia: 2025/11/25 | Hora: 14:30</p>
            </div>
            <div class="widget">
                <h3>Atividades Favoritas</h3>
                <p class="widget-numero">5</p>
                <p class="widget-detalhe">Lembretes Automáticos Ativados</p>
            </div>
            <div class="widget widget-cta">
                <h3>Necessita de Reembolso?</h3>
                <a href="reembolsos.html" class="btn btn-primario btn-full">Processar Reembolso</a>
            </div>
        </div>
    `;
}