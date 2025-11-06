// ======= CADASTRO =======
async function fazerCadastro() {
    const nome = document.getElementById("cadNome").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const telefone = document.getElementById("cadTelefone").value.trim();
    const senha = document.getElementById("cadSenha").value.trim();

    if (!nome || !email || !telefone || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, telefone, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro ao cadastrar: " + (dados.erro || "Tente novamente."));
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
        console.error(erro);
    }
}

// ======= LOGIN =======
async function fazerLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();

    if (!email || !senha) {
        alert("Preencha email e senha!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Login realizado com sucesso!");

            localStorage.setItem("isLogged", "true");
            localStorage.setItem("userId", dados.id_usu);
            localStorage.setItem("userName", dados.nome);
            localStorage.setItem("userEmail", email);

            window.location.href = "../index.html";
        } else {
            alert(dados.erro || "Falha no login.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
        console.error(erro);
    }
}