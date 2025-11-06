const historyList = document.getElementById('historyList');
const searchDate = document.getElementById('searchDate');
const clearSelected = document.getElementById('clearSelected');
const selectAllBtn = document.getElementById('selectAll');

function renderizarHistorico() {
  if (!historyList) return;

  let historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
  const filtro = searchDate?.value;
  historyList.innerHTML = '';

  historico.forEach((item, index) => {
    const dataFormatada = item.data.split(' ')[0].split('/').reverse().join('-');
    if (filtro && dataFormatada !== filtro) return;

    const li = document.createElement('li');
    li.classList.add('history-item');

    // Se for tipo link, cria o <a>; senão, apenas texto
    const conteudo =
      item.tipo === 'link'
        ? `<a href="${item.valor}" target="_blank" class="history-link">
            <i class="fas fa-link"></i> ${item.valor}
           </a>`
        : `<i class="fas fa-image"></i> ${item.valor}`;

    li.innerHTML = `
      <label>
        <input type="checkbox" data-index="${index}">
        ${conteudo}
        <span class="date">${item.data}</span>
      </label>
    `;

    historyList.appendChild(li);
  });

  if (historyList.innerHTML === '') {
    historyList.innerHTML = '<li>Nenhum registro encontrado.</li>';
    selectAllBtn.style.display = 'none';
    return;
  }

  selectAllBtn.style.display = 'block';
  selectAllBtn.textContent = 'Selecionar Todos';
}

function toggleSelectAll() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => (cb.checked = !allChecked));
  selectAllBtn.textContent = allChecked ? 'Selecionar Todos' : 'Desmarcar Todos';
}

// Eventos
if (searchDate) searchDate.addEventListener('change', renderizarHistorico);
if (selectAllBtn) selectAllBtn.addEventListener('click', toggleSelectAll);
if (clearSelected)
  clearSelected.addEventListener('click', () => {
    let historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    historico = historico.filter((_, i) => !indices.includes(i));
    localStorage.setItem('historicoBuscas', JSON.stringify(historico));
    renderizarHistorico();
  });

renderizarHistorico();
