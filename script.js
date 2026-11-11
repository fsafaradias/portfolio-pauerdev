// ==========================================
// SCRIPT PRINCIPAL DO PORTFÓLIO - PAUERDEV.HELP
// SISTEMA DE PASTAS INTERATIVAS POR CATEGORIA
// ==========================================

// Rastreamento do rato para o efeito Spotlight no fundo
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// Carregar projetos da Base de Dados via API ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        if (!response.ok) throw new Error('Falha ao comunicar com a API');
        const projetos = await response.json();
        renderizarAbasPastas(projetos);
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('pastas-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function renderizarAbasPastas(projetos) {
    const container = document.getElementById('pastas-container');
    if (!container) return;

    if (!projetos || projetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    // Mapeamento de categorias para metadados das pastas
    const categoriasConfig = {
        'discord-bots': { 
            id: 'discord-bots', 
            title: '🤖 discord-bots', 
            label: '/discord-bots',
            desc: 'Automação para comunidades, bots de moderação e sistemas interativos em Node.js.' 
        },
        'software-tools': { 
            id: 'software-tools', 
            title: '🛠️ software-tools', 
            label: '/software-tools',
            desc: 'Ferramentas utilitárias, scripts de automação de sistema e web scraping.' 
        },
        'game-development': { 
            id: 'game-development', 
            title: '🎮 game-development', 
            label: '/game-development',
            desc: 'Desenvolvimento de videojogos 2D/3D e protótipos interativos.' 
        },
        'web-development': { 
            id: 'web-development', 
            title: '🌐 web-development', 
            label: '/web-development',
            desc: 'Aplicações web modernas, plataformas SaaS e APIs de alta performance.' 
        }
    };

    // Agrupar projetos por categoria
    const agrupados = {};
    projetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    const catKeys = Object.keys(agrupados);
    if (catKeys.length === 0) return;

    // Construir o HTML das Abas (Tabs) com o visual exacto em estilo de pastas
    let tabsHtml = '';
    let contentsHtml = '';

    catKeys.forEach((catKey, index) => {
        const config = categoriasConfig[catKey] || { 
            id: catKey, 
            title: `📁 ${catKey}`, 
            label: `/${catKey}`, 
            desc: 'Projetos da categoria.' 
        };
        const projsCat = agrupados[catKey];
        const isActive = index === 0;

        // Estilo exacto da aba em formato de pasta
        tabsHtml += `
            <button onclick="switchFolder('${config.id}')" id="tab-${config.id}" class="px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 ${isActive ? 'bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg' : 'bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300'}">
                <span>📁</span> <span>${config.label}</span>
                <span class="px-2.5 py-0.5 rounded-full ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'} text-[10px]">${projsCat.length} ${projsCat.length === 1 ? 'Repo' : 'Repos'}</span>
            </button>
        `;

        // Conteúdo da Pasta (Apenas o ativo fica visível inicialmente)
        contentsHtml += `
            <div id="folder-${config.id}" class="space-y-6 ${isActive ? '' : 'hidden'}">
                <div class="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-4">
                    <div>
                        <h4 class="text-xl font-bold text-white flex items-center gap-2">
                            ${config.title}
                        </h4>
                        <p class="text-xs text-slate-400 mt-1">${config.desc}</p>
                    </div>
                    <div class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
                        root / workspace / ${catKey}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        `;

        projsCat.forEach(proj => {
            let logoHtml = '';
            if (proj.logo) {
                if (proj.logo.startsWith('http') || proj.logo.startsWith('/assets/')) {
                    logoHtml = `<img src="${proj.logo}" alt="Logo" class="w-full h-full object-cover">`;
                } else {
                    logoHtml = proj.logo;
                }
            } else {
                logoHtml = '⚡';
            }

            let tagsHtml = '';
            if (proj.tags) {
                let tagsArray = Array.isArray(proj.tags) ? proj.tags : proj.tags.replace(/[{}]/g, '').split(',').map(t => t.trim()).filter(Boolean);
                tagsHtml = tagsArray.map(t => `<span class="px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-mono">${t}</span>`).join('');
            }

            let printsHtml = '';
            let imagensArray = [];
            if (proj.imagens) {
                imagensArray = Array.isArray(proj.imagens) ? proj.imagens : proj.imagens.replace(/[{}]/g, '').split(',').map(img => img.trim()).filter(Boolean);
            }

            if (imagensArray.length > 0) {
                printsHtml = `
                <div class="space-y-2 pt-3">
                    <span class="text-[11px] font-mono text-slate-500 uppercase">// Capturas de Ecrã</span>
                    <div class="grid grid-cols-3 gap-2">
                        ${imagensArray.map((imgUrl, idx) => `
                            <div class="rounded-lg border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden">
                                <img src="${imgUrl}" alt="Print ${idx+1}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://placehold.co/600x400/0f172a/64748b?text=Img';">
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            contentsHtml += `
            <div class="studio-card-glow p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div class="space-y-4">
                    <div class="flex items-start justify-between gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-2xl shadow-lg shrink-0 overflow-hidden">
                            ${logoHtml}
                        </div>
                        <div class="flex items-center gap-2">
                            ${proj.link ? `<a href="${proj.link}" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-mono text-amber-400 transition-all flex items-center gap-1.5">Repositório ↗</a>` : ''}
                        </div>
                    </div>

                    <div>
                        <h5 class="text-xl font-bold text-white">${proj.nome}</h5>
                        <p class="text-sm text-slate-300 leading-relaxed mt-2">${proj.descricao}</p>
                    </div>

                    ${printsHtml}
                </div>

                <div class="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                    ${tagsHtml}
                </div>
            </div>`;
        });

        contentsHtml += `</div></div>`;
    });

    // Injetar Abas e Conteúdos nas respetivas divs
    const tabsContainer = document.getElementById('pastas-tabs');
    if (tabsContainer) tabsContainer.innerHTML = tabsHtml;
    container.innerHTML = contentsHtml;

    // Guardar lista de IDs para a função de troca de pastas
    window._folderIds = catKeys;
}

// Função global para alternar entre as abas/pastas por categoria
function switchFolder(activeId) {
    if (!window._folderIds) return;
    window._folderIds.forEach(id => {
        const tab = document.getElementById('tab-' + id);
        const folder = document.getElementById('folder-' + id);
        if (!tab || !folder) return;

        if (id === activeId) {
            folder.classList.remove('hidden');
            tab.className = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg";
            const badge = tab.querySelector('span:last-child');
            if (badge) badge.className = "px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]";
        } else {
            folder.classList.add('hidden');
            tab.className = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300";
            const badge = tab.querySelector('span:last-child');
            if (badge) badge.className = "px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]";
        }
    });
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
                resp = "COMANDOS DISPONÍVEIS:\n • pauer --services : Ver pastas de serviços\n • pauer --github   : Abrir GitHub (fsafaradias)\n • pauer --rescue   : Ativar SOS técnico urgente\n • clear            : Limpar consola";
            } else if (cmd === 'pauer --services') {
                resp = "[1] Discord Bots\n[2] Software Tools\n[3] Game Development\n[4] Web Development";
            } else if (cmd === 'pauer --github') {
                window.open('https://github.com/fsafaradias', '_blank');
                resp = "A abrir https://github.com/fsafaradias...";
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