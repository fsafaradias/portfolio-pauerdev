const API_URL = '/api';

window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y`, `${e.clientY}px`);
});

// TESTE DE ARRANCAMENTO
console.log("SCRIPT.JS CARREGADO COM SUCESSO!");

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM CARREGADO - A  Fazer FETCH dos projetos...");
    try {
        const response = await fetch('/api/projetos');
        const projetos = await response.json();
        console.log("Projetos recebidos:", projetos);
        renderizarProjetos(projetos);
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
    }
});

function switchTab(tab) {
    const tabPedidos = document.getElementById('tab-pedidos');
    const tabProjetos = document.getElementById('tab-projetos');
    const navPedidos = document.getElementById('nav-pedidos');
    const navProjetos = document.getElementById('nav-projetos');

    if (tab === 'pedidos') {
        tabPedidos.classList.remove('hidden');
        tabProjetos.classList.add('hidden');
        navPedidos.className = "w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 transition-all";
        navProjetos.className = "w-full flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all";
        carregarPedidos();
    } else {
        tabProjetos.classList.remove('hidden');
        tabPedidos.classList.add('hidden');
        navProjetos.className = "w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 transition-all";
        navPedidos.className = "w-full flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all";
        carregarProjetos();
    }
}

// PEDIDOS
async function carregarPedidos() {
    try {
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();
        
        const tbody = document.getElementById('lista-pedidos');
        const badgeCount = document.getElementById('badge-pedidos-count');
        
        badgeCount.textContent = pedidos.length;
        tbody.innerHTML = '';

        if (pedidos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-500 font-mono">Nenhum pedido de orçamento recebido.</td></tr>';
            return;
        }

        pedidos.forEach(item => {
            const tr = document.createElement('tr');
            const isSOS = item.categoria === 'rescue' || item.mensagem.includes('SOS');
            const dataFormatada = item.data ? new Date(item.data).toLocaleString('pt-PT') : 'Data Indisponível';
            
            tr.className = isSOS ? "bg-red-950/20 border-l-2 border-l-red-500" : "hover:bg-slate-900/50";
            tr.innerHTML = `
                <td class="p-4 text-slate-500">${dataFormatada}</td>
                <td class="p-4 font-bold text-white">${item.nome}</td>
                <td class="p-4 text-amber-400">${item.email}</td>
                <td class="p-4">
                    <span class="px-2 py-1 rounded text-[10px] ${isSOS ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'}">
                        ${item.categoria}
                    </span>
                </td>
                <td class="p-4 max-w-xs truncate text-slate-300" title="${item.mensagem}">${item.mensagem}</td>
                <td class="p-4 text-right">
                    <button onclick="eliminarPedido(${item.id})" class="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] transition-all">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
    }
}

async function eliminarPedido(id) {
    if (confirm('Tens a certeza que queres eliminar este pedido?')) {
        try {
            const response = await fetch(`${API_URL}/pedidos/${id}`, { method: 'DELETE' });
            if (response.ok) carregarPedidos();
        } catch (err) {
            console.error('Erro:', err);
        }
    }
}

async function simularNovoPedido() {
    const novoPedido = {
        nome: 'Cliente Teste Local',
        email: 'teste@pauerdev.help',
        categoria: 'discord-bots',
        mensagem: 'Olá! Quero simular um pedido de orçamento via interface admin.'
    };
    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPedido)
        });
        if (response.ok) carregarPedidos();
    } catch (err) {
        console.error('Erro:', err);
    }
}

// PROJETOS
async function carregarProjetos() {
    try {
        const response = await fetch(`${API_URL}/projetos`);
        const projetos = await response.json();
        
        const container = document.getElementById('lista-projetos-admin');
        container.innerHTML = '';

        if (projetos.length === 0) {
            container.innerHTML = '<p class="text-xs text-slate-500 font-mono">Nenhum projeto registado na base de dados.</p>';
            return;
        }

        projetos.forEach(item => {
            const div = document.createElement('div');
            div.className = "studio-card p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3 relative group";
            
            const tags = Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',') : []);
            const tagsHtml = tags.map(t => `<span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">${t.trim()}</span>`).join(' ');

            const imgsCount = Array.isArray(item.imagens) ? item.imagens.length : 0;

            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${item.logo}</span>
                        <div>
                            <h4 class="font-bold text-white text-sm">${item.nome}</h4>
                            <span class="text-[10px] font-mono text-amber-400">${item.categoria} // ${imgsCount} prints extra</span>
                        </div>
                    </div>
                    <button onclick="eliminarProjeto(${item.id})" class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-[10px] font-mono transition-all">
                        Remover
                    </button>
                </div>
                <p class="text-xs text-slate-400 line-clamp-2">${item.descricao || ''}</p>
                <div class="flex flex-wrap gap-1.5 pt-1">${tagsHtml}</div>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Erro ao carregar projetos:', err);
    }
}

async function salvarProjeto(e) {
    e.preventDefault();

    const nome = document.getElementById('proj-nome').value;
    const categoria = document.getElementById('proj-categoria').value;
    const link = document.getElementById('proj-link').value || '#';
    const logo = document.getElementById('proj-logo').value || '⚡';
    const tagsRaw = document.getElementById('proj-tags').value;
    const imagensRaw = document.getElementById('proj-imagens').value;
    const descricao = document.getElementById('proj-desc').value;

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : ['Tech'];
    const imagens = imagensRaw ? imagensRaw.split(',').map(img => img.trim()).filter(img => img.length > 0) : [];

    const novoProjeto = {
        nome,
        categoria,
        logo,
        descricao,
        link,
        tags,
        imagens
    };

    try {
        const response = await fetch(`${API_URL}/projetos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProjeto)
        });

        if (response.ok) {
            document.getElementById('form-add-projeto').reset();
            carregarProjetos();
            alert('Projeto guardado com sucesso na base de dados PostgreSQL!');
        } else {
            alert('Erro ao guardar o projeto no servidor.');
        }
    } catch (err) {
        console.error('Erro de ligação:', err);
        alert('Erro de ligação ao backend.');
    }
}

async function eliminarProjeto(id) {
    if (confirm('Tens a certeza que queres eliminar este projeto?')) {
        try {
            const response = await fetch(`${API_URL}/projetos/${id}`, { method: 'DELETE' });
            if (response.ok) carregarProjetos();
        } catch (err) {
            console.error('Erro:', err);
        }
    }
}