# Regras de Negócio | Cart

Depois de muita pesquisa, pra saber como geralmente é feito em grandes e-commerces*, a jornada relacionada ao Cart será como descrito abaixo.

> *: embora esta aplicação seja pequena, a ideia é que seja uma POC com recursos usados em grandes apps.

Estando logado (account ID) ou não (guest ID) o cart é controlado via servidor, ou seja, teremos um recurso para cada transação (addToCart, UpdateCart, DeleteFromCart, LoadCart e DeleteCart).

## Cenário 1

- Usuário anônimo navega pelo site
	- Anônimo recebe um guest ID
	- Guest ID é salvo em web storage

- Anônimo adiciona produtos no carrinho via catálogo (Add to Cart)
  - Client envia account ID (como nulo) e guest ID para o servidor
  - Produtos são salvos via web storage (IndexedDB) para acesso offline (PWA)
    - Também podemos cachear as respostas das requests de catálogo para permitir requests offline

- Servidor cria um novo carrinho usando o guest ID enviado
  - O guest ID é validado antes e, sendo inválido, servidor retorna um erro

- Servidor retorna dados básicos do carrinho (suficiente pra exibir Mini Cart)

- Anônimo fecha o browser
	- IndexedDB mantém guest ID e carrinho salvos no Client
    - IndexedDB também permite criar collections, como com NoSQL, então podemos criar collections para wishlist e "save for later"

- Anônimo abre novamente o browser
	- Guest ID e carrinho são recuperados do IndexedDB
  - Carrinho é reidratado com os dados atualizados do servidor (Get Cart?*)

> *: se o usuário nunca chegou na tela de carrinho, não vai ter usado o Load Cart. Nesse caso, usamos o Add to Cart, que no caso de já haver um carrinho criado, apenas o atualiza.
> 
> Mas seria interessante ter um recurso específico para checar se o usuário já possui um carrinho salvo, talvez seja melhor do que usar o Add to Cart fora do escopo dele.

## Cenário 2

- Usuário logado navega pelo site
	- Usuário recebe um account ID

- Usuário adiciona produtos no carrinho (Add to Cart)
	- Client envia account ID e guest ID (nesse caso, nulo) para o servidor
	- Servidor cria um novo carrinho com o account ID
    - Account ID é validado na autenticação
	- Dados do carrinho são salvos no banco de dados

- Usuário fecha o browser ou desloga
  - Talvez tenha que salvar no web storage também pra usar o PWA

- Usuário abre novamente o browser
	- Guest ID e carrinho são recuperados do IndexedDB
  - Carrinho é reidratado com os dados atualizados do servidor (Get Cart?)

- Usuário faz login durante a jornada
	- Client envia account ID e guest ID, ambos preenchidos*, para o servidor
    - Account ID é preenchido somente quando há autenticação

- Servidor valida ambos os IDs
  - Verifica se guest ID é válido
  - Account ID já é verificado na fase de autenticação
  - Se guest ID for inválido, retorna mensagem de erro

- Servidor verifica que há um carrinho associado ao guest ID

- Servidor verifica que _também_ há um carrinho associado ao account ID

- Servidor verifica que o cart ID associado a ambos é o mesmo

- Servidor atualiza o user ID do cart, no banco de dados, com o account ID, substituindo o guest ID previamente utilizado (afinal, estando logado, usuário não precisa mais do guest ID)

- Servidor devolve o carrinho ao Client normalmente

## Cenário 3

- Anônimo (usuário deslogado) navega pelo site. Tem conta, mas sem produtos no carrinho
	- Anônimo recebe um guest ID
	- Guest ID é salvo em web storage

- Anônimo adiciona produtos no carrinho via catálogo (Add to Cart)
  - Client envia account ID (como nulo) e guest ID para o servidor
  - Produtos são salvos no IndexedDB
  - _Se anônimo fechasse o browser, entraria no cenário 1_

- Servidor cria um novo carrinho usando o guest ID enviado
  - O guest ID é validado antes e, sendo inválido, servidor retorna um erro

- Servidor retorna dados básicos do carrinho (suficiente pra exibir Mini Cart)

- Anônimo faz login durante a jornada
	- Client envia account ID e guest ID, ambos preenchidos*, para o servidor
    - Account ID é preenchido somente quando há autenticação

- Servidor valida ambos os IDs
  - Verifica se guest ID é válido
  - Account ID já é verificado na fase de autenticação
  - Se guest ID for inválido, retorna mensagem de erro

- Servidor verifica se há um carrinho associado ao guest ID*

- Servidor verifica que _não há*_ um carrinho associado ao account ID
  - O cenário cujo account ID tem carrinho associado é contemplado no **4**

> *: verificamos o guest ID primeiro, pois o cenário mais comum será da criação de um carrinho com um guest ID. Assim evitamos processamento à toa para um account ID que não existe.

- Se houver carrinho associado ao guest ID
  - Servidor recupera dados do carrinho do banco de dados
  - Servidor atualiza o user ID do cart, no banco de dados, com o account ID, substituindo o guest ID previamente utilizado (afinal, estando logado, usuário não precisa mais do guest ID)

- Servidor devolve o carrinho ao Client normalmente

## Cenário 4

- Anônimo (usuário deslogado) navega pelo site. Tem conta com produtos no carrinho (mas ainda não sabe/lembra)
	- Anônimo recebe um guest ID
	- Guest ID é salvo em web storage

- Anônimo adiciona produtos no carrinho via catálogo (Add to Cart)
  - Client envia account ID (como nulo) e guest ID para o servidor
  - Produtos são salvos no IndexedDB
  - _Se anônimo fechasse o browser, entraria no cenário 1_

- Servidor cria um novo carrinho usando o guest ID enviado
  - O guest ID é validado antes e, sendo inválido, servidor retorna um erro

- Servidor retorna dados básicos do carrinho (suficiente pra exibir Mini Cart)

- Anônimo faz login durante a jornada
	- Client envia account ID e guest ID, ambos preenchidos*, para o servidor
    - Account ID é preenchido somente quando há autenticação

- Servidor valida ambos os IDs
  - Verifica se guest ID é válido
  - Account ID já é verificado na fase de autenticação
  - Se guest ID for inválido, retorna mensagem de erro

- Servidor verifica que há um carrinho associado ao guest ID

- Servidor verifica que _também_ há um carrinho associado ao account ID

- Servidor verifica que o cart ID associado a ambos é o mesmo

- Servidor verifica que são diferentes

- Servidor responde solicitando uma resposta do usuário
  - Usuário precisa decidir se deseja carregar carrinho recuperado (com account ID) ou sobrescrever com o novo (criado com guest ID)
	- Considerar como melhoria colocar uma opção pra salvar um desses carrinhos para "mais tarde" ou salvar os produtos de um desses carrinhos na lista de favoritos (ou wishlist)

- Usuário responde e servidor devolve carrinho escolhido
  - Decidir como será feita essa comunicação

- Carrinho é carregado normalmente
