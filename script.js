// Efeito de Fundo: Grelha Tecnológica + Spotlight Dinâmico nos Cartões
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Criar camada de Grelha Tecnológica no fundo
    const gridLayer = document.createElement('div');
    gridLayer.className = 'fixed inset-0 pointer-events-none z-0 opacity-15';
    gridLayer.style.backgroundImage = 'radial-gradient(rgba(251, 133, 0, 0.4) 1px, transparent 1px), radial-gradient(rgba(255, 77, 77, 0.2) 1px, transparent 1px)';
    gridLayer.style.backgroundSize = '32px 32px';
    gridLayer.style.backgroundPosition = '0 0, 16px 16px';
    body.appendChild(gridLayer);

    // Efeito Spotlight do Rato nos Cartões
    document.addEventListener('mousemove', e => {
        const cards = document.querySelectorAll('.studio-card-glow');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

let projetoAtivoIndex = {};

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        const projetos = await response.json();
        renderizarSecçõesIndependentes(projetos);
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('projetos-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function selecionarProjetoCategoria(catKey, index) {
    projetoAtivoIndex[catKey] = index;
    fetch('/api/projetos')
        .then(res => res.json())
        .then(projetos => renderizarSecçõesIndependentes(projetos));
}

function renderizarSecçõesIndependentes(projetos) {
    const container = document.getElementById('projetos-container');
    if (!container) return;

    if (!projetos || projetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    const categoriasConfig = {
        'discord-bots': { 
            id: 'sec-discord-bots', 
            pathName: '/discord-bots', 
            title: '🤖 Bots de Discord & Comunidades', 
            desc: 'Automação para servidores, bots de moderação e sistemas interativos de alta disponibilidade.' 
        },
        'software-tools': { 
            id: 'sec-software-tools', 
            pathName: '/automacao-scripts', 
            title: '🛠️ Automação, Scripts & Ferramentas', 
            desc: 'Scripts construídos para extração maciça de dados, utilitários e automação de sistema.' 
        },
        'game-development': { 
            id: 'sec-game-development', 
            pathName: '/game-development', 
            title: '🎮 Desenvolvimento de Videojogos', 
            desc: 'Prototipagem 2D/3D e experiências interativas de alto desempenho.' 
        },
        'web-development': { 
            id: 'sec-web-development', 
            pathName: '/web-apps-saas', 
            title: '🌐 Web Apps & SaaS', 
            desc: 'Aplicações web modernas, plataformas SaaS e APIs robustas orientadas a performance.' 
        },
        'websites-landing': { 
            id: 'sec-websites-landing', 
            pathName: '/websites-landing', 
            title: '🌐 Websites High-Performance & Landing Pages', 
            desc: 'Sites institucionais com pontuações máximas de otimização e SEO.' 
        },
        'pauerhelps-sos': { 
            id: 'pauerhelps', 
            pathName: '/pauerhelps-sos', 
            title: '🚨 PauerHelps - Centro de Assistência Técnica', 
            desc: 'Suporte especializado urgente e resolução de falhas críticas.', 
            isPriority: true 
        }
    };

    const agrupados = {};
    projetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    let htmlFinal = '';

    for (const [catKey, projsCat] of Object.entries(agrupados)) {
        const config = categoriasConfig[catKey] || { 
            id: `sec-${catKey}`, 
            pathName: `/${catKey}`, 
            title: `📁 ${catKey}`, 
            desc: 'Projetos e repositórios da categoria.' 
        };

        if (projetoAtivoIndex[catKey] === undefined || projetoAtivoIndex[catKey] >= projsCat.length) {
            projetoAtivoIndex[catKey] = 0;
        }
        const activeIdx = projetoAtivoIndex[catKey];
        const projAtual = projsCat[activeIdx];

        htmlFinal += `
        <section id="${config.id}" class="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-800/60">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md ${config.isPriority ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'} text-xs font-mono mb-3 border">
                        <span>📁</span> <span>dir: ${config.pathName}</span> <span class="opacity-60">(${projsCat.length} Repos)</span>
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        ${config.title}
                    </h2>
                    <p class="text-slate-400 text-sm mt-2 max-w-2xl">${config.desc}</p>
                </div>
                <a href="https://github.com/fsafaradias" target="_blank" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-amber-400 transition-all flex items-center gap-2 shadow">
                    <span>github.com/fsafaradias</span> ↗
                </a>
            </div>
        `;

        if (projsCat.length > 1) {
            htmlFinal += `
            <div class="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span class="text-slate-500 mr-2">// Selecionar repositório:</span>
            `;
            projsCat.forEach((p, i) => {
                const isSelected = i === activeIdx;
                htmlFinal += `
                <button onclick="selecionarProjetoCategoria('${catKey}', ${i})" class="px-3.5 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                    isSelected 
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-bold shadow-lg' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }">
                    <span>📂</span>
                    <span>${p.nome || 'projeto-' + (i+1)}</span>
                </button>
                `;
            });
            htmlFinal += `</div>`;
        }

        if (projAtual) {
            let tagsHtml = '';
            if (projAtual.tags && Array.isArray(projAtual.tags)) {
                tagsHtml = projAtual.tags.map(t => `<span class="px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/20 text-xs font-mono shadow-sm">${t}</span>`).join('');
            }

            let printsHtml = '';
            if (projAtual.imagens && Array.isArray(projAtual.imagens) && projAtual.imagens.length > 0) {
                printsHtml = `
                <div class="space-y-3 pt-4 border-t border-slate-800/80 mt-6">
                    <span class="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span>📷</span> Capturas de Ecrã (Clica para ampliar em alta resolução)
                    </span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${projAtual.imagens.map((imgUrl, imgIdx) => `
                            <div onclick="abrirModalImagem('${imgUrl}')" class="group relative rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all shadow-md">
                                <img src="${imgUrl}" alt="Print ${imgIdx+1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1">
                                    <span>🔍</span> <span>Ver Imagem</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            const nomePastaProj = projAtual.nome ? projAtual.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'projeto';

            // Renderização do logótipo a partir da base de dados (suporta caminhos relativos como /assets/img/... ou URLs)
            const logoContent = projAtual.logo 
                ? `<img src="${projAtual.logo}" alt="Logo" class="w-full h-full object-contain drop-shadow-2xl">` 
                : `<span class="text-amber-400">⚡</span>`;

            htmlFinal += `
            <div class="studio-card-glow p-6 sm:p-10 border border-slate-800/80 bg-slate-950/95 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-900 text-xs font-mono text-slate-500">
                    <div class="flex items-center gap-2">
                        <span class="text-amber-500">📂</span>
                        <span class="text-slate-300 font-semibold">dir: ${config.pathName}/${nomePastaProj}/</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <!-- LOGÓTIPO GRANDE SEM CAIXA ENVOLVENTE -->
                    <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                        <div class="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center z-10 transition-transform duration-300 hover:scale-105">
                            ${logoContent}
                        </div>
                    </div>

                    <!-- CONTEÚDO E DETALHES -->
                    <div class="lg:col-span-8 space-y-6">
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <h3 class="text-2xl sm:text-4xl font-black text-white tracking-tight">${projAtual.nome}</h3>
                            ${projAtual.link ? `<a href="${projAtual.link}" target="_blank" class="px-4.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-xs font-mono text-amber-400 font-semibold transition-all shadow-md flex items-center gap-2"><span>Ver Repositório / Demo</span> <span>↗</span></a>` : ''}
                        </div>

                        <p class="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">${projAtual.descricao}</p>

                        ${printsHtml}

                        <div class="flex flex-wrap gap-2 pt-2">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        htmlFinal += `</section>`;
    }

    container.innerHTML = htmlFinal;
}

// Estilo CSS dinâmico para o efeito Spotlight do Rato nos Cartões
document.addEventListener('DOMContentLoaded', () => {
    const styleSpotlight = document.createElement('style');
    styleSpotlight.innerHTML = `
        .studio-card-glow {
            position: relative;
            overflow: hidden;
        }
        .studio-card-glow::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(251, 133, 0, 0.08), transparent 40%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        }
        .studio-card-glow:hover::before {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleSpotlight);
});

// Modal de Visualização de Imagens
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('modal-imagem-container')) {
        const modalHtml = `
            <div id="modal-imagem-container" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
                <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                    <button onclick="fecharModalImagem()" class="absolute -top-12 right-0 text-slate-300 hover:text-white font-mono text-xs px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 transition-colors shadow-lg">
                        ✕ Fechar [ESC]
                    </button>
                    <img id="modal-imagem-src" src="" alt="Zoom Print" class="max-w-full max-h-[85vh] rounded-2xl border border-slate-700 object-contain shadow-2xl">
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

// Formulário de Contacto
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

// Terminal CLI Interativo
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
                resp = "COMANDOS DISPONÍVEIS:\n • pauer --discord   : Ir para /discord-bots\n • pauer --software  : Ir para /automacao-scripts\n • pauer --games     : Ir para /game-development\n • pauer --web       : Ir para /web-apps-saas\n • pauer --rescue    : Ir para o SOS PauerHelps\n • clear             : Limpar ecrã";
            } else if (cmd === 'pauer --discord') {
                document.getElementById('sec-discord-bots')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /discord-bots...";
            } else if (cmd === 'pauer --software') {
                document.getElementById('sec-software-tools')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /automacao-scripts...";
            } else if (cmd === 'pauer --games') {
                document.getElementById('sec-game-development')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /game-development...";
            } else if (cmd === 'pauer --web') {
                document.getElementById('sec-web-development')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /web-development...";
            } else if (cmd === 'pauer --rescue') {
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