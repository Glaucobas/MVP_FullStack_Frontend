/****************************************************************************************
 * Chamada para o carregamento das funções                                              *
 ****************************************************************************************/
getList();


/****************************************************************************************
 * Função para obter a lista de categorias cadastradas no servidor via requisição GET   *
 ****************************************************************************************/
async function getList() {

  const url = `http://127.0.0.1:5000/index`;

  try {
    
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }

    const data = await response.json();

    console.log('Data received:', data);

    if (data && Array.isArray(data.categorias)) {
      if (data.categorias.length > 0) {
        data.categorias.forEach(item => {
          console.log('Processing item:', item);
          insertList(item.idCategoria);
        });
      }
    } else {
      console.error('Formato inesperado dos dados:', data);
      alert('Formato de dados inesperado recebido da API.');
    }

  } catch (error) {
    console.error('Error:', error.message);
    alert('Falha ao obter a lista de categorias. Tente novamente mais tarde.');
  }
};

/***************************************************************************************
* Função para inserir uma lista de categorias na tabela                                *
****************************************************************************************/
const insertList = (inputBranch) => {

  var table = document.getElementById('table-home');
  var row   = table.insertRow();

  for (var i = 0; i < 27; i++) {
    var cel = row.insertCell(i);
    if (i === 0) {
      cel.textContent = inputBranch;
      cel.id = 'td-description';
    } else {
      cel.textContent = '0,00';
      cel.id = 'td-value';
    }  
  }
};