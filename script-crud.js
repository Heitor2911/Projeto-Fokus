// Seleciona os elementos do DOM necessários para o funcionamento da aplicação
const btnAddTask = document.querySelector('.app__button--add-task')
const formAddTask = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTasks = document.querySelector('.app__section-task-list')
const paragraphDescriptionTask = document.querySelector('.app__section-active-task-description')

// Carrega as tarefas salvas no localStorage. Caso não haja nenhuma, inicia com um array vazio
const tasks = JSON.parse(localStorage.getItem('tarefas')) || []
let activeTask = null // Variável para armazenar a tarefa ativa atualmente selecionada
let liActiveTask = null // Variável para armazenar o elemento <li> da tarefa ativa atualmente selecionada

// Atualiza/Salva as tarefas no LocalStorage
function saveLocalStorage() { 
    localStorage.setItem('tarefas', JSON.stringify(tasks))
}


function createElementTask(tarefa) {
    
    // Cria o item da lista e adiciona a classe de estilo
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    // Cria o ícone de status (checkmark) em formato SVG
    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    // Cria o parágrafo com a descrição da tarefa
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    // Cria o botão de edição com seu ícone
    const button = document.createElement('button')
    button.classList.add('app_button-edit')

    // Manipula os elementos button e paragrafo para a edição de alguma tarefa
    button.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        console.log("Descrição da nova tarefa:", novaDescricao)
       
        // Caso a tarefa passe com valor vazio/ou seja cancelada o valor não sera atualizado
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            saveLocalStorage()
        }
    }

    const imageButton = document.createElement('img')
    imageButton.setAttribute('src', '/imagens/edit.png')
    button.append(imageButton)

    // Monta o item completo adicionando todos os elementos criados
    li.append(svg)
    li.append(paragrafo)
    li.append(button)

    // Adiciona o evento de clique para exibir a tarefa ativa
    li.onclick = () => {
        document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(element => {
                element.classList.remove('app__section-task-list-item-active')
            })
        if (activeTask === tarefa) {
            paragraphDescriptionTask.textContent = ''
            activeTask = null
            liActiveTask = null
            return
        }
        activeTask = tarefa
        liActiveTask = li
        paragraphDescriptionTask.textContent = tarefa.descricao
        
        li.classList.add('app__section-task-list-item-active')
    }

    return li
}

// Alterna a visibilidade do formulário ao clicar no botão de adicionar tarefa
btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden')
})

// Lida com o envio do formulário para criação de uma nova tarefa
formAddTask.addEventListener('submit', (event)  => {
    event.preventDefault()
    
    // Cria o objeto da tarefa com a descrição digitada
    const task = { 
        descricao: textArea.value
    }
    tasks.push(task) // Adiciona a tarefa ao array em memória
    
    // Cria o elemento visual e o insere na lista da página
    const taskElement = createElementTask(task)
    ulTasks.append(taskElement)
     
    // Salva o array atualizado no localStorage
    saveLocalStorage()
    
    // Limpa o campo de texto e esconde o formulário
    textArea.value = ''
    formAddTask.classList.add('hidden')
})

// Renderiza na tela as tarefas que já estavam salvas ao carregar a página
tasks.forEach(tarefa => {
    const taskElement = createElementTask(tarefa)
    ulTasks.append(taskElement)
})

// Adiciona um ouvinte para o evento personalizado 'FocoFinalizado' para marcar a tarefa ativa como concluída
document.addEventListener('FocoFinalizado', () => {
    if (activeTask && liActiveTask) {
        liActiveTask.classList.remove('app__section-task-list-item-active')
        liActiveTask.classList.add('app__section-task-list-item-complete')
        liActiveTask.querySelector('button').setAttribute('disabled', 'disabled') //desativa o botão de edição da tarefa
    }
})