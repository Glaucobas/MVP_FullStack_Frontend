/***************************************************************************************
* Chamada da função para carregamento inicial dos dados                                *    
****************************************************************************************/
getList();

/***************************************************************************************
* Função para obter a lista existente do servidor via requisição GET                   *    
****************************************************************************************/
async function getList() {

  // Monta a URL que sera chamada na API
  const url = `http://127.0.0.1:5000/banco`;

  try {

    // Verifica o status da conexão ne faz a chamada para a API
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Recebe o retorno da API e grava noi log do console
    const data = await response.json();
    console.log('Dados recebidos:', data);

    // Verifica se o valore retornado é um array de elementos e cria linhas na tabela
    // para cada valor retornado. Caso o JSON retornado tenha componentes com erro
    // ou inválidos gera uma mensagem de erro gravando o erro no console
    if (data && Array.isArray(data.bancos)) {
      if (data.bancos.length > 0) {
        data.bancos.forEach(item => {
          console.log('Itens processados:', item);
          insertList(item.idBanco, item.descricao);
        });
      }
    } else {
      console.error('Formato de inexperado de dados:', data);
      alert('Formato de dados inesperado recebido da API.');
    }

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Falha ao obter a lista de Instituições Financeiras. Tente novamente mais tarde.');
  }
};

/***************************************************************************************
* Função para colocar uma categoria na lista do servidor via requisição POST           *    
****************************************************************************************/
const postItem = async (code, description) => {
  
  // Cria um formulário para envio dos dados
  const formData = new FormData();

  formData.append('idBanco',   code);
  formData.append('descricao', description);

  // Grava no console um log com os valores que serão enviados para a base
  console.log([...formData.entries()]);

  // Monta a URL que sera chamada na API 
  const url = `http://127.0.0.1:5000/banco`;
 
  try {
  
    // Faz a chamada para a API e verifica o status da conexão
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP erro! Status: ${response.status}`);
    }
    
    // Recebe o retorno da API
    const data = await response.json();
    
    // Grava no console 
    console.log('Sucesso:', data);
    
    return response;

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Falha ao gravar item na lista de Instituições Financeiras.');
  }
};

/***************************************************************************************
* Função para criar um botão close para cada item da lista                             *    
****************************************************************************************/
const insertButton = (parent, buttonClass = 'btn-delete') => {

  //Verifica se o elemento pai é valido
  if(!(parent instanceof HTMLElement)) {
      console.error("O elemento pai fornecido não é valido.");
    return;
  }

  // Cria o elemento span
  let span = document.createElement("span")
  span.className = "span-delete";

  //Cria o elemento de imagem
  let img = document.createElement("img");
  img.src = "imagens/126468.png";
  img.className = buttonClass;

  // Anexar a imagem ao span
  span.appendChild(img);

  //Anexa o span ao elemento pai
  parent.appendChild(span);
};

/***************************************************************************************
* Função para remover um item da lista de acordo com o click no botão close            *    
****************************************************************************************/
const removeElement = () => {
  const closeButtons = document.getElementsByClassName('btn-delete');    

  Array.from(closeButtons).forEach(button => {
    button.onclick = function() {
      const div = this.parentElement.parentElement.parentElement;
      const tdElement = div.getElementsByTagName('td')[0];

      if (tdElement) {
        const nomeItem = tdElement.innerHTML;

        if (confirm('Você tem certeza?')) {
          div.remove();
          deleteItem(nomeItem);
        }

      } else {
        console.error("O elemento <td> não foi encontrado dentro do div");
      }
    };
  });
};

/***************************************************************************************
* Função para deletar um item da lista do servidor via requisição DELETE               *    
****************************************************************************************/
const deleteItem = async(idBank) => {

  console.log(idBank);

  const url = `http://127.0.0.1:5000/banco?idBanco=${idBank}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro na solicitação');
    }

    const data = await response.json();
    console.log('Sucesso:', data);
  } catch (error) {
      console.error('Erro:', error);
  }
};

/***************************************************************************************
* Função para adicionar um novo Banco                                                  *    
****************************************************************************************/
const newBank = async () => {

  // Captura os valores inseridos no formulário e converte para maiúsculas
  const inputCode        = document.getElementById("new-code").value;
  const inputDescription = (document.getElementById("new-description").value).toUpperCase();

  // Verifica se os campos estão vazios 
  if (inputCode === '') { 
    alert("Digite o código da nova Instituição Financeira!"); 
  }

  if (inputDescription === '') { 
    alert("Decrição da instituição financeira é obrigatório"); 
  }

  // Se não houver erros, adicionar item 
  if ((inputCode) && (inputDescription)) {
    const response = await postItem(inputCode, inputDescription);  
        
    if (response.ok) {
      insertList(inputCode, inputDescription);
    } 
  }
};

/***************************************************************************************
* Função para inserir o Banco na lista apresentada                                  *    
****************************************************************************************/
const insertList = (inputCode, inputDescription) => {
  
  // Verificação e conversão do inputCodigo para inteiro 
  const code = parseInt(inputCode, 10); 
  if (isNaN(code)) { 
    console.error('Código do banco deve ser um número inteiro válido'); 
    alert('O código deve ser um número inteiro.'); 
    return; 
  } 
  
  // Verificação se inputDescricao não é vazio 
  if (!inputDescription || inputDescription.trim() === "") { 
    console.error('inputDescricao não pode estar vazio'); 
    alert('A descrição não pode estar vazia.'); 
    return; 
  }
  
  var item  = [code, inputDescription]
  var table = document.getElementById('table-bank');
  var row   = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
    if (i == 0) {
      cel.id = 'td-code';
    } else if (i == 1) {
      cel.id = 'td-description';
    } 
  }
  
  insertButton(row.insertCell(-1))
  
  document.getElementById("new-code").value = "";
  document.getElementById("new-description").value = "";

  removeElement()
};

/***************************************************************************************
* Função para inserir o Banco na lista apresentada                                  *    
****************************************************************************************/
function searchValue() { 

  // Obtenha o valor do input de busca 
  const searchValue = document.getElementById('input-search').value; 
  
  // Obtenha todas as linhas da tabela 
  const rows = document.querySelectorAll('#table-bank tbody tr');

  // Remova a classe de destaque de todas as linhas 
  rows.forEach(row => row.classList.remove('highlight')); 
  
  // Itere pelas linhas para encontrar e destacar a linha correspondente 
  rows.forEach(row => { 
    
    const cells = row.querySelectorAll('td'); 
    let i = 0;
    cells.forEach(cell => {
      if (cell.textContent === searchValue) { 
        row.classList.add('highlight'); 

        // Rolando a linha para a visualização 
        row.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      } 
    });
  }); 
}