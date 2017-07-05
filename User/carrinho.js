povoarCarrinho();

var produtos_comprados;

function pagar() {
	let numero=document.getElementById("numero_cartao").value;
	if(numero=="") {
		alert("Insira o número do cartão");
		return;
	}
	let nome=document.getElementById("nome_cartao").value;
	if(nome=="") {
		alert("Insira o nome do titular como escrito no cartão");
		return;
	}
	let mes=document.getElementById("mes_cartao").value;
	if(mes=="") {
		alert("Insira a data de validade do cartão");
		return;
	}
	let cvv=document.getElementById("cvv_cartao").value;
	if(cvv=="") {
		alert("Insira o códgio de segurança do cartão");
		return;
	}
	
	produtos_comprados=JSON.stringify(produtos_comprados);
	
	let solicitacao="http://localhost:8080/pagamento?prods="+produtos_comprados;
	console.log(solicitacao);

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
			limpar();
			exibir_produtos();
			povoarCarrinho();
		}
	};	
}

function limpar() {
	//remove uma unidade do produto no carrinho
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco do carrinho
	let request=indexedDB.open("carrinhoDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se o banco não puder ser aberto, é criado
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id"});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		store.clear();
	};
}

function finalizar() {
	//ao apertar o botão, os dados para pagamento são exibidos
	document.getElementById("carrinho").innerHTML+='\
		<div id="finalizar" style="text-align: center;">\
			<div class="formulario">\
				<div class="formulario">\
					<p>Número do cartão de crédito:</p>\
					<input type="number" id="numero_cartao">\
				</div>\
				<div class="formulario">\
					<p>Nome como está escrito no cartão:</p>\
					<input type="text" id="nome_cartao">\
				</div>\
				<div class="formulario">\
					<p>Data de validade:</p>\
					<input type="month" id="mes_cartao">\
				</div>\
				<div class="formulario">\
					<p>Código de segurança:</p>\
					<input type="number" id="cvv_cartao">\
				</div>\
				<div class="formulario">\
					<button onclick="pagar()">Pagar</button>\
				</div>\
			</div>\
		</div>';
	document.getElementById("botao_finalizar").disabled=true;
	
}

function povoarCarrinho() {
	//função que exibe todos os produtos do carrinho
	if(!window.indexedDB) {
		//testa se o indexedDB está disponível
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco carrinhoDB
	let request=indexedDB.open("carrinhoDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se não abre, o banco é criado
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id"});
	};
	
	//limpa tudo que está no carrinho
	document.getElementById("carrinho").innerHTML='';
	
	//preço que vai ser incrementado pra dar o valor da compra
	let preco_total=0;
			
	produtos_comprados=JSON.parse('[]');

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		store.openCursor().onsuccess=(event)=> {
			//abre um cursor com todos os produtos no carrinho
			let cursor=event.target.result;
			
			if(cursor) {
				
				if(cursor.value.quantidade!=0) {
					//exibe apenas os produtos com quantidade selecionada maior que zero
					document.getElementById("carrinho").innerHTML+='\
						<div class="produto-carrinho">\
							<div class="produto">\
								<img src="'+cursor.value.url+'" alt="'+cursor.value.nome+'" style="width:160px;height:160px">\
								<p>'+cursor.value.nome+'</p>\
							</div>\
							<div class="quantidade">\
								<p>Quantidade:</p>\
								<p>'+cursor.value.quantidade+'</p>\
								<button onclick="remover(\''+cursor.value.id+'\',\''
								+cursor.value.url+'\',\''+cursor.value.nome+'\','+cursor.value.quantidade_disponivel+','+cursor.value.preco+')">-</button>\
								<button onclick="adicionar(\''+cursor.value.id+'\',\''
								+cursor.value.url+'\',\''+cursor.value.nome+'\','+cursor.value.quantidade_disponivel+','+cursor.value.preco+')">+</button>\
							</div>\
							<div class="quantidade">\
								<p>Preço total:</p>\
								<p>'+(cursor.value.quantidade*cursor.value.preco).toFixed(2).toString().replace('.', ',')+'</p>\
							</div>\
						</div>\
						<br>';
						
					produtos_comprados.push({id: cursor.value.id, quantidade: cursor.value.quantidade});
					
					preco_total+=cursor.value.quantidade*cursor.value.preco;
				}
				
				cursor.continue();
			}
			else {
				//quando encerra o cursor, exibe o preço final e permite finalizar
				document.getElementById("carrinho").innerHTML+='\
					<div id="total"><!--soma de todos os produtos do carrinho-->\
						<p>Total geral:</p>\
						<p id="total">R$'+preco_total.toFixed(2).toString().replace('.', ',')+'</p><br>\
						<button type="button" id="botao_finalizar" onclick="finalizar()">Finalizar</button>\
					</div>';
			}
		};
	};
}

function adicionar(id, url, nome, quantidade_disponivel, preco) {	
	window.location.href='/User/user.html#carrinho';
	//adiciona produtos no carrinho
	if(!window.indexedDB) {
		//testa se o indexedDB está disponível
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco do carrinho
	let request=indexedDB.open("carrinhoDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se o banco não existe, é criado
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id"});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		//procura o produto com o id passado
		let getProduto=store.get(id);
		let quantidade;
		
		getProduto.onsuccess=()=> {
			try {
				//se o produto já está no banco, sua quantidade é selecionada
				quantidade=getProduto.result.quantidade;
			}
			catch(err) {
				//se não foi encontrado, a quantidade é zero
				quantidade=0;
			}
			if(quantidade+1<=quantidade_disponivel) {
				///adiciona ou atualiza o produto com a nova quantidade
				store.put({id: id, quantidade: (quantidade+1), quantidade_disponivel: quantidade_disponivel, url: url, nome: nome, preco: preco});
				//exibe o carrinho novamente
				povoarCarrinho();
			}
			else {
				//caso não haja mais ítens do produto disponíveis
				alert("A quantidade desejada não está disponível");
			}
		}

		tx.oncomplete=()=> {
			db.close();
		};
	};
}

function remover(id, url, nome, quantidade_disponivel, preco) {	
	//remove uma unidade do produto no carrinho
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco do carrinho
	let request=indexedDB.open("carrinhoDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se o banco não puder ser aberto, é criado
		let db=request.result;
		let store=db.createObjectStore("produtos", {keyPath: "id"});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("produtos", "readwrite");
		let store=tx.objectStore("produtos");
		
		//busca o produto com o id desejado
		let getProduto=store.get(id);
		let quantidade;
		
		getProduto.onsuccess=()=> {
			try {
				//se já estava no carrinho, busca a quantidade que possuia
				quantidade=getProduto.result.quantidade;
			}
			catch(err) {
				//se não estava, a quantidade é zero
				quantidade=0;
			}
			if(quantidade>0) {
				//salva a nova quantidade
				store.put({id: id, quantidade: (quantidade-1), quantidade_disponivel: quantidade_disponivel, url: url, nome: nome, preco: preco});
				povoarCarrinho();
			}
		}

		tx.oncomplete=()=> {
			db.close();
		};
	};
}

	
