const API_URL = "http://localhost:5000";

// Dados de Carros de Luxo (Requisito 03.2)
const carrosLuxo = {
    "Porsche": ["911 Carrera", "Cayenne", "Taycan", "Panamera", "Macan"],
    "Ferrari": ["F8 Tributo", "Roma", "SF90 Stradale", "812 Superfast"],
    "Lamborghini": ["Aventador", "Huracán", "Urus"],
    "BMW": ["M3", "M5", "X7", "i7", "Z4"],
    "Mercedes-Benz": ["AMG GT", "Classe G", "S-Class", "EQS"],
    "Audi": ["R8", "RS6", "e-tron GT", "Q8"],
    "Rolls-Royce": ["Phantom", "Ghost", "Cullinan"],
    "Bentley": ["Continental GT", "Bentayga", "Flying Spur"],
    "Aston Martin": ["DB11", "Vantage", "DBS"],
    "McLaren": ["720S", "Artura", "GT"]
};

// --- NAVEGAÇÃO SPA ---
function showPage(pageId) {
    document.querySelectorAll('.spa-page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    
    if(pageId === 'consulta') carregarAgendamentos();
    if(pageId === 'dashboard') renderizarGrafico();
}

// --- LÓGICA DO FORMULÁRIO ---
function carregarMarcas() {
    const select = document.getElementById('marca');
    Object.keys(carrosLuxo).forEach(marca => {
        let opt = new Option(marca, marca);
        select.add(opt);
    });
}

function carregarModelos() {
    const marca = document.getElementById('marca').value;
    const modeloSelect = document.getElementById('modelo');
    modeloSelect.innerHTML = '<option value="">Selecione...</option>';
    
    if(marca) {
        carrosLuxo[marca].forEach(mod => {
            modeloSelect.add(new Option(mod, mod));
        });
        modeloSelect.disabled = false;
    } else {
        modeloSelect.disabled = true;
    }
}

// --- INTEGRAÇÃO COM API ---
document.getElementById('formAgendamento').onsubmit = async (e) => {
    e.preventDefault();
    
    const dados = {
        placa: document.getElementById('placa').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        data: document.getElementById('data').value,
        km: document.getElementById('km').value,
        servico: document.getElementById('servico').value,
        obs: document.getElementById('obs').value
    };

    try {
        const res = await fetch(`${API_URL}/agendar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
        const result = await res.json();

        if(res.ok) {
            document.getElementById('codigoGerado').innerText = `ID do Agendamento: ${result.codigo}`;
            const overlay = document.getElementById('overlay');
            overlay.classList.remove('d-none');
            
            setTimeout(() => {
                overlay.classList.add('d-none');
                showPage('consulta');
                e.target.reset();
            }, 1500);
        } else {
            alert(result.message);
        }
    } catch (err) { alert("Erro ao conectar com a API"); }
};

async function carregarAgendamentos() {
    const res = await fetch(`${API_URL}/agendamentos`);
    const dados = await res.json();
    const tabela = document.getElementById('tabelaAgendamentos');
    tabela.innerHTML = '';

    dados.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>#${item.codigo}</td>
                <td>${item.placa}</td>
                <td>${item.marca}</td>
                <td>${item.modelo}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-obs me-1" onclick="mostrarObs('${escapeHtml(item.obs || '')}')" title="Observação"><img src="ícones/text_snippet-white.svg" class="icon-sm" alt="OBS"></button>
                </td>
                <td><span class="badge bg-secondary">${item.status}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-success btn-action me-1" onclick="atualizarStatus('${item.codigo}', 'Concluido')" title="Concluir"><img src="ícones/check-black.svg" class="icon-sm" alt="Concluir"></button>
                    <button class="btn btn-sm btn-warning btn-action me-1" title="Editar"><img src="ícones/edit-black.svg" class="icon-sm" alt="Editar"></button>
                    <button class="btn btn-sm btn-danger btn-action me-1" onclick="atualizarStatus('${item.codigo}', 'Cancelado')" title="Cancelar"><img src="ícones/close-black.svg" class="icon-sm" alt="Cancelar"></button>
                    <button class="btn btn-sm btn-secondary btn-action" onclick="deletar('${item.codigo}')" title="Excluir"><img src="ícones/Delete-black.svg" class="icon-sm" alt="Excluir"></button>
                </td>
            </tr>
        `;
    });

    // Atualiza o dashboard (contadores e gráfico) sempre que recarregar a lista
    renderizarGrafico();
}

function mostrarObs(obs) {
    const overlay = document.getElementById('overlayObs');
    document.getElementById('obsContent').innerText = obs || 'Sem observação.';
    overlay.classList.remove('d-none');
}

function fecharObs() { document.getElementById('overlayObs').classList.add('d-none'); }

// auxiliares para evitar XSS em atributo onclick
function escapeHtml(text) { return String(text).replace(/'/g, "\\'").replace(/\n/g, '\\n'); }

// --- Validação e máscara de placas ---
const placaInput = document.getElementById('placa');
const tipoPlaca = document.getElementById('tipoPlaca');

placaInput.addEventListener('input', e => { e.target.value = e.target.value.toUpperCase(); });

tipoPlaca.addEventListener('change', () => {
    const tipo = tipoPlaca.value;
    if(tipo === 'mercosul') {
        placaInput.pattern = '^[A-Z]{3}-\\d[A-Z]\\d{2}$';
        placaInput.placeholder = 'Ex: ABC-1A23';
        placaInput.title = 'Formato Mercosul: ABC-1A23';
    } else {
        placaInput.pattern = '^[A-Z]{3}-\\d{4}$';
        placaInput.placeholder = 'Ex: ABC-1234';
        placaInput.title = 'Formato Comum: ABC-1234';
    }
});

// Reinicia o padrão ao carregar a página
if(tipoPlaca) tipoPlaca.dispatchEvent(new Event('change'));

// Validação no submit adicional
const formAgendamento = document.getElementById('formAgendamento');
formAgendamento.addEventListener('submit', (e) => {
    const patt = new RegExp(placaInput.pattern);
    if(!patt.test(placaInput.value)) {
        e.preventDefault();
        alert('Placa inválida para o tipo selecionado. Verifique o formato.');
        placaInput.focus();
    }
});

// utilitário: normaliza texto de status para chaves previsíveis
function normalizeStatus(s) {
    if(!s) return 'Agendado';
    // remove acentos e lower-case
    const t = String(s).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if(t.includes('agend')) return 'Agendado';
    if(t.includes('concl')) return 'Concluido';
    if(t.includes('cancel')) return 'Cancelado';
    // fallback mantendo o original capitalizado
    return s;
}

// --- Dashboard: renderização e cards interativos ---
async function renderizarGrafico() {
    const res = await fetch(`${API_URL}/agendamentos`);
    const dados = await res.json();

    // contabiliza independentemente de variações de texto/acento
    const stats = { 'Agendado': 0, 'Concluido': 0, 'Cancelado': 0 };
    dados.forEach(d => {
        const key = normalizeStatus(d.status);
        if(stats.hasOwnProperty(key)) stats[key]++;
    });

    // atualizar os contadores dos cards com fallback 0
    const elAg = document.getElementById('count-agendado');
    const elCo = document.getElementById('count-concluido');
    const elCa = document.getElementById('count-cancelado');
    if(elAg) elAg.innerText = stats['Agendado'] ?? 0;
    if(elCo) elCo.innerText = stats['Concluido'] ?? 0;
    if(elCa) elCa.innerText = stats['Cancelado'] ?? 0;

    const ctx = document.getElementById('statusChart').getContext('2d');
    if(window.meuGrafico) window.meuGrafico.destroy();

    window.meuGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                data: Object.values(stats),
                backgroundColor: ['#ffbd59', '#89a950', '#ff5757'],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#cbcbcb' } } },
            elements: { arc: { borderWidth: 0 } },
            layout: { padding: { top: 6, bottom: 6 } }
        }
    });

    // adicionar comportamento clicável nos cards
    ['Agendado','Concluido','Cancelado'].forEach(status => {
        const el = document.querySelector(`#card-${status.toLowerCase()}`);
        if(el) {
            el.onclick = () => {
                // alterna ativo
                document.querySelectorAll('.status-card').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                // evidencia o segmento: torna os outros cinzas
                const colors = ['#d6d6d6','#d6d6d6','#d6d6d6'];
                const idx = Object.keys(stats).indexOf(status);
                if(idx >= 0) colors[idx] = ['#4fd1c5','#198754','#dc3545'][idx];
                window.meuGrafico.data.datasets[0].backgroundColor = colors;
                window.meuGrafico.update();
            };
        }
    });
}

async function atualizarStatus(codigo, novoStatus) {
    await fetch(`${API_URL}/agendamento/${codigo}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: novoStatus })
    });
    await carregarAgendamentos();
}

async function deletar(codigo) {
    if(confirm("Deseja excluir?")) {
        await fetch(`${API_URL}/agendamento/${codigo}`, { method: 'DELETE' });
        await carregarAgendamentos();
    }
}

// Busca na Nav
async function buscarNav(e) {
    e.preventDefault();
    const termo = document.getElementById('navSearch').value;
    const res = await fetch(`${API_URL}/consultar/${termo}`);
    const data = await res.json();
    
    if(res.ok) {
        showPage('consulta');
        // Filtra a tabela visualmente (simplificado)
        alert(`Agendamento encontrado: ${data.marca} ${data.modelo} - Status: ${data.status}`);
    } else {
        alert("Agendamento não encontrado.");
    }
}


// Iniciar
carregarMarcas();