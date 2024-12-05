# Objetivo do Sistema

O objetivo principal do sistema é servir como um auxiliar ajudando na organização financeira pessoal.

---
# HTML

O sistema esta dividido em quatro arquivos, o Index.html e o aquivo inicial onde temos também os arquivos bank.html, branch.html e catagory.html cada um responsável por um tipo de cadastro. 

A pasta imagens guarda os arquivos de imagens utilizados no sistema.

A pasta JS contem os arquivos Javascripts responsáveis pela integração com a API.

A pasta CSS conte um único arquivo style.css. Todas as definições de fontes, cores entre outros estão armazenadas neste arquivo.

---
## Como executar 

Será necessário ter a API rodando para iniciar a aplicação. A página inicial (idex.html) faz uma consulta na base de dados através da API que retorna os títulos cadastrados no sistema, caso a API não esteja rodando ao iniciar a página o sistema podera exibir uma mensagem de falha na leitura do banco.

Ao abrir o sistema pelo endereço http://localhost:5000/#/ no navegador ira verificar o status da API em execução e ira demonstra a página da documentação.

Para iniciar o sistema execute o arquivo index.html na pasta principal da aplicação.