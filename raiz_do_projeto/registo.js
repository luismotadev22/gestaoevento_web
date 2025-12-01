document.addEventListener('DOMContentLoaded', () => {
    // Obter referências dos elementos do DOM (Baseado nos IDs do HTML)
    const formRegisto = document.getElementById('form-registo');
    const emailInput = document.getElementById('registo-email');
    const passwordInput = document.getElementById('registo-password');
    const confirmPasswordInput = document.getElementById('registo-password2');
    const mensagemFeedback = document.getElementById('mensagem-registo');     // Usar 'mensagemRegisto' pois é o ID correto do HTML

    // Verificação de segurança: Se o formulário não for encontrado, o script para.
    if (!formRegisto) {
        console.error("ERRO: Formulário de registo não encontrado. Verifique o ID 'form-registo'.");
        return;
    }
    
    // Listener para o evento de submissão do formulário
    formRegisto.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        
        // Limpar feedback e estilos anteriores
        mensagemFeedback.textContent = '';
        mensagemFeedback.classList.remove('sucesso', 'erro');
        
        // Obter e limpar os valores dos campos
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Obter o valor do radio button 'perfil' selecionado
        const perfilInput = document.querySelector('input[name="perfil"]:checked');
        const perfil = perfilInput ? perfilInput.value : null;

    

        // Validação de Perfil
        if (!perfil) {
            mensagemFeedback.textContent = 'Erro: Por favor, selecione o tipo de conta (Participante/Organizador).';
            mensagemFeedback.classList.add('erro');
            return;
        }
        
        // Validação de Email (Apenas IPCA - Simulação)
        if (!email.endsWith('@ipca.pt') && !email.endsWith('@alunos.ipca.pt')) {
            mensagemFeedback.textContent = 'Erro: O e-mail deve ser institucional (@ipca.pt ou @alunos.ipca.pt).';
            mensagemFeedback.classList.add('erro');
            emailInput.focus();
            return;
        }

        // Validação de Comprimento da Palavra-passe
        if (password.length < 6) {
            mensagemFeedback.textContent = 'Erro: A palavra-passe deve ter pelo menos 6 caracteres.';
            mensagemFeedback.classList.add('erro');
            passwordInput.focus();
            return;
        }

        // Validação de Confirmação da Palavra-passe
        if (password !== confirmPassword) {
            mensagemFeedback.textContent = 'Erro: As palavras-passe não coincidem. Por favor, verifique.';
            mensagemFeedback.classList.add('erro');
            confirmPasswordInput.focus(); 
            return; 
        }

        // SIMULAÇÃO DE ARMAZENAMENTO NO LOCAL STORAGE
        
        const novoUtilizador = {
            email: email,
            password: password, 
            perfil: perfil
        };

        const utilizadoresJSON = localStorage.getItem('utilizadoresIPCA');
        const utilizadores = utilizadoresJSON ? JSON.parse(utilizadoresJSON) : [];

        // Verificar Duplicidade de E-mail
        const emailExistente = utilizadores.find(u => u.email === email);
        if (emailExistente) {
             mensagemFeedback.textContent = 'Erro: Este e-mail já está registado. Tente iniciar sessão.';
             mensagemFeedback.classList.add('erro');
             return;
        }

        // Adicionar e Guardar
        utilizadores.push(novoUtilizador);
        localStorage.setItem('utilizadoresIPCA', JSON.stringify(utilizadores));
        localStorage.setItem('emailUtilizador', email); 

        //  Sucesso e Redirecionamento para Login
        mensagemFeedback.textContent = `Conta de ${perfil.toUpperCase()} criada com sucesso! Redirecionando para Iniciar Sessão...`;
        mensagemFeedback.classList.add('sucesso');
        
        formRegisto.reset(); // Limpa o formulário após o registo
        
        // Redireciona para a página de login (login.html)
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 2000); 
    });
});