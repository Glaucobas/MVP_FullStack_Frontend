/***************************************************************************************
* Chamada da função para carregamento inicial dos dados                                *    
****************************************************************************************/
getList();

/***************************************************************************************
* Função para obter a lista existente do servidor via requisição GET                   *    
****************************************************************************************/
async function getList() {

  // Monta a URL que sera chamada na API
  const url = `http://127.0.0.1:5000/agencia`;

  try {

    // Verifica o status da conexão ne faz a chamada para a API
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }

    // Recebe o retorno da API e grava no console
    const data = await response.json();
    console.log('Dados recebidos:', data);

    // Verifica se o valor retornado é um array de elementos e cria linhas na tabela
    // para cada valor retornado. Caso o JSON retornado tenha componentes com erro
    // ou inválidos gera uma mensagem de erro gravando o erro no console
    if (data && Array.isArray(data.agencias)) {
      if (data.agencias.length > 0) {
        data.agencias.forEach(item => {
          console.log('Processando item:', item);
          insertList(item.idBanco, item.idAgencia, item.descricao);
        });
      }
    } else {
      console.error('Formato de dados inesperado recebido da API:', data);
      alert('Formato de dados inesperado recebido da API.');
    }

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Falha ao obter a lista de agências bancárias.');
  }
};

/***************************************************************************************
* Função para colocar um novo item na lista do servidor via requisição POST            *    
****************************************************************************************/
const postItem = async (inputBankCode, inputBranchCode, inputDescription) => {

  // Cria um formulário para envio dos dados
  const formData = new FormData();

  formData.append('idBanco',   inputBankCode);  
  formData.append('idAgencia', inputBranchCode);
  formData.append('descricao', inputDescription);

  // Grava no console um log com os valores que serão enviados para a base
  console.log([...formData.entries()]);

  // Monta a URL que sera chamada na API 
  const url = `http://127.0.0.1:5000/agencia`;
 
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
    console.error('Error:', error.message);
    alert('Falha ao gravar item na lista de agências bancárias.');
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
      const div      = this.parentElement.parentElement.parentElement;
      const tdBank   = div.getElementsByTagName('td')[0];
      const tdBranch = div.getElementsByTagName('td')[2];

      if ((tdBank) && (tdBranch)) {
        const idBank   = tdBank.innerHTML;
        const idBranch = tdBranch.innerHTML;

        if ((idBank) && (idBranch)) {
            
          if (confirm('Você tem certeza?')) {
            div.remove();
            deleteItem(idBank, idBranch);
         }
        } else {
          console.error("Código do Banco e/ou Agências em branco ou inválido");
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
const deleteItem = async(idBank, idBranch) => {

  console.log(idBank, idBranch);

  const url = `http://127.0.0.1:5000/agencia?idBanco=${idBank}&idAgencia=${idBranch}`;
  
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
* Função para adicionar uma nova agência                                               *    
****************************************************************************************/
const newBranch = async () => {

  // Captura os valores inseridos no formulário e converte para maiúsculas
  const inputBankCode    = document.getElementById("new-bank-code").value;
  const inputBranchCode  = document.getElementById("new-branch-code").value;
  const inputDescription = (document.getElementById("new-branch-description").value).toUpperCase();
  
  // Verifica se os campos estão vazios 
  if (inputBankCode === '') { 
    alert("Código do banco é obrigatório!"); 
  } else if (inputBranchCode === '') { 
    alert("Código da Agencia é obrigatório!"); 
  } else if (inputDescription === '') { 
    alert("Decrição da Agencia é obrigatória!"); 
  }

  // Se não houver erros, adicionar item 
  if ((inputBankCode) && (inputBranchCode) && (inputDescription)){
    const response = await postItem(inputBankCode, inputBranchCode, inputDescription);  
        
    if (response.ok) {
      insertList(inputBankCode, inputBranchCode, inputDescription);
    } 
  }
};

/***************************************************************************************
* Função para inserir agências na lista de apresentação                                * 
****************************************************************************************/
const insertList = async (inputBankCode, inputBranchCode, inputDescription) => {

  // Verificação e conversão do inputBankCode para inteiro 
  const bankCode = parseInt(inputBankCode, 10); 
  if (isNaN(bankCode)) { 
    console.error('código do banco deve ser um número inteiro válido'); 
    alert('O código do banco deve ser um número inteiro.'); 
    return; 
  }

  // Verificação e conversão do inputBranchCode para inteiro 
  const branchCode = parseInt(inputBranchCode, 10); 
  if (isNaN(branchCode)) { 
    console.error('código da agência deve ser um número inteiro válido'); 
    alert('O código da agência deve ser um número inteiro.'); 
    return; 
  } 
  
  // Verificação se inputDescription não é vazio 
  const branchDescription = inputDescription;
  if (!branchDescription || inputDescription.trim() === "") { 
    console.error('Descrição da agência não pode estar vazio'); 
    alert('A descrição não pode estar vazia.'); 
    return; 
  }
  
  
  let bankMap = await createBankMap();
  
  // Função para obter a descrição do banco pelo código
  function getBankDescription(code) {
    return bankMap[code] || 'Banco não encontrado';
  }
  const bankDescription = getBankDescription(bankCode);

  var item  = [bankCode, bankDescription, branchCode, branchDescription]
  var table = document.getElementById('table-branch');
  var row   = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
    if ((i == 0) || (i == 2)) {
      cel.id = 'td-code';
    } else if ((i == 1) || (i == 3)) {
      cel.id = 'td-description';
    }
  }
  
  insertButton(row.insertCell(-1))

  document.getElementById("new-bank-code").value = "";
  document.getElementById("new-branch-code").value = "";
  document.getElementById("new-branch-description").value = "";

  removeElement()
};

/***************************************************************************************
* Função para obter a lista de bancos existente do servidor via requisição GET         *    
****************************************************************************************/
async function getListBank() {
  // Monta a URL que sera chamada na API
  const url = `http://127.0.0.1:5000/banco`;

  // Verifica se os bancos já estão armazenados em cache e se a última atualização foi a 10 minutos
  let cachedBanks = localStorage.getItem('banks');
  let lasUpdated  = localStorage.getItem('banks-last-updated');
  let now = new Date().getTime();

  if (cachedBanks && lasUpdated && (now - lasUpdated < 6000)) { 
    console.log('Lendo lista de bancos do cache'); 
    return JSON.parse(cachedBanks); 
  }

  try {

    // Verifica o status da conexão e faz a chamada para a API
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Erro na resposta da chamada');
    }

    // Recebe o retorno da API e grava no console um log com o retorno da API
    const data = await response.json();
    console.log('Dados recebidos:', data);

    // Verifica se o valore retornado é um array de elementos e cria linhas na tabela
    // para cada valor retornado. Caso o JSON retornado tenha componentes com erro
    // ou inválidos gera uma mensagem de erro gravando o erro no console
    if (data && Array.isArray(data.bancos)) {
      if (data.bancos.length > 0) {
        let bancosArray = data.bancos.map(item => ({
          codigo: item.idBanco,
          descricao: item.descricao
        }));

        // Armazena a lista de bancos e a marca de tempo em cache
        localStorage.setItem('banks', JSON.stringify(bancosArray));
        localStorage.setItem('banks-last-updated', now.toString());
        return bancosArray;

      } else {
        console.warn('Nenhum banco retonado na resposta');
        return[];
      }
    } else {
      console.error('Erro no formato dos dados retornados', data);
      return[];
    }

  } catch (error) {
    console.error('Erro:', error.message);
    return[];
  }
}

/***************************************************************************************
* Função autocompletar para o campo banco                                              *    
****************************************************************************************/
document.addEventListener("DOMContentLoaded", function() {

  const autoCompletBank = async () => {
    
    function populateDropdown(selectElement, bankList) {
       
      bankList.forEach(function(item) {
            let option = document.createElement("option");
            option.value = item.codigo;
            option.textContent = item.descricao;
            selectElement.appendChild(option);
        });
    }

    let selectElement = document.getElementById("new-bank-code"); 
    let bankList = await getListBank();   // Obtém a lista de bancos (do cache ou da API) 
    console.log(bankList);                // Deve exibir a lista de descrições dos bancos
    populateDropdown(selectElement, bankList);
  }

  autoCompletBank();  // Chama a função para preencher o select após o carregamento do DOM
});

/***************************************************************************************
* Função para criar o objeto mapeando códigos de bancos para descrições                *    
****************************************************************************************/
async function createBankMap() { 
  let bankList = await getListBank(); 
  let bankMap = {}; 
  
  bankList.forEach(bank => { 
    bankMap[bank.codigo] = bank.descricao; 
  }); 
  
  return bankMap; 
}

/***************************************************************************************
* Função para inserir o Banco na lista apresentada                                  *    
****************************************************************************************/
function searchValue() { 

  // Obtenha o valor do input de busca 
  const searchValue = document.getElementById('input-search').value; 
  
  // Obtenha todas as linhas da tabela 
  const rows = document.querySelectorAll('#table-branch tbody tr');
  console.log('Linhas da tabela:', rows); // Verificação

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
