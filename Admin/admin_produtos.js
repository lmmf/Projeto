//usuario logado fica escrito na tela
let logado = localStorage.getItem("atualLogado");
let spanLogado = document.createElement("span");
let texto = document.createTextNode("Usuário: " +logado);
spanLogado.appendChild(texto);
spanLogado.setAttribute("id", "usuario_logado");

let element = document.getElementById("logo");
element.appendChild(spanLogado);

let buttonLogout = document.createElement("button");
buttonLogout.appendChild(document.createTextNode("Logout"));
buttonLogout.setAttribute("id","buttonLogout");
buttonLogout.setAttribute("value","Logout");
buttonLogout.setAttribute("onclick","logout()");

element.appendChild(buttonLogout);
//----------------------------------------------------------

function logout() {
	if (typeof(Storage) !== "undefined") 
			localStorage.removeItem("atualLogado");	//deleta o token da pessoa logada
	window.location.href="../Index/index.html";
	return;
}

lista_apagar();

function adicionar_produto() {
	//como não é possivel adicionar arquivos pelo Javascript, a função de adicionar fotos não está realmente implementada
	//quando o usuário adiciona uma foto, na verdade é utilizada uma imagem de erro, já presente
	let url="Produtos/error.jpg";
	let nome=document.getElementById("nome_produto").value;
	let descricao=document.getElementById("descricao_produto").value;
	//o + serve para pegar como number
	let preco=+document.getElementById("preco_produto").value;
	let quantidade=+document.getElementById("quantidade_produto").value;
	
	if(nome=="" || descricao=="" || preco=="" || quantidade=="") {
		alert("Preencha todos os dados do produto");
		return;
	}

	let solicitacao="http://localhost:8080/cadastro_prod?"+
	"url="+url+
	"&nome="+nome+
	"&descricao="+descricao+
	"&preco="+preco+
	"&quantidade="+quantidade+
	"&vendidos=0";

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
		}
	}

	document.getElementById("cadastrar_prod").reset();
}

function lista_apagar() {
	//Esse texto permanecerá aparente apenas se não houver produtos
	document.getElementById("lista_apagar").innerHTML='\
				<div class="produto-carrinho">\
					<div class="produto">\
						<p>Não há produtos para listar</p>\
					</div>\
				</div>';

	if(!window.indexedDB) {
		//verifica se o indexedDB está disponível
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir a base de produtos
	let request=indexedDB.open("produtosDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se a base não existir, é criada
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		//flag utilizada para saber se há pelo menos um produto
		let flag=0;
		
		store.openCursor().onsuccess=(event)=> {
			let cursor=event.target.result;
			
			if(cursor) {
				if(flag==0) {
					//quando o primeiro produto é encontrado, a lista é limpa
					document.getElementById("lista_apagar").innerHTML='';
					flag=1;
				}
				
				//insere todos os produtos
				//o usuário pode apagá-lo clicando em qualquer ligar do div
				document.getElementById("lista_apagar").innerHTML+='\
								<div class="produto" onclick="apagar_produto('+cursor.value.id+')">\
									<img src="'+cursor.value.url+'"\
									alt="'+cursor.value.nome+'" style="width:160px;height:160px">\
									<p>'+cursor.value.nome+'</p>\
								</div>\
								<div class="quantidade">\
									<p>ID: '+cursor.value.id+'</p>\
								</div>\
							<br>';
				cursor.continue();
			}
		};
	};
}
	

function apagar_produto(id) {
	//apaga o produto selecionado (ou entrado pelo user)
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}
	
	if(arguments.length==0) {
		//só argumento quando é chamada ao clicar na lista
		//se não há argumentos, é utilizado o id entrado pelo usuário		
		id=+document.getElementById("id_apagar").value;
		
		if(id=="") {
			alert("Insira o ID do produto");
			return;
		}
	}

	let db;
	//tenta abrir a base de produtos
	let request=indexedDB.open("produtosDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se a base não existe, é criada
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		//apaga o objeto
		console.log(id);
		let apagar=store.delete(id);

		apagar.onsuccess = (event) =>{
			//refaz a lista
			lista_apagar();
		};
		tx.oncomplete=()=> {
			db.close();
		};
	};
}

function atualizarProd() {
	//checa se o browser consegue trabalhar com indexeDB
	if(!indexedDB)
	{
		console.log("Seu navegador não suporta indexedDB.");
		return;		
	}

	//abre o pseudo banco (ou cria, caso não exista)
	let request=indexedDB.open("produtosDB",2);

	//se IndexedDB der erro
	request.onerror = (event) => {alert("Erro ao utilizar IndexedDB.");};

	request.onupgradeneeded=(event)=> 
	{ 
		//se a base não existir, é criada
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id"});
	};

	request.onsuccess=(event)=> 
	{
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");

		let id=+document.getElementById("id").value;
		let nome=document.getElementById("nome").value;
		let descricao=document.getElementById("descricao").value;
		let preco=+document.getElementById("preco").value;
		let quantidade=+document.getElementById("quantidade").value;
		let vendidos=+document.getElementById("vendidos").value;
		
		if(id=="")
		{
			alert("O campo ID deve ser preenchido!");
			return;
		}
		
		if(nome=="" && descricao=="" && preco=="" && quantidade=="" && vendidos=="") 
		{
			alert("Pelo menos um dos campos devem ser preechidos");
			return;	
		}
		
		//procura o produto com o id passado
		let getProduto=store.get(id);
				
		getProduto.onsuccess=()=> {
			//os dados em branco permanecerão iguais
			if(nome=="")
				nome=getProduto.result.nome;
			if(descricao=="")
				descricao=getProduto.result.descricao;
			if(preco=="")
				preco=getProduto.result.preco;
			if(quantidade=="")
				quantidade=getProduto.result.quantidade;
			if(vendidos=="")
				vendidos=getProduto.result.vendidos;
			url=getProduto.result.url;
			store.put({id: id, url: url, nome: nome, quantidade: quantidade, 
				vendidos: vendidos, descricao: descricao, preco: preco});			

		};

		alert("Produto atualizado com sucesso!");
		tx.oncomplete = () => {db.close();};
	};
	
}

function relatorio_produtos() {
	//mensagem só é exibida se não há produtos
	document.getElementById("consultar_prod").innerHTML='\
				<div class="produto-carrinho">\
					<div class="produto">\
						<p>Não há produtos para listar</p>\
					</div>\
				</div>';

	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir a base de produtos
	let request=indexedDB.open("produtosDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se a base não existe, é criada
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		//flag indica se há pelo menos um produto para listar
		let flag=0;
		
		store.openCursor().onsuccess=(event)=> {
			let cursor=event.target.result;
			//abre um cursor com todos os produtos
			if(cursor) {
				if(flag==0) {	
					//no primeiro produto, apaga a mensagem de erro e seta a flag
					document.getElementById("consultar_prod").innerHTML='';
					flag=1;
				}
				
				//adiciona os produtos ao DOM
				document.getElementById("consultar_prod").innerHTML+='\
							<div class="produto-carrinho">\
								<div class="produto">\
									<img src="'+cursor.value.url+'" alt="'+cursor.value.nome+'" style="width:160px;height:160px">\
									<p>'+cursor.value.nome+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Quantidade em estoque:</p>\
									<p>'+cursor.value.quantidade+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Preço unitário:</p>\
									<p>'+cursor.value.preco.toString().replace('.', ',')+'</p>\
								</div>\
								<div class="quantidade">\
									<p>ID:</p>\
									<p>'+cursor.value.id+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Vendidos:</p>\
									<p>'+cursor.value.vendidos+'</p>\
								</div>\
							</div>\
							<br>';
				console.log(cursor);
				cursor.continue();
			}
		};
	};
}
