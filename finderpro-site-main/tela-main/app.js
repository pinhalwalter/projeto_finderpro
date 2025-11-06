// -------------------- ELEMENTOS --------------------
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const loginBtn = document.getElementById('loginBtn');
const profileInfo = document.getElementById('profileInfo');
const changePass = document.getElementById('changePass');
const historyBtn = document.getElementById('history');
const logoutBtn = document.getElementById('logoutBtn');

// -------------------- ESTADOS --------------------
function setLoggedOut() {
  loginBtn.style.display = 'flex';
  profileInfo.style.display = 'none';
  changePass.style.display = 'none';
  historyBtn.style.display = 'none';
  logoutBtn.style.display = 'none';
  localStorage.setItem('isLogged', 'false');
}

function setLoggedIn(userName, userEmail) {
  loginBtn.style.display = 'none';
  profileInfo.style.display = 'block';
  changePass.style.display = 'flex';
  historyBtn.style.display = 'flex';
  logoutBtn.style.display = 'flex';

  profileInfo.querySelector('p strong').textContent = userName;
  profileInfo.querySelectorAll('p')[1].textContent = userEmail;

  localStorage.setItem('isLogged', 'true');
  localStorage.setItem('userName', userName);
  localStorage.setItem('userEmail', userEmail);
}

// -------------------- INICIALIZA ESTADO --------------------
if (localStorage.getItem('isLogged') === 'true') {
  setLoggedIn(localStorage.getItem('userName'), localStorage.getItem('userEmail'));
} else {
  setLoggedOut();
}

// -------------------- ABRIR / FECHAR MENU --------------------
profileBtn.addEventListener('click', () => {
  profileMenu.classList.toggle('active');
});

changePass.addEventListener('click', () => {
  window.location.href = 'login-cadastro/mudar-senha.html';
});

// Fecha o menu do perfil ao clicar fora dele
document.addEventListener('click', (e) => {
  if (
    profileMenu.classList.contains('active') &&
    !profileMenu.contains(e.target) &&
    e.target !== profileBtn
  ) {
    profileMenu.classList.remove('active');
  }
});

// -------------------- BOTÃO ADICIONAR CONTA --------------------
loginBtn.addEventListener('click', () => {
  window.location.href = 'login-cadastro/login.html';
});

// -------------------- BOTÃO SAIR --------------------
logoutBtn.addEventListener('click', () => {
  setLoggedOut();
  profileMenu.classList.remove('active');
});


// =================== HISTÓRICO ===================
function salvarBusca(tipo, valor) {
  const agora = new Date();
  const dataHora =
    agora.toLocaleDateString('pt-BR') +
    ' ' +
    agora.toLocaleTimeString('pt-BR');
  let historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
  historico.unshift({ tipo, valor, data: dataHora });
  if (historico.length > 50) historico.pop();
  localStorage.setItem('historicoBuscas', JSON.stringify(historico));
}

// Formulário texto
const formTexto = document.getElementById('form-texto');
if (formTexto) {
  formTexto.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = document.getElementById('q').value;
    if (!valor) return;
    salvarBusca('link', valor); // salva no histórico
    document.getElementById('q').value = ''; // limpa o input
  });
}

// Formulário imagem
const formImagem = document.getElementById('form-imagem');
if (formImagem) {
  formImagem.addEventListener('submit', (e) => {
    e.preventDefault();
    const arquivo = document.getElementById('img').files[0];
    if (!arquivo) return;
    salvarBusca('imagem', arquivo.name); // salva no histórico
    document.getElementById('img').value = ''; // limpa o input
  });
}
