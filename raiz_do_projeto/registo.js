document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter referências dos elementos do DOM (Baseado nos IDs do seu HTML)
    const formRegisto = document.getElementById('form-registo');
    const emailInput = document.getElementById('registo-email');
    const passwordInput = document.getElementById('registo-password');
    const confirmPasswordInput = document.getElementById('registo-password2');
    // Usamos 'mensagemRegisto' pois é o ID correto no seu HTML
    const mensagemFeedback = document.getElementById('mensagem-registo'); 

    // Verificação de segurança: Se o formulário não for encontrado, o script para.
    if (!formRegisto) {
        console.error("ERRO: Formulário de registo não encontrado. Verifique o ID 'form-registo'.");
        return;
    }
    
    // 2. Listener para o evento de submissão do formulário
    formRegisto.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        
        // Limpar feedback e estilos anteriores
        mensagemFeedback.textContent = '';
        mensagemFeedback.classList.remove('sucesso', 'erro');
        
        // 3. Obter e limpar os valores dos campos
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Obter o valor do radio button 'perfil' selecionado
        const perfilInput = document.querySelector('input[name="perfil"]:checked');
        const perfil = perfilInput ? perfilInput.value : null;

        // --- 4. VALIDAÇÕES DE UX ---

        // 4.1. Validação de Perfil
        if (!perfil) {
            mensagemFeedback.textContent = 'Erro: Por favor, selecione o tipo de conta (Participante/Organizador).';
            mensagemFeedback.classList.add('erro');
            return;
        }
        
        // 4.2. Validação de Email (Apenas IPCA - Simulação)
        if (!email.endsWith('@ipca.pt') && !email.endsWith('@alunos.ipca.pt')) {
            mensagemFeedback.textContent = 'Erro: O e-mail deve ser institucional (@ipca.pt ou @alunos.ipca.pt).';
            mensagemFeedback.classList.add('erro');
            emailInput.focus();
            return;
        }

        // 4.3. Validação de Comprimento da Palavra-passe
        if (password.length < 6) {
            mensagemFeedback.textContent = 'Erro: A palavra-passe deve ter pelo menos 6 caracteres.';
            mensagemFeedback.classList.add('erro');
            passwordInput.focus();
            return;
        }

        // 4.4. Validação de Confirmação da Palavra-passe
        if (password !== confirmPassword) {
            mensagemFeedback.textContent = 'Erro: As palavras-passe não coincidem. Por favor, verifique.';
            mensagemFeedback.classList.add('erro');
            confirmPasswordInput.focus(); 
            return; 
        }

        // --- 5. SIMULAÇÃO DE ARMAZENAMENTO NO LOCAL STORAGE ---
        
        const novoUtilizador = {
            email: email,
            password: password, // NOTA: Em ambiente real, esta seria a versão HASHED da password.
            perfil: perfil
        };

        const utilizadoresJSON = localStorage.getItem('utilizadoresIPCA');
        const utilizadores = utilizadoresJSON ? JSON.parse(utilizadoresJSON) : [];

        // 5.1. Verificar Duplicidade de E-mail
        const emailExistente = utilizadores.find(u => u.email === email);
        if (emailExistente) {
             mensagemFeedback.textContent = 'Erro: Este e-mail já está registado. Tente iniciar sessão.';
             mensagemFeedback.classList.add('erro');
             return;
        }

        // 5.2. Adicionar e Guardar
        utilizadores.push(novoUtilizador);
        localStorage.setItem('utilizadoresIPCA', JSON.stringify(utilizadores));
        // Guarda também o email do último registado (útil para testes de login)
        localStorage.setItem('emailUtilizador', email); 

        // --- 6. SUCESSO E REDIRECIONAMENTO ---
        
        mensagemFeedback.textContent = `Conta de ${perfil.toUpperCase()} criada com sucesso! Redirecionando para Iniciar Sessão...`;
        mensagemFeedback.classList.add('sucesso');
        
        formRegisto.reset(); // Limpa o formulário após o registo
        
        // Redireciona para a página de LOGIN (login.html)
        setTimeout(() => {
            // NOTE: O seu HTML aponta para 'registo.html', mas deve ser 'login.html' para Iniciar Sessão
            window.location.href = 'login.html'; 
        }, 2000); 
    });
});