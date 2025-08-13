document.addEventListener('DOMContentLoaded', () => {
  // Elementos de acessibilidade
  const botaoAcess = document.getElementById('botao-acessibilidade');
  const opcoesAcess = document.getElementById('opcoes-acessibilidade');
  const btnAumentar = document.getElementById('aumentar-fonte');
  const btnDiminuir = document.getElementById('diminuir-fonte');
  const btnContraste = document.getElementById('alterna-contraste');
  const btnReset = document.getElementById('reset-acessibilidade');
  const formContato = document.getElementById('form-contato');
  const agradecimento = document.getElementById('thank-you');

  // Configurações de acessibilidade persistidas
  const configAcessibilidade = {
    fonte: 1,
    contraste: false,
    get salvo() {
      return localStorage.getItem('configAcessibilidade') 
        ? JSON.parse(localStorage.getItem('configAcessibilidade'))
        : null;
    },
    salvar() {
      localStorage.setItem('configAcessibilidade', JSON.stringify({
        fonte: this.fonte,
        contraste: this.contraste
      }));
    }
  };

  // Carrega configurações salvas
  const carregarConfiguracoes = () => {
    const configSalva = configAcessibilidade.salvo;
    if (configSalva) {
      configAcessibilidade.fonte = configSalva.fonte;
      configAcessibilidade.contraste = configSalva.contraste;
      
      document.body.style.fontSize = `${configAcessibilidade.fonte}rem`;
      if (configAcessibilidade.contraste) {
        document.body.classList.add('alto-contraste');
      }
    }
  };

  // Atualiza o tamanho da fonte garantindo limites
  const atualizarFonte = () => {
    // Limites mínimo e máximo (80% a 150% do tamanho original)
    configAcessibilidade.fonte = Math.min(Math.max(configAcessibilidade.fonte, 0.8), 1.5);
    document.body.style.fontSize = `${configAcessibilidade.fonte}rem`;
    configAcessibilidade.salvar();
    
    // Atualiza estado dos botões
    btnAumentar.disabled = configAcessibilidade.fonte >= 1.5;
    btnDiminuir.disabled = configAcessibilidade.fonte <= 0.8;
  };

  // Alternar menu de acessibilidade
  const toggleMenuAcessibilidade = () => {
    const expanded = botaoAcess.getAttribute('aria-expanded') === 'true';
    botaoAcess.setAttribute('aria-expanded', (!expanded).toString());
    opcoesAcess.classList.toggle('apresenta-lista');
    
    // Animações acessíveis
    if (!expanded) {
      opcoesAcess.style.display = 'block';
      setTimeout(() => {
        opcoesAcess.style.opacity = '1';
        opcoesAcess.style.transform = 'translateY(0)';
      }, 10);
    } else {
      opcoesAcess.style.opacity = '0';
      opcoesAcess.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        opcoesAcess.style.display = 'none';
      }, 300);
    }
  };

  // Fechar menu ao clicar fora ou pressionar ESC
  const fecharMenuAcessibilidade = (e) => {
    if (!opcoesAcess.contains(e.target) {
      botaoAcess.setAttribute('aria-expanded', 'false');
      opcoesAcess.classList.remove('apresenta-lista');
    }
  };

  // Event Listeners
  botaoAcess?.addEventListener('click', toggleMenuAcessibilidade);
  document.addEventListener('click', fecharMenuAcessibilidade);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && opcoesAcess.classList.contains('apresenta-lista')) {
      toggleMenuAcessibilidade();
    }
  });

  btnAumentar?.addEventListener('click', () => {
    configAcessibilidade.fonte += 0.1;
    atualizarFonte();
  });

  btnDiminuir?.addEventListener('click', () => {
    configAcessibilidade.fonte -= 0.1;
    atualizarFonte();
  });

  btnContraste?.addEventListener('click', () => {
    configAcessibilidade.contraste = !configAcessibilidade.contraste;
    document.body.classList.toggle('alto-contraste');
    configAcessibilidade.salvar();
    btnContraste.setAttribute('aria-pressed', configAcessibilidade.contraste.toString());
  });

  btnReset?.addEventListener('click', () => {
    configAcessibilidade.fonte = 1;
    configAcessibilidade.contraste = false;
    document.body.style.fontSize = '';
    document.body.classList.remove('alto-contraste');
    configAcessibilidade.salvar();
    atualizarFonte();
    btnContraste?.setAttribute('aria-pressed', 'false');
  });

  formContato?.addEventListener('submit', e => {
    e.preventDefault();
    agradecimento?.classList.remove('d-none');
    
    // Foca no agradecimento para leitores de tela
    agradecimento?.setAttribute('tabindex', '-1');
    agradecimento?.focus();
    
    // Esconde após 5 segundos
    setTimeout(() => {
      agradecimento?.classList.add('d-none');
    }, 5000);
    
    formContato.reset();
  });

  // ScrollReveal com verificação de preferência de redução de movimento
  const initScrollReveal = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (typeof ScrollReveal !== 'undefined' && !prefersReduced.matches) {
      const sr = ScrollReveal({
        origin: 'top',
        distance: '30px',
        duration: 700,
        reset: false,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        viewFactor: 0.1
      });
      
      sr.reveal('#inicio, #como-funciona, #galeria, #contato', {
        interval: 200,
        beforeReveal: (el) => {
          el.setAttribute('aria-hidden', 'false');
        }
      });
    }
  };

  // Inicializa
  carregarConfiguracoes();
  initScrollReveal();
});