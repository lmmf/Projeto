exibir_animais();

/*	let dados_animais=`[
		{"url":"Animais/fifi.jpg", "nome":"Fifi", "id":1, "raca":"Poodle", "idade":3},
		{"url":"Animais/rex.jpg", "nome":"Rex", "id":2, "raca":"Pit Bull", "idade":2},
		{"url":"Animais/pantera.jpg", "nome":"Pantera", "id":3, "raca":"Bengal", "idade":1},
		{"url":"Animais/lorde.jpg", "nome":"Lorde", "id":4, "raca":"Persa", "idade":6},
		{"url":"Animais/cenoura.jpg", "nome":"Cenoura", "id":5, "raca":"Coelho", "idade":3},
		{"url":"Animais/faisca.jpg", "nome":"Faísca", "id":6, "raca":"Calopsita", "idade":2},
		{"url":"Animais/haroldo.jpg", "nome":"Haroldo", "id":7, "raca":"Furão", "idade":8}
	]`;*/

function exibir_animais() {	
	//inclui todos os animais no DOM

	//primeiro limpa todos os animais, para evitar repetição
	document.getElementById("animais").innerHTML='';
	
	let solicitacao="http://localhost:8080/list_animais?"+
		'&email='+logado;

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			obj=JSON.parse(string);
			
			//adiciona todos os animias no DOM
			for(let i=0;i<obj.length;i++) {
				document.getElementById("animais").innerHTML+='\
					<div class="animal">\
						<img src="'+obj[i].url+'" alt="'+obj[i].nome+'" style="width:160px;height:160px">\
					</div>\
					<div class="quantidade">\
						<p>Nome:</p>\
						<p>'+obj[i].nome+'</p>\
					</div>\
					<div class="quantidade">\
						<p>ID:</p>\
						<p>'+obj[i]._id+'</p>\
					</div>\
					<div class="quantidade">\
						<p>Raça:</p>\
						<p>'+obj[i].raca+'</p>\
					</div>\
					<div class="quantidade">\
						<p>Idade:</p>\
						<p>'+obj[i].idade+' ano(s)</p>\
					</div>\
					<br>';
			}			
		}
	};
}

function adicionar_animal() {
	//como não é possível trabalhar com os arquivos, usa-se uma imagem falsa
	//sempre que um animal é adicionado, sua foto é uma imagem de erro
	let url="Animais/error.jpg";
	let nome=document.getElementById("nome_animal").value;
	let raca=document.getElementById("raca_animal").value;
	let idade=document.getElementById("idade_animal").value;
	let email=logado;
	
	if(nome=="" || raca=="" || idade=="") {
		alert("Insira todos os dados do animal");
		return;
	}
	
	let solicitacao="http://localhost:8080/cadastro_animal?"+
		"nome="+nome+
		"&raca="+raca+
		"&idade="+idade+
		"&url="+url+
		"&email="+email;

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
			exibir_animais();
		}
	}
}

