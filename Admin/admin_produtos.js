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
	window.location.href="../index.html";
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

	let xmlhttp=new XMLHttpRequest();
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
		
	//flag utilizada para saber se há pelo menos um produto
	let flag=0;
				
	let solicitacao="http://localhost:8080/list_prod";

	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();
	
	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			obj=JSON.parse(string);
			
			//adiciona todos os produtos no DOM
			for(let i=0;i<obj.length;i++) {
				if(flag==0) {
					//quando o primeiro produto é encontrado, a lista é limpa
					document.getElementById("lista_apagar").innerHTML='';
					flag=1;
				}
				//insere todos os produtos
				//o usuário pode apagá-lo clicando em qualquer ligar do div
				document.getElementById("lista_apagar").innerHTML+='\
								<div class="produto" onclick="apagar_produto(\''+obj[i]._id+'\')">\
									<img src="'+obj[i].url+'"\
									alt="'+obj[i].nome+'" style="width:160px;height:160px">\
									<p>'+obj[i].nome+'</p>\
								</div>\
								<div class="quantidade">\
									<p>ID: '+obj[i]._id+'</p>\
								</div>\
							<br>';
			}	
		}
	}				
}
	

function apagar_produto(id) {
	//apaga o produto selecionado (ou entrado pelo user)	
	if(arguments.length==0) {
		//só argumento quando é chamada ao clicar na lista
		//se não há argumentos, é utilizado o id entrado pelo usuário		
		id=document.getElementById("id_apagar").value;
		
		if(id=="") {
			alert("Insira o ID do produto");
			return;
		}
	}
	
	//apaga o produto selecionado (ou entrado pelo user)
	let solicitacao="http://localhost:8080/apaga_prod?"+
	"id="+id;

	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			let string=xmlhttp.responseText;
			alert(string);
			lista_apagar();
		}
	}
}

function atualizarProd() {
	let id=document.getElementById("id").value;
	let nome=document.getElementById("nome").value;
	let descricao=document.getElementById("descricao").value;
	let preco=document.getElementById("preco").value;
	let quantidade=document.getElementById("quantidade").value;
	let vendidos=document.getElementById("vendidos").value;
	let url="";
	
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
	
	
	
	let solicitacao="http://localhost:8080/altera_prod?"+
		"id="+id+
		"&nome="+nome+
		"&descricao="+descricao+
		"&url="+url+
		"&preco="+preco+
		"&quantidade="+quantidade+
		"&vendidos="+vendidos;
		
	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if(xmlhttp.readyState==4 && xmlhttp.status==200) {
			let string=xmlhttp.responseText;
			alert(string);
			document.getElementById("form_prod").reset();
		}
	};	
	
	
		//procura o produto com o id passado
		/*
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
				vendidos: vendidos, descricao: descricao, preco: preco});*/
	
}

function relatorio_produtos() {
	//mensagem só é exibida se não há produtos
	document.getElementById("consultar_prod").innerHTML='\
				<div class="produto-carrinho">\
					<div class="produto">\
						<p>Não há produtos para listar</p>\
					</div>\
				</div>';
				
	//flag utilizada para saber se há pelo menos um produto
	let flag=0;
				
	let total=0;
				
	let solicitacao="http://localhost:8080/list_prod";

	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();
	
	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			obj=JSON.parse(string);
			
			//adiciona todos os produtos no DOM
			for(let i=0;i<obj.length;i++) {
				if(flag==0) {
					//quando o primeiro produto é encontrado, a lista é limpa
					document.getElementById("consultar_prod").innerHTML='';
					flag=1;
				}
				//adiciona os produtos ao DOM
				document.getElementById("consultar_prod").innerHTML+='\
							<div class="produto-carrinho">\
								<div class="produto">\
									<img src="'+obj[i].url+'" alt="'+obj[i].nome+'" style="width:160px;height:160px">\
									<p>'+obj[i].nome+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Quantidade em estoque:</p>\
									<p>'+obj[i].quantidade+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Preço unitário:</p>\
									<p>R$ '+(+obj[i].preco).toFixed(2).toString().replace('.', ',')+'</p>\
								</div>\
								<div class="quantidade">\
									<p>ID:</p>\
									<p>'+obj[i]._id+'</p>\
								</div>\
								<div class="quantidade">\
									<p>Vendidos:</p>\
									<p>'+obj[i].vendidos+'</p>\
								</div>\
							</div>';
				total+=obj[i].vendidos*obj[i].preco;
			}	
			document.getElementById("consultar_prod").innerHTML+='\
						<br>\
						<div class="produto-carrinho">\
							<div class="produto">\
								<p>Total vendido: R$ '+total.toFixed(2).toString().replace('.', ',')+'</p>\
							</div>\
						</div>';
		}
	}				
}