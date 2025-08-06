const urlAPI = "http://localhost:3000/tarefas"
 
const inputTarefa = document.querySelector(".campo-tarefa");
 
const botaoAdicionar = document.querySelector(".botao-adicionar");
 
const listaTarefas = document.querySelector(".lista-tarefas");

async function renderizarTarefas() {
    try{
        const resposta = await fetch(urlAPI);
        const tarefas = await resposta.json();

        tarefas.forEach(tarefa => {
            const itemLista = document.createElement("li");
            itemLista.className = 'item-tarefa';
            itemLista.textContent = tarefa.titulo;
            
            /*Botão remover criado para cada item da lista, isto é, para cada tarefa da lista*/
            const botaoRemover = document.createElement('button');
            botaoRemover.className = 'botao-remover';
            botaoRemover.textContent = 'Excluir';
  
            /*Botão editar criado para editar cada item da lista -> Ainda não funciona*/
            const botaoEditar = document.createElement('button');
            botaoEditar.className = 'botao-editar';
            botaoEditar.textContent = 'Editar';

            itemLista.appendChild(botaoRemover);
            itemLista.appendChild(botaoEditar);
            listaTarefas.appendChild(itemLista);
        })
    }catch (erro){
        console.error("Erro ao renderizar tarefas:" + erro);
    }
}
 
async function adicionarTarefa(titulo) {
    try{
        await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        });

        /*A cada nova tarefa adicionada, executa renderizarTarefas para que todas apareçam na tela, inclusive a ultima adicionada*/
        renderizarTarefas();
    }
    catch (error){
        console.error("Erro ao adicionar tarefa:", error)
    }
}
 
botaoAdicionar.addEventListener("click", function (evento){
    evento.preventDefault();
    const novaTarefa = inputTarefa.value.trim();
 
    if(novaTarefa !== ""){
        adicionarTarefa(novaTarefa);
        inputTarefa.value = "";
    }
});
 
//Iniciar a aplicação com as tarefas já renderizadas
renderizarTarefas();

