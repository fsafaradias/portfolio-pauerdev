// ==========================================
// SCRIPT PRINCIPAL DO PORTFÓLIO - PAUERDEV.HELP
// SISTEMA DE FILE EXPLORER DE PROJETOS POR PASTA
// ==========================================

window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/projetos');
        if (!response.ok) throw new Error('Falha ao comunicar com a API');
        const projetos = await response.json();
        renderizarAbasCategorias(projetos);
    } catch (err) {
        console.error('Erro ao carregar projetos da base de dados:', err);
        const container = document.getElementById('pastas-container');
        if (container) {
            container.innerHTML = `<div class="text-center py-12 text-red-400 font-mono text-xs">Erro ao ligar à base de dados para carregar projetos.</div>`;
        }
    }
});

function renderizarAbasCategorias(projetos) {
    const tabsContainer = document.getElementById('pastas-tabs');
    const container = document.getElementById('pastas-container');
    if (!tabsContainer || !container) return;

    if (!projetos || projetos.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 font-mono text-xs">Ainda não existem projetos registados na base de dados.</div>`;
        return;
    }

    const categoriasConfig = {
        'discord-bots': { id: 'discord-bots', title: '🤖 discord-bots', label: '/discord-bots', desc: 'Automação para comunidades e bots interativos.' },
        'software-tools': { id: 'software-tools', title: '🛠️ software-tools', label: '/software-tools', desc: 'Ferramentas utilitárias e automação.' },
        'game-development': { id: 'game-development', title: '🎮 game-development', label: '/game-development', desc: 'Desenvolvimento de videojogos e protótipos.' },
        'web-development': { id: 'web-development', title: '🌐 web-development', label: '/web-development', desc: 'Aplicações web modernas e plataformas SaaS.' }
    };

    const agrupados = {};
    projetos.forEach(proj => {
        const cat = proj.categoria || 'software-tools';
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(proj);
    });

    const catKeys = Object.keys(agrupados);
    if (catKeys.length === 0) return;

    let tabsHtml = '';
    catKeys.forEach((catKey, index) => {
        const config = categoriasConfig[catKey] || { id: catKey, title: `📁 ${catKey}`, label: `/${catKey}`, desc: 'Projetos' };
        const projsCat = agrupados[catKey];
        const isActive = index === 0;

        tabsHtml += `
            <button onclick="switchCategory('${config.id}')" id="tab-cat-${config.id}" class="px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 ${isActive ? 'bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg' : 'bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300'}">
                <span>📁</span> <span>${config.label}</span>
                <span class="px-2.5 py-0.5 rounded-full ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'} text-[10px]">${projsCat.length}</span>
            </button>
        `;
    });
    tabsContainer.innerHTML = tabsHtml;

    let contentsHtml = '';
    catKeys.forEach((catKey, index) => {
        const config = categoriasConfig[catKey] || { id: catKey, title: `📁 ${catKey}`, label: `/${catKey}`, desc: 'Projetos' };
        const projsCat = agrupados[catKey];
        const isActive = index === 0;

        contentsHtml += `<div id="cat-content-${config.id}" class="space-y-6 ${isActive ? '' : 'hidden'}">`;
        contentsHtml += `
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-4">
                <div>
                    <h4 class="text-xl font-bold text-white">${config.title}</h4>
                    <p class="text-xs text-slate-400 mt-1">${config.desc}</p>
                </div>
                <div class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-amber-400">
                    file-explorer / ${catKey} (${projsCat.length} projetos)
                </div>
            </div>
        `;

        // FILE EXPLORER SUPERIOR: Cada pasta é um projeto
        contentsHtml += `<div class="space-y-6" id="explorer-wrapper-${config.id}">`;
        contentsHtml += `<div class="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">`;
        
        projsCat.forEach((proj, pIdx) => {
            const isProjActive = pIdx === 0;
            contentsHtml += `
                <button onclick="switchProjectFolder('${config.id}', ${proj.id || pIdx})" id="proj-tab-${config.id}-${proj.id || pIdx}" class="px-4.5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${isProjActive ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}">
                    <span>📂</span> <span>${proj.nome}</span>
                </button>
            `;
        });
        contentsHtml += `</div>`;

        // INFORMAÇÕES DA PASTA DO PROJETO ATIVO (Nome, Link, Logo, Imagens e Descrição)
        projsCat.forEach((proj, pIdx) => {
            const isProjActive = pIdx === 0;

            // Logo (URL ou ícone/emoji)
            let logoHtml = '⚡';
            if (proj.logo) {
                if (proj.logo.startsWith('http') || proj.logo.startsWith('/assets/')) {
                    logoHtml = `<img src="${proj.logo}" alt="Logo" class="w-full h-full object-cover">`;
                } else {
                    logoHtml = proj.logo;
                }
            }

            // Imagens (entre 2 a 8 imagens)
            let printsHtml = '';
            let imagensArray = [];
            if (proj.imagens) {
                imagensArray = Array.isArray(proj.imagens) ? proj.imagens : proj.imagens.replace(/[{}]/g, '').split(',').map(img => img.trim()).filter(Boolean);
            }

            if (imagensArray.length > 0) {
                printsHtml = `
                <div class="space-y-2.5 pt-4 border-t border-slate-800/80">
                    <span class="text-[11px] font-mono text-amber-400 uppercase font-bold">// Imagens do Projeto (${imagensArray.length})</span>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        ${imagensArray.map((imgUrl, idx) => `
                            <div class="rounded-xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden group/img shadow-inner">
                                <img src="${imgUrl}" alt="Imagem ${idx+1}" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='https://placehold.co/600x400/0f172a/64748b?text=Projeto+Img';">
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            // Tags
            let tagsHtml = '';
            if (proj.tags) {
                let tagsArray = Array.isArray(proj.tags) ? proj.tags : proj.tags.replace(/[{}]/g, '').split(',').map(t => t.trim()).filter(Boolean);
                tagsHtml = tagsArray.map(t => `<span class="px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-mono">${t}</span>`).join('');
            }

            contentsHtml += `
                <div id="proj-panel-${config.id}-${proj.id || pIdx}" class="studio-card-glow p-6 sm:p-8 space-y-6 ${isProjActive ? '' : 'hidden'}">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-3xl shadow-lg shrink-0 overflow-hidden">
                                ${logoHtml}
                            </div>
                            <div>
                                <span class="text-[11px] font-mono text-amber-400 uppercase tracking-widest">Pasta Ativa // ${proj.nome}</span>
                                <h5 class="text-2xl font-bold text-white mt-0.5">${proj.nome}</h5>
                            </div>
                        </div>
                        ${proj.link ? `<a href="${proj.link}" target="_blank" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-mono text-amber-400 transition-all flex items-center gap-2 shadow">Ver Link / Repositório ↗</a>` : ''}
                    </div>

                    <div class="space-y-2">
                        <span class="text-[11px] font-mono text-slate-500 uppercase">// Descrição do Projeto</span>
                        <p class="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">${proj.descricao}</p>
                    </div>

                    ${printsHtml}

                    <div class="flex flex-wrap gap-1.5 pt-2">
                        ${tagsHtml}
                    </div>
                </div>
            `;
        });

        contentsHtml += `</div></div>`;
    });

    container.innerHTML = contentsHtml;
    window._catKeys = catKeys;
}

function switchCategory(activeId) {
    if (!window._catKeys) return;
    window._catKeys.forEach(id => {
        const tab = document.getElementById('tab-cat-' + id);
        const content = document.getElementById('cat-content-' + id);
        if (!tab || !content) return;

        if (id === activeId) {
            content.classList.remove('hidden');
            tab.className = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg";
            const badge = tab.querySelector('span:last-child');
            if (badge) badge.className = "px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]";
        } else {
            content.classList.add('hidden');
            tab.className = "px-6 py-3.5 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300";
            const badge = tab.querySelector('span:last-child');
            if (badge) badge.className = "px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]";
        }
    });
}

function switchProjectFolder(catId, projId) {
    const wrapper = document.getElementById('explorer-wrapper-' + catId);
    if (!wrapper) return;

    const buttons = wrapper.querySelectorAll(`[id^="proj-tab-${catId}-"]`);
    const panels = wrapper.querySelectorAll(`[id^="proj-panel-${catId}-"]`);

    buttons.forEach(btn => {
        if (btn.id === `proj-tab-${catId}-${projId}`) {
            btn.className = "px-4.5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-md";
        } else {
            btn.className = "px-4.5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 bg-slate-950 text-slate-400 border border-slate-800 hover:text-white";
        }
    });

    panels.forEach(panel => {
        if (panel.id === `proj-panel-${catId}-${projId}`) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    });
}

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

// Terminal CLI
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
                resp = "File explorers e pastas de projetos carregados da base de dados.";
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