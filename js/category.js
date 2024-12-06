/***************************************************************************************
* Chamada da função para carregamento inicial dos dados                                 *    
****************************************************************************************/
getList();

/***************************************************************************************
* Função para obter a lista existente do servidor via requisição GET                   *    
****************************************************************************************/
async function getList() {

  // Monta a URL que sera chamada na API
  const url = `http://127.0.0.1:5000/categoria`;

  try {
    
    // Verifica o status da conexão ne faz a chamada para a API
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Resposta da rede com erro');
    }

    // Recebe o retorno da API e grava noi log do console
    const data = await response.json();
    console.log('Dados recebidos:', data);

    // Verifica se o valore retornado é um array de elementos e cria linhas na tabela
    // para cada valor retornado. Caso o JSON retornado tenha componentes com erro
    // ou inválidos gera uma mensagem de erro gravando o erro no console
    if (data && Array.isArray(data.categorias)) {
      if (data.categorias.length > 0) {
        data.categorias.forEach(item => {
          console.log('Processando item:', item);
          
          /*
          "I" = Saldo Inicial
          "R" = Receita (+)
          "D" = Despesa (-)
          "T" = Transferências Recebidas (+)
          "E" = Transferências Enviadas (-)
          "C" = Créditos Diversos
          "O" = Outros
          */
          
          let inputExpenseType;

          if (item.debCred == "I") {
            inputExpenseType = "Saldo Inicial";
          } else if (item.debCred == "R") {
            inputExpenseType = "Receita (+)";
          } else if (item.debCred == "D") {
            inputExpenseType = "Despesa (-)";
          } else if (item.debCred == "T") {
            inputExpenseType = "Transferências Recebidas (+)";
          } else if (item.debCred == "E") {
            inputExpenseType = "Transferências Enviadas (-)";
          } else if (item.debCred == "C") {
            inputExpenseType = "Créditos Diversos (+)";
          } else {
            inputExpenseType = "Outros (-)";
          }
          
          insertList(item.idCategoria, inputExpenseType);
        });
      }
    } else {
      console.error('Formato de dados inesperado recebido:', data);
      alert('Formato de dados inesperado recebido.');
    }

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Falha ao obter a lista de categorias.');
  }
};

/***************************************************************************************
* Função para colocar uma categoria na lista do servidor via requisição POST           *    
****************************************************************************************/
const postItem = async (idCategory, expenseType) => {

  // Cria um formulário para envio dos dados
  const formData = new FormData();

  formData.append('idCategoria', idCategory);
  formData.append('debCred',     expenseType);

  // Grava no console um log com os valores que serão enviados para a base
  console.log([...formData.entries()]);

  // Monta a URL que sera chamada na API 
  const url = `http://127.0.0.1:5000/categoria`;
 
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
    console.log('Sucesso:', data);
    
    return response;

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Falha ao gravar item na lista de categorias.');
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
* Função para deletar um item da lista do servidor via requisição DELETE                *    
****************************************************************************************/
const deleteItem = async(idCategory) => {

  console.log(idCategory);

  const url = `http://127.0.0.1:5000/categoria?idCategoria=${idCategory}`;
  
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
      console.error('Error:', error);
  }
};

/***************************************************************************************
* Função para adicionar uma nova categoria                                             *    
****************************************************************************************/
const newCategory = async () => {

  // Captura os valores inseridos no formulário e converte para maiúsculas
  const inputCategory   = (document.getElementById("new-description").value).toUpperCase();
  const inputExpenseType = (document.getElementById("new-expanse-type").value).toUpperCase();

  // Verifica se os campos estão vazios 
  if (inputCategory === '') { 
    alert("Descrição da categoria não pode sem branco ou nula!"); 
  }

  if (inputExpenseType === '') { 
    alert("Tipo de Despesa não pode ser branco!"); 
  }

  // Se não houver erros, adicionar item 
  if ((inputCategory) &&  (inputExpenseType)) {
    const response = await postItem(inputCategory, inputExpenseType);  
        
    if (response.ok) {
      
      let expenseType;

      if (inputExpenseType == "I") {
        expenseType = "Saldo Inicial";
      } else if (inputExpenseType == "R") {
        expenseType = "Receita (+)";
      } else if (inputExpenseType == "D") {
        expenseType = "Despesa (-)";
      } else if (inputExpenseType == "T") {
        expenseType = "Transferências Recebidas (+)";
      } else if (inputExpenseType == "E") {
        expenseType = "Transferências Enviadas (-)";
      } else if (inputExpenseType == "C") {
        expenseType = "Créditos Diversos (+)";
      } else {
        expenseType = "Outros (-)";
      }

      insertList(inputCategory, expenseType);
    } 
  }
};

/***************************************************************************************
* Função para inserir Categorias na lista apresentada                                  *    
****************************************************************************************/
const insertList = (inputCategory, inputExpenseType) => {

  var item  = [inputCategory, inputExpenseType]
  var table = document.getElementById('table-category');
  var row   = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);

    if ((i==0) || (i==1)) {
      cel.id = 'td-description';  
      cel.textContent = item[i];
    }
  }

  insertButton(row.insertCell(-1));
  
  document.getElementById("new-description").value = "";
  document.getElementById("new-expanse-type").value = "";
  
  removeElement();
};

/***************************************************************************************
* Função para inserir o Banco na lista apresentada                                  *    
****************************************************************************************/
function searchValue() { 

  // Obtenha o valor do input de busca 
  const searchValue = document.getElementById('input-search').value; 
  
  // Obtenha todas as linhas da tabela 
  const rows = document.querySelectorAll('#table-category tbody tr');
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