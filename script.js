// Efeito de Fundo Animado Automático (Partículas Tecnológicas)
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const numParticles = 25;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none opacity-20 animate-pulse z-0';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.backgroundColor = i % 2 === 0 ? '#FB8500' : '#FF4D4D';
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        body.appendChild(particle);
    }
});

// Variável global para armazenar os projetos carregados
let globalProjetos = [];
let categoriaAtiva = '';

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        globalProjetos = await response.json();
        
        if (globalProjetos && globalProjetos.length > 0) {
            // Definir a primeira categoria como ativa por predefinição
            const categoriasUnicas = [...new Set(globalProjetos.map(p => p.categoria || 'software-tools'))];
            categoriaAtiva = categoriasUnicas[0];
        }
        
        renderizarInterfaceCategorias();
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('projetos-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function mudarCategoria(cat) {
    categoriaAtiva = cat;
    renderizarInterfaceCategorias();
}

function renderizarInterfaceCategorias() {
    const container = document.getElementById('projetos-container');
    if (!container) return;

    if (!globalProjetos || globalProjetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    // Configuração e títulos das categorias
    const categoriasConfig = {
        'discord-bots': { title: '🤖 discord-bots', desc: 'Automação para comunidades, bots de moderação e sistemas interativos.' },
        'software-tools': { title: '🛠️ software-tools', desc: 'Ferramentas utilitárias e de automação de sistema.' },
        'game-development': { title: '🎮 game-development', desc: 'Desenvolvimento de videojogos 2D/3D e protótipos interativos.' },
        'web-development': { title: '🌐 web-development', desc: 'Aplicações web modernas, plataformas SaaS e APIs de alta performance.' },
        'websites-landing': { title: '🌐 websites-landing', desc: 'Sites institucionais com alta performance e otimização total de SEO.' },
        'pauerhelps-sos': { title: '🚨 pauerhelps-sos', desc: 'Centro de assistência técnica urgente e suporte especializado.' }
    };

    // Agrupar projetos por categoria
    const agrupados = {};
    globalProjetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    const categoriasDisponiveis = Object.keys(agrupados);
    if (!categoriaAtiva || !agrupados[categoriaAtiva]) {
        categoriaAtiva = categoriasDisponiveis[0];
    }

    // 1. Renderizar a barra de abas / File Explorer no topo (igual à tua imagem de referência)
    let tabsHtml = `
    <div class="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        <div class="flex flex-wrap items-center gap-3 pb-6 border-b border-slate-800/80">
    `;

    categoriasDisponiveis.forEach(cat => {
        const isActive = cat === categoriaAtiva;
        const count = agrupados[cat].length;
        const config = categoriasConfig[cat] || { title: `📁 ${cat}` };

        tabsHtml += `
            <button onclick="mudarCategoria('${cat}')" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs transition-all border ${
                isActive 
                    ? 'bg-slate-900 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/5' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }">
                <span>📁</span>
                <span>/${cat}</span>
                <span class="px-2 py-0.5 rounded-md ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-500'} font-bold">${count} Repos</span>
            </button>
        `;
    });

    tabsHtml += `
        </div>
    </div>
    `;

    // 2. Renderizar o conteúdo da categoria ativa
    const projsCat = agrupados[categoriaAtiva] || [];
    const activeConfig = categoriasConfig[categoriaAtiva] || { title: `📁 ${categoriaAtiva}`, desc: 'Projetos da categoria.' };

    let contentHtml = `
    <section class="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div class="mb-8">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                ${activeConfig.title}
            </h2>
            <p class="text-slate-400 text-sm mt-2 max-w-2xl">${activeConfig.desc}</p>
        </div>

        <div class="space-y-6">
    `;

    projsCat.forEach((proj, pIdx) => {
        let tagsHtml = '';
        if (proj.tags && Array.isArray(proj.tags)) {
            tagsHtml = proj.tags.map(t => `<span class="px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/20 text-xs font-mono shadow-sm">${t}</span>`).join('');
        }

        let printsHtml = '';
        if (proj.imagens && Array.isArray(proj.imagens) && proj.imagens.length > 0) {
            printsHtml = `
            <div class="space-y-2 pt-3 border-t border-slate-800/80">
                <span class="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>📷</span> Capturas de Ecrã (Clica para ampliar)
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${proj.imagens.map((imgUrl, idx) => `
                        <div onclick="abrirModalImagem('${imgUrl}')" class="group relative rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all shadow-md">
                            <img src="${imgUrl}" alt="Print ${idx+1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono">
                                🔍 Ver Imagem
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        const nomePasta = proj.nome ? proj.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') : `projeto-${pIdx}`;

        contentHtml += `
        <div class="studio-card-glow p-6 sm:p-8 border border-slate-800/80 bg-slate-950/95 rounded-2xl shadow-2xl relative overflow-hidden group">
            <!-- Barra superior simulando pasta do projeto -->
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-900 text-xs font-mono text-slate-500">
                <div class="flex items-center gap-2">
                    <span class="text-amber-500">📂</span>
                    <span class="text-slate-300 font-semibold">dir: /${categoriaAtiva}/${nomePasta}/</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">ID: #${proj.id || pIdx + 1}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <!-- LOGO COM DESTAQUE MÁXIMO -->
                <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800/80 text-center relative overflow-hidden group/logo shadow-inner">
                    <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none"></div>
                    <div class="w-32 h-32 rounded-2xl bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center text-6xl shadow-2xl mb-4 z-10 overflow-hidden transform group-hover/logo:scale-105 transition-transform duration-300">
                        ${proj.logo && proj.logo.startsWith('http') ? `<img src="${proj.logo}" alt="Logo" class="w-full h-full object-cover">` : (proj.logo || '⚡')}
                    </div>
                    <h4 class="text-xl font-black text-white z-10 tracking-wide">${proj.nome}</h4>
                    <span class="text-xs font-mono text-amber-400 z-10 mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">${proj.categoria}</span>
                </div>

                <!-- CONTEÚDO E DETALHES -->
                <div class="lg:col-span-8 space-y-5">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">${proj.nome}</h3>
                        ${proj.link ? `<a href="${proj.link}" target="_blank" class="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-xs font-mono text-amber-400 font-semibold transition-all shadow-md flex items-center gap-1.5"><span>Ver Repositório / Demo</span> <span>↗</span></a>` : ''}
                    </div>

                    <p class="text-sm text-slate-300 leading-relaxed font-sans">${proj.descricao}</p>

                    ${printsHtml}

                    <div class="flex flex-wrap gap-2 pt-2">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        </div>`;
    });

    contentHtml += `</div></section>`;

    container.innerHTML = tabsHtml + contentHtml;
}

// Criar o Modal de Visualização de Imagens Dinamicamente no DOM
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('modal-imagem-container')) {
        const modalHtml = `
            <div id="modal-imagem-container" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
                <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                    <button onclick="fecharModalImagem()" class="absolute -top-10 right-0 text-slate-400 hover:text-white font-mono text-sm px-3 py-1 rounded bg-slate-800 border border-slate-700 transition-colors">
                        ✕ Fechar [ESC]
                    </button>
                    <img id="modal-imagem-src" src="" alt="Zoom Print" class="max-w-full max-h-[80vh] rounded-xl border border-slate-700 object-contain shadow-2xl">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
});

function abrirModalImagem(url) {
    const modal = document.getElementById('modal-imagem-container');
    const img = document.getElementById('modal-imagem-src');
    if (modal && img) {
        img.src = url;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function fecharModalImagem() {
    const modal = document.getElementById('modal-imagem-container');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModalImagem();
});

// Lógica de submissão do formulário de contacto
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('form-nome').value;
        const email = document.getElementById('form-email').value;
        const categoria = document.getElementById('form-select').value;
        const mensagem = document.getElementById('form-msg').value;

        try {
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, categoria, mensagem })
            });

            if (response.ok) {
                alert('Pedido enviado com sucesso para a base de dados do PauerDev.help!');
                formContacto.reset();
            } else {
                alert('Erro ao enviar o pedido. Tenta novamente mais tarde.');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro de ligação ao servidor.');
        }
    });
}

// Lógica da Consola / Terminal CLI Interativo
const input = document.getElementById('terminal-input');
const body = document.getElementById('terminal-body');

if (input && body) {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const rawCmd = this.value.trim();
            const cmd = rawCmd.toLowerCase();
            
            const cmdLine = document.createElement('div');
            cmdLine.className = 'text-amber-400 font-semibold';
            cmdLine.textContent = '> ' + rawCmd;
            body.appendChild(cmdLine);

            let resp = '';
            
            if (cmd === 'pauer --help' || cmd === 'help') {
                resp = "COMANDOS DISPONÍVEIS:\n • pauer --discord   : Ir para secção /discord-bots\n • pauer --software  : Ir para secção /software-tools\n • pauer --games     : Ir para secção /game-development\n • pauer --web       : Ir para secção /web-development\n • pauer --rescue    : Ir para o SOS PauerHelps\n • clear             : Limpar ecrã";
            } else if (cmd === 'pauer --discord') {
                mudarCategoria('discord-bots');
                document.getElementById('projetos-container')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /discord-bots...";
            } else if (cmd === 'pauer --software') {
                mudarCategoria('software-tools');
                document.getElementById('projetos-container')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /software-tools...";
            } else if (cmd === 'pauer --games') {
                mudarCategoria('game-development');
                document.getElementById('projetos-container')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /game-development...";
            } else if (cmd === 'pauer --web') {
                mudarCategoria('web-development');
                document.getElementById('projetos-container')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /web-development...";
            } else if (cmd === 'pauer --rescue') {
                mudarCategoria('pauerhelps-sos');
                document.getElementById('pauerhelps')?.scrollIntoView({ behavior: 'smooth' });
                resp = "🚨 PauerHelps SOS ativado!";
            } else if (cmd === 'clear') {
                body.innerHTML = '';
                this.value = '';
                return;
            } else {
                resp = "Comando '" + rawCmd + "' não reconhecido. Escreve 'pauer --help'.";
            }

            const respLine = document.createElement('div');
            respLine.className = 'text-emerald-400 whitespace-pre-wrap';
            respLine.textContent = resp;
            body.appendChild(respLine);
            
            body.scrollTop = body.scrollHeight;
            this.value = '';
        }
    });
}

function selectEmergency(label) {
    const select = document.getElementById('form-select');
    const msg = document.getElementById('form-msg');
    const contacto = document.getElementById('contacto');

    if (select) select.value = 'rescue';
    if (msg) msg.value = '[SOS URGENTE]: ' + label + '. Necessito de assistência técnica urgente.';
    if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
}