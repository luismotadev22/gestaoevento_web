document.addEventListener('DOMContentLoaded', () => {
    //  Obter referências para os elementos do DOM (IDs do seu HTML de login)
    const formLogin = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const mensagemErro = document.getElementById('mensagem-erro');
    
    // Teste de consistência
    if (!formLogin) {
        console.error("ERRO: Formulário de login (ID: form-login) não encontrado.");
        return;
    }

    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        
        // ... (limpar mensagens, obter valores) ...
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // --- VALIDAÇÃO REAL (Simulada com Local Storage) ---
        
        const utilizadoresJSON = localStorage.getItem('utilizadoresIPCA');
        const utilizadores = utilizadoresJSON ? JSON.parse(utilizadoresJSON) : [];

        //  Procurar o utilizador pelo email
        const utilizador = utilizadores.find(u => u.email === email);

        //  Verificar credenciais
        if (utilizador && utilizador.password === password) {
            
          
            
            // Marcar a sessão como ativa e guardar o perfil do utilizador encontrado
            localStorage.setItem('Utilizador Logado', 'true'); 
            localStorage.setItem('Perfil Utilizador', utilizador.perfil); 
            
            // Feedback de sucesso
            mensagemErro.textContent = 'Login bem-sucedido! Acedendo ao Dashboard...';
            mensagemErro.classList.add('sucesso');

            // 3. Redirecionar para o Dashboard (Área Privada)
            setTimeout(() => {
                window.location.href = 'plataforma_gestao/dashboard.html'; 
            }, 1500);

        } else {
            // Falha se o utilizador não for encontrado OU se a password estiver errada
            mensagemErro.textContent = 'Erro: E-mail ou palavra-passe inválida. Tente novamente ou registe-se.';
            mensagemErro.classList.add('erro');
        }
    });
});