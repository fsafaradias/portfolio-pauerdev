// Rastreamento do rato para o efeito Spotlight no fundo
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// Lógica de alternar programas na secção software-tools (Modo Pasta)
function switchSoftware(programId) {
    const btnKeySpam = document.getElementById('btn-keyspam');
    const btnMacroPesca = document.getElementById('btn-macropesca');
    const progKeySpam = document.getElementById('prog-keyspam');
    const progMacroPesca = document.getElementById('prog-macropesca');

    if (programId === 'keyspam') {
        // Exibir KeySpam
        progKeySpam.classList.remove('hidden');
        progMacroPesca.classList.add('hidden');

        btnKeySpam.className = "px-6 py-3 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-900 text-amber-400 border border-slate-800 border-b-0 shadow-lg";
        btnMacroPesca.className = "px-6 py-3 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300";
    } else if (programId === 'macropesca') {
        // Exibir MacroPesca
        progMacroPesca.classList.remove('hidden');
        progKeySpam.classList.add('hidden');

        btnMacroPesca.className = "px-6 py-3 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-900 text-cyan-400 border border-slate-800 border-b-0 shadow-lg";
        btnKeySpam.className = "px-6 py-3 rounded-t-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 bg-slate-950/60 text-slate-500 border border-transparent hover:text-slate-300";
    }
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
                resp = "COMANDOS DISPONÍVEIS:\n • pauer --keyspam   : Abrir programa KeySpam\n • pauer --macropesca: Abrir programa MacroPesca\n • pauer --discord   : Ir para secção /discord-bots\n • pauer --games     : Ir para secção /game-development\n • pauer --web       : Ir para secção /web-development\n • pauer --rescue    : Ir para o SOS PauerHelps\n • clear             : Limpar ecrã";
            } else if (cmd === 'pauer --keyspam') {
                document.getElementById('sec-software-tools').scrollIntoView({ behavior: 'smooth' });
                switchSoftware('keyspam');
                resp = "A abrir pasta do KeySpam...";
            } else if (cmd === 'pauer --macropesca') {
                document.getElementById('sec-software-tools').scrollIntoView({ behavior: 'smooth' });
                switchSoftware('macropesca');
                resp = "A abrir pasta do MacroPesca...";
            } else if (cmd === 'pauer --discord') {
                document.getElementById('sec-discord-bots').scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /discord-bots...";
            } else if (cmd === 'pauer --games') {
                document.getElementById('sec-game-development').scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /game-development...";
            } else if (cmd === 'pauer --web') {
                document.getElementById('sec-web-development').scrollIntoView({ behavior: 'smooth' });
                resp = "Navegando para a secção /web-development...";
            } else if (cmd === 'pauer --rescue') {
                document.getElementById('pauerhelps').scrollIntoView({ behavior: 'smooth' });
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