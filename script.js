// Rastreamento do rato para o efeito Spotlight no fundo
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y`, `${e.clientY}px`);
});

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        const projetos = await response.json();
        renderizarProjetos(projetos);
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('projetos-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function renderizarProjetos(projetos) {
    const container = document.getElementById('projetos-container');
    if (!container) return;

    if (!projetos || projetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    // Mapeamento de categorias para IDs e títulos do HTML
    const categoriasConfig = {
        'discord-bots': { id: 'sec-discord-bots', title: '🤖 discord-bots', desc: 'Automação para comunidades, bots de moderação e sistemas interativos.' },
        'software-tools': { id: 'sec-software-tools', title: '🛠️ software-tools', desc: 'Ferramentas utilitárias e de automação de sistema.' },
        'game-development': { id: 'sec-game-development', title: '🎮 game-development', desc: 'Desenvolvimento de videojogos 2D/3D e protótipos interativos.' },
        'web-development': { id: 'sec-web-development', title: '🌐 web-development', desc: 'Aplicações web modernas, plataformas SaaS e APIs de alta performance.' }
    };

    // Agrupar projetos por categoria
    const agrupados = {};
    projetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    let htmlFinal = '';

    for (const [catKey, projsCat] of Object.entries(agrupados)) {
        const config = categoriasConfig[catKey] || { id: `sec-${catKey}`, title: `📁 ${catKey}`, desc: 'Projetos da categoria.' };

        htmlFinal += `
        <section id="${config.id}" class="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-800/60">
            <div class="mb-8">
                <div class="inline-block px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
                    // CATEGORIA: ${catKey.toUpperCase()}
                </div>
                <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    ${config.title}
                </h2>
                <p class="text-slate-400 text-sm mt-2 max-w-2xl">${config.desc}</p>
            </div>
            <div class="space-y-6">
        `;

        projsCat.forEach(proj => {
            // Renderizar tags se existirem
            let tagsHtml = '';
            if (proj.tags && Array.isArray(proj.tags)) {
                tagsHtml = proj.tags.map(t => `<span class="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">${t}</span>`).join('');
            }

            // Renderizar imagens/prints adicionais se existirem
            let printsHtml = '';
            if (proj.imagens && Array.isArray(proj.imagens) && proj.imagens.length > 0) {
                printsHtml = `
                <div class="space-y-2 pt-2">
                    <span class="text-xs font-mono text-slate-400 uppercase">// Capturas de Ecrã</span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${proj.imagens.map((imgUrl, idx) => `
                            <div class="rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center text-xs font-mono text-slate-500 overflow-hidden">
                                <img src="${imgUrl}" alt="Print ${idx+1}" class="w-full h-full object-cover">
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            htmlFinal += `
            <div class="studio-card-glow p-8 border border-slate-800 bg-slate-950/90 space-y-8">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div class="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 text-center relative overflow-hidden group">
                        <div class="w-28 h-28 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-5xl shadow-2xl mb-4 z-10 overflow-hidden">
                            ${proj.logo ? `<img src="${proj.logo}" alt="Logo" class="w-full h-full object-cover">` : '⚡'}
                        </div>
                        <h4 class="text-lg font-bold text-white z-10">${proj.nome}</h4>
                        <span class="text-xs font-mono text-amber-400 z-10 mt-1">${proj.categoria}</span>
                    </div>

                    <div class="lg:col-span-8 space-y-4">
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <h3 class="text-2xl font-extrabold text-white">${proj.nome}</h3>
                            ${proj.link ? `<a href="${proj.link}" target="_blank" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-mono text-amber-400 transition-all">Ver Repositório / Demo ↗</a>` : ''}
                        </div>

                        <p class="text-sm text-slate-300 leading-relaxed">${proj.descricao}</p>

                        ${printsHtml}

                        <div class="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            </div>`;
        });

        htmlFinal += `</div></section>`;
    }

    container.innerHTML = htmlFinal;
}

// Lógica de submissão do formulário de contacto ligada à API POST /api/pedidos
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
                document.getElementById('sec-discord-bots')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /discord-bots...";
            } else if (cmd === 'pauer --software') {
                document.getElementById('sec-software-tools')?.scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /software-tools...";
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