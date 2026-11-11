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

let globalProjetos = [];
let pastaAtiva = '';
let projetoAtivoIndex = {}; // Guarda qual o index do projeto selecionado em cada pasta

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        globalProjetos = await response.json();
        
        if (globalProjetos && globalProjetos.length > 0) {
            const categoriasUnicas = [...new Set(globalProjetos.map(p => p.categoria || 'software-tools'))];
            pastaAtiva = categoriasUnicas[0];
            categoriasUnicas.forEach(cat => { projetoAtivoIndex[cat] = 0; });
        }
        
        renderizarExploradorPastas();
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('projetos-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function mudarPasta(pasta) {
    pastaAtiva = pasta;
    renderizarExploradorPastas();
}

function selecionarProjetoNaPasta(pasta, index) {
    projetoAtivoIndex[pasta] = index;
    renderizarExploradorPastas();
}

function renderizarExploradorPastas() {
    const container = document.getElementById('projetos-container');
    if (!container) return;

    if (!globalProjetos || globalProjetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    // Configuração das pastas / categorias
    const pastasConfig = {
        'discord-bots': { label: '/discord-bots', title: '🤖 Bots de Discord & Automação de Comunidades', desc: 'Sistemas interativos, moderação avançada e bots de alta performance.' },
        'software-tools': { label: '/automacao-scripts', title: '🛠️ Automação, Scripts & Ferramentas', desc: 'Scripts construídos para extração maciça de dados, utilitários e automação de sistema.' },
        'game-development': { label: '/game-development', title: '🎮 Desenvolvimento de Videojogos', desc: 'Prototipagem 2D/3D e experiências interativas.' },
        'web-development': { label: '/web-apps-saas', title: '🌐 Web Apps & SaaS', desc: 'Aplicações web modernas, plataformas SaaS e APIs robustas.' },
        'websites-landing': { label: '/websites-landing', title: '🌐 Websites High-Performance & Landing Pages', desc: 'Sites institucionais com 100/100 no Lighthouse e otimização total de SEO.' },
        'pauerhelps-sos': { label: '/pauerhelps-sos', title: '🚨 PauerHelps - Centro de Assistência Técnica', desc: 'Suporte especializado urgente e resolução de falhas críticas.', isPriority: true }
    };

    // Agrupar projetos por categoria
    const agrupados = {};
    globalProjetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    const chavesPastas = Object.keys(agrupados);
    if (!pastaAtiva || !agrupados[pastaAtiva]) {
        pastaAtiva = chavesPastas[0];
    }

    // 1. Renderizar as Abas / Pastas Superiores (Estilo IDE / Desktop OS)
    let html = `
    <section id="servicos" class="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div class="mb-8">
            <h2 class="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase mb-2">// Pastas de Serviços & GitHub Live</h2>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-white">Arquivos de Projetos Interativos</h3>
        </div>

        <!-- Abas de Pastas -->
        <div class="flex flex-wrap items-end gap-2 border-b border-slate-800">
    `;

    chavesPastas.forEach(cat => {
        const isAtiva = cat === pastaAtiva;
        const config = pastasConfig[cat] || { label: `/${cat}` };
        const qtdRepos = agrupados[cat].length;
        const isPriority = config.isPriority;

        let estiloBotao = isAtiva 
            ? "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg"
            : "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300";

        if (isPriority && !isAtiva) {
            estiloBotao = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-950/60 text-slate-500 border border-transparent hover:text-red-400";
        } else if (isPriority && isAtiva) {
            estiloBotao = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-900 text-red-400 border border-slate-800 border-b-0 shadow-lg";
        }

        html += `
            <button onclick="mudarPasta('${cat}')" class="${estiloBotao}">
                📁 <span>${config.label}</span>
                <span class="px-2 py-0.5 rounded-full ${isPriority ? 'bg-red-500/20 text-red-400' : (isAtiva ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400')} text-[10px]">${isPriority ? 'Priority' : qtdRepos + ' Repos'}</span>
            </button>
        `;
    });

    html += `
        </div>

        <!-- Corpo da Pasta Aberta -->
        <div class="p-8 rounded-b-3xl studio-card-glow border border-slate-800 bg-slate-950/90 min-h-[420px] shadow-2xl relative">
    `;

    // Projetos da pasta selecionada atualmente
    const projsDaPasta = agrupados[pastaAtiva] || [];
    if (!projetoAtivoIndex[pastaAtiva] || projetoAtivoIndex[pastaAtiva] >= projsDaPasta.length) {
        projetoAtivoIndex[pastaAtiva] = 0;
    }
    const idxAtual = projetoAtivoIndex[pastaAtiva];
    const projSelecionado = projsDaPasta[idxAtual];
    const configPastaAtiva = pastasConfig[pastaAtiva] || { title: pastaAtiva, desc: 'Repositórios da categoria.' };

    html += `
            <!-- Cabeçalho da Pasta -->
            <div class="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-6 mb-8 gap-4">
                <div>
                    <h4 class="text-xl font-bold text-white flex items-center gap-2">
                        ${configPastaAtiva.title}
                    </h4>
                    <p class="text-xs text-slate-400 mt-1">${configPastaAtiva.desc}</p>
                </div>
                <a href="https://github.com/fsafaradias" target="_blank" class="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-amber-400 transition-all flex items-center gap-2">
                    <span>github.com/fsafaradias</span> ↗
                </a>
            </div>
    `;

    // Se houver mais do que um projeto nesta pasta, mostrar mini-seletor de subpastas/repositórios
    if (projsDaPasta.length > 1) {
        html += `
            <div class="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span class="text-slate-500 mr-2">// Repositórios na pasta:</span>
        `;
        projsDaPasta.forEach((p, i) => {
            const isSelected = i === idxAtual;
            html += `
                <button onclick="selecionarProjetoNaPasta('${pastaAtiva}', ${i})" class="px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSelected 
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold shadow' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }">
                    <span>📂</span>
                    <span>${p.nome || 'projeto-' + (i+1)}</span>
                </button>
            `;
        });
        html += `</div>`;
    }

    if (projSelecionado) {
        let tagsHtml = '';
        if (projSelecionado.tags && Array.isArray(projSelecionado.tags)) {
            tagsHtml = projSelecionado.tags.map(t => `<span class="px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/20 text-xs font-mono shadow-sm">${t}</span>`).join('');
        }

        let printsHtml = '';
        if (projSelecionado.imagens && Array.isArray(projSelecionado.imagens) && projSelecionado.imagens.length > 0) {
            printsHtml = `
            <div class="space-y-2 pt-4 border-t border-slate-800/80 mt-6">
                <span class="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>📷</span> Capturas de Ecrã (Clica para ampliar)
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${projSelecionado.imagens.map((imgUrl, imgIdx) => `
                        <div onclick="abrirModalImagem('${imgUrl}')" class="group relative rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all shadow-md">
                            <img src="${imgUrl}" alt="Print ${imgIdx+1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono">
                                🔍 Ver Imagem
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        const nomePastaProj = projSelecionado.nome ? projSelecionado.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'projeto';

        html += `
        <!-- Cartão Detalhado do Projeto Ativo -->
        <div class="studio-card-glow p-6 sm:p-8 border border-slate-800/80 bg-slate-950/95 rounded-2xl shadow-xl relative overflow-hidden group">
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-900 text-xs font-mono text-slate-500">
                <div class="flex items-center gap-2">
                    <span class="text-amber-500">📂</span>
                    <span class="text-slate-300 font-semibold">dir: /${pastaAtiva}/${nomePastaProj}/</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">ID: #${projSelecionado.id || 1}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <!-- LOGO COM DESTAQUE MÁXIMO -->
                <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800/80 text-center relative overflow-hidden group/logo shadow-inner">
                    <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none"></div>
                    <div class="w-32 h-32 rounded-2xl bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center text-6xl shadow-2xl mb-4 z-10 overflow-hidden transform group-hover/logo:scale-105 transition-transform duration-300">
                        ${projSelecionado.logo && projSelecionado.logo.startsWith('http') ? `<img src="${projSelecionado.logo}" alt="Logo" class="w-full h-full object-cover">` : (projSelecionado.logo || '⚡')}
                    </div>
                    <h4 class="text-xl font-black text-white z-10 tracking-wide">${projSelecionado.nome}</h4>
                    <span class="text-xs font-mono text-amber-400 z-10 mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">${projSelecionado.categoria}</span>
                </div>

                <!-- CONTEÚDO E DETALHES -->
                <div class="lg:col-span-8 space-y-5">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">${projSelecionado.nome}</h3>
                        ${projSelecionado.link ? `<a href="${projSelecionado.link}" target="_blank" class="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-xs font-mono text-amber-400 font-semibold transition-all shadow-md flex items-center gap-1.5"><span>Ver Repositório / Demo</span> <span>↗</span></a>` : ''}
                    </div>

                    <p class="text-sm text-slate-300 leading-relaxed font-sans">${projSelecionado.descricao}</p>

                    ${printsHtml}

                    <div class="flex flex-wrap gap-2 pt-2">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    html += `
        </div>
    </section>
    `;

    container.innerHTML = html;
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
                resp = "COMANDOS DISPONÍVEIS:\n • pauer --discord   : Ir para pasta /discord-bots\n • pauer --software  : Ir para pasta /automacao-scripts\n • pauer --games     : Ir para pasta /game-development\n • pauer --web       : Ir para pasta /web-apps-saas\n • pauer --rescue    : Ir para o SOS PauerHelps\n • clear             : Limpar ecrã";
            } else if (cmd === 'pauer --discord') {
                mudarPasta('discord-bots');
                document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /discord-bots...";
            } else if (cmd === 'pauer --software') {
                mudarPasta('software-tools');
                document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /automacao-scripts...";
            } else if (cmd === 'pauer --games') {
                mudarPasta('game-development');
                document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /game-development...";
            } else if (cmd === 'pauer --web') {
                mudarPasta('web-development');
                document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a pasta /web-apps-saas...";
            } else if (cmd === 'pauer --rescue') {
                mudarPasta('pauerhelps-sos');
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