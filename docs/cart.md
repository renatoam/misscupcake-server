# Regras de Negócio | Cart

## Cenário 1

- Usuário anonimo navega pelo site
	- Anonimo recebe um guest ID
	- Guest ID é salvo em web storage

- Anonimo add produtos no carrinho
	- Client envia account ID (como nulo)
	e guest ID para o servidor
	- App cria um novo carrinho com o 		guest ID
	- Dados do carrinho são
	salvos no banco de dados

- Anomimo fecha o browser
	- Web storage* mantem guest ID
	e/ou cart ID** salvos no client
	*: IndexedDB permite acesso mesmo
	offline
	**: acho que não precisa do cart ID

- Anomimo abre novamente o browser
	- Guest é recuperado do web storage
	e usado para buscar dados no server
	- Carrinho é carregado normalmente

## Cenário 2

- Usuário logado navega pelo site
	- Usuário recebe um account ID

- Usuário add produtos no carrinho
	- Client envia account ID e guest ID
	(como nulo) para o servidor
	- App cria um novo carrinho com o 
	account ID
	- Dados do carrinho são salvos no
	banco de dados

- Usuário fecha o browser ou desloga
	- Nada é salvo em web storage

- Anonimo abre novamente o browser ou realizar o login
	- Usa-se account ID pra buscar
	dados no servidor
	- Carrinho é carregado normalmente

## Cenário 3

- Usuário anonimo navega pelo site (ainda não tem conta ou tem conta, mas sem produtos no carrinho)
	- Anonimo recebe um guest ID
	- Guest ID é salvo em web storage

- Anonimo add produtos no carrinho
	- App cria um novo carrinho usando
	guest ID
	- Dados do carrinho são salvos no 
	banco de dados

- Anonimo faz login durante a jornada
	- Client envia account e guest ID, 
	ambos preenchidos, para o servidor
	- Servidor valida ambos IDs
		- Verifica os IDs informados existem e/ou são válidos
		- Se existem, verifica se há um
		carrinho associado a eles
		- Se não houver carrinho para 
		nenhum deles, nada acontece
		- Se houver carrinho associado
		ao account, pular para 
		cenário 3.1
	- Se houver carrinho associado ao 
	guest ID, servidor busca dados do 
	carrinho usando o guest ID
	- Servidor atualiza o userID no cart 	com o account ID, substituindo o
	guest ID previamente salvo
	- Servidor devolve o carrinho ao
	client normalmente

## Cenário 3.1 (continuação do 3)

- Usuário anonimo navega pelo site, mas já tem um carrinho criado em sua conta (ainda não logada) e faz login durante a jornada

- Servidor está validando se há carrinho associado a account id ou guest id

- Servidor encontra carrinho associado
ao account id
- Servidor responde solicitando que o usuário decida se deseja carregar carrinho atual ou sobrescrever com o novo (criado durante a jornada anonima)
	- Considerar como melhoria colocar 	uma opção pra salvar um desses
	carrinhos para "mais tarde" ou salvar 
	os produtos de um desses carrinhos 
	na lista de favoritos

- Usuário responde e servidor devolve carrinho escolhido

- Carrinho é carregado normalmente