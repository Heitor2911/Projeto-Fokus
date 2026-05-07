// Seleciona os elementos utilizados na aplicação
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const title = document.querySelector('.app__title')
const buttons = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const imagemButton = document.querySelector('.app__card-primary-butto-icon')
const tempoNaTela = document.querySelector('#timer')

// Inicializa os arquivos de áudio utilizados na aplicação
const musica = new Audio('/sons/luna-rise-part-one.mp3')
const playAudio = new Audio('/sons/play.wav')
const pauseAudio = new Audio('/sons/pause.mp3')
const endAudio = new Audio('/sons/beep.mp3')

// Tempo inicial em segundos (1500s = 25 minutos, padrão do modo foco)
let tempoDecorridoEmSegundos = 1500 

// Armazena o ID do intervalo ativo. Quando nulo, indica que o timer está pausado
let intervaloId = null

// Define a música de fundo para tocar em loop contínuo
musica.loop = true

// Alterna a reprodução da música de fundo conforme o estado do checkbox
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

// Define o contexto para "foco" (25 minutos) ao clicar no botão correspondente
focoBt.addEventListener('click', () => {
   tempoDecorridoEmSegundos = 1500
   alterarContexto('foco')
   focoBt.classList.add('active')
})

// Define o contexto para "descanso curto" (5 minutos) ao clicar no botão correspondente
curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

// Define o contexto para "descanso longo" (15 minutos) ao clicar no botão correspondente
longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

function alterarContexto(contexto) {
    mostrarTimer()
    // Remove a classe 'active' de todos os botões antes de ativar o novo contexto
    buttons.forEach(contexto => {contexto.classList.remove('active')})
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case 'foco':
            title.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
                `
            break
        case 'descanso-curto':
            title.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong"> Faça uma pausa curta! </strong>
            `
            break
        case 'descanso-longo':
            title.innerHTML = `
            Hora de voltar à superfície. <strong class="app__title-strong"> Faça uma pausa longa. </strong>
            `
            break
            default:
                break
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        endAudio.play()
        alert('Tempo esgotado!')
        // Dispara um evento customizado ao finalizar um ciclo de foco
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento  = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTimer()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if (intervaloId) {
        pauseAudio.play()
        zerar()
        return
    }
    playAudio.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = 'Pausar'
    imagemButton.setAttribute('src', '/imagens/pause.png')
}

function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent = 'Começar'
    intervaloId = null
    imagemButton.setAttribute('src', '/imagens/play_arrow.png')
}

function mostrarTimer() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleString('pt-BR', { minute: '2-digit', second: '2-digit' })
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

// Exibe o timer na tela assim que a página é carregada
mostrarTimer()