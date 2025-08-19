let idEmEdicao = null; // Variável global para rastrear o ID da tarefa em edição

const urlAPI = "http://localhost:3000/tarefas"
const inputTarefa = document.querySelector(".campo-tarefa");
const botaoAdicionar = document.querySelector(".botao-adicionar");
const listaTarefas = document.querySelector(".lista-tarefas");
const formTarefa = document.querySelector("#form-tarefa");
const inputTitulo = document.querySelector(".campo-titulo");
const textareaDescricao = document.querySelector(".campo-descricao");
const selectStatus = document.querySelector(".campo-status");
const selectPrioridade = document.querySelector(".campo-prioridade");
const inputDataEntrega = document.querySelector(".campo-data-entrega");


async function renderizarTarefas() {
    try{
        listaTarefas.innerHTML = ""; // Limpa a lista antes de renderizar
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
            botaoRemover.addEventListener("click", () =>{
                removerTarefa(tarefa.id)
            })

            /*Botão editar criado para editar cada item da lista*/
            const botaoEditar = document.createElement('button');
            botaoEditar.className = 'botao-editar';
            botaoEditar.textContent = 'Editar';

            // Evento do botão Editar
            botaoEditar.addEventListener("click", async () => {

            //O formulário para edição
                idEmEdicao = tarefa.id;
                inputTitulo.value = tarefa.titulo;
                textareaDescricao.value = tarefa.descricao || "";
                selectStatus.value = tarefa.status || "Pendente";
                selectPrioridade.value = tarefa.prioridade || "Média";
                inputDataEntrega.value = tarefa.data_entrega || "";

                botaoAdicionar.textContent = "Salvar";

                inputTitulo.focus();
            });

            itemLista.appendChild(botaoRemover);
            itemLista.appendChild(botaoEditar);
            listaTarefas.appendChild(itemLista);
        })

    }catch (erro){
        console.error("Erro ao renderizar tarefas:" + erro);
    }

}

async function adicionarTarefa(tarefa) {
    try{
        await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarefa)
        });

        /*A cada nova tarefa adicionada, executa renderizarTarefas para que todas apareçam na tela, inclusive a ultima adicionada*/
        renderizarTarefas();
    }
    catch (error){
        console.error("Erro ao adicionar tarefa:", error)
    }
}

/*Função para remover uma tarefa*/

async function removerTarefa(id) {
    try {
        await fetch(`${urlAPI}/${id}`, {
            method: "DELETE"
        });
        renderizarTarefas();
    } catch (erro) {
        console.error("Erro ao remover tarefa:", erro);
    }
}

function lerFormulario() {
  return {
    titulo: inputTitulo.value.trim(),
    descricao: textareaDescricao.value.trim(),
    status: selectStatus.value,
    prioridade: selectPrioridade.value,
    data_entrega: inputDataEntrega.value
  };

}

function validarCampos(tarefa) {
  const statusValidos = ["Pendente", "Em andamento", "Concluída"];
  const prioridadeValidas = ["Baixa", "Média", "Alta"];
  if (!tarefa.titulo) {
    alert("O campo título é obrigatório.");
    inputTitulo.focus();
    return false;
  }

  if (!statusValidos.includes(tarefa.status)) {
    alert("Selecione um status válido.");
    selectStatus.focus();
    return false;
  }

  if (!prioridadeValidas.includes(tarefa.prioridade)) {
    alert("Selecione uma prioridade válida.");
    selectPrioridade.focus();
    return false;
  }

  if (tarefa.data_entrega) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tarefa.data_entrega)) {
      alert("Data de entrega inválida.");
      inputDataEntrega.focus();
      return false;
    }
  }
  return true;
}

/* Listener do formulário para criar ou editar tarefa */
formTarefa.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const tarefa = lerFormulario();
  if (!validarCampos(tarefa)) return;
  botaoAdicionar.disabled = true;
  try {
    if (idEmEdicao) {
      // Editar (PUT)
      await fetch(`${urlAPI}/${idEmEdicao}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
      });

      idEmEdicao = null;
      botaoAdicionar.textContent = "Adicionar";

    } else {
      // Criar (POST)
      await fetch(urlAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
      });
    }

    formTarefa.reset();
    inputTitulo.focus();
    renderizarTarefas();

  }catch (error) {
    alert("Erro ao salvar tarefa. Tente novamente.");
    console.error(error);
  } finally {
    botaoAdicionar.disabled = false;
  }

});


renderizarTarefas();
 





