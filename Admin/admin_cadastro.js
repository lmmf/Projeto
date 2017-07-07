function cadastrar_admin() {
	let nome=document.getElementById("nome_admin").value;
	if(nome=="") {
		alert("Insira seu nome.");
		return;
	}
	let email=document.getElementById("login_admin").value;
	if(email=="") {
		alert("Insira seu email.");
		return;
	}
	let senha=document.getElementById("senha_admin").value;
	if(senha=="") {
		alert("Insira uma senha.");
		return;
	}


	let solicitacao="http://localhost:8080/cadastro_user?"+
		"nome="+nome+
		"&email="+email+
		"&senha="+senha+
		"&telefone="+""+
		"&endereco="+""+
		"&cidade="+""+
		"&estado="+""+
		"&tipo=admin";

	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
		}
	}
	
	
	document.getElementById("cadastrar_admin").reset();
}


function cadastrar_user() {
let nome=document.getElementById("nome_user").value;
	if(nome=="") {
		alert("Insira seu nome.");
		return;
	}
	let email=document.getElementById("login_user").value;
	if(email=="") {
		alert("Insira seu email.");
		return;
	}
	let senha=document.getElementById("senha_user").value;
	if(senha=="") {
		alert("Insira uma senha.");
		return;
	}
	let senha_confirme=document.getElementById("senha_user_confirme").value;
	if(senha_confirme!=senha) {
		alert("As senhas não conferem.");
		return;
	}
	let telefone=document.getElementById("telefone_user").value;
	if(telefone=="") {
		alert("Insira seu telefone.");
		return;
	}
	let endereco=document.getElementById("endereco_user").value;
	if(endereco=="") {
		alert("Insira seu endereço.");
		return;
	}
	let cidade=document.getElementById("cidade_user").value;
	if(cidade=="") {
		alert("Insira sua cidade.");
		return;
	}
	let estado=document.getElementById("estado_user").value;
	if(estado=="") {
		alert("Selecione um estado.");
		return;
	}
	
	let solicitacao="http://localhost:8080/cadastro_user?"+
		"nome="+nome+
		"&email="+email+
		"&senha="+senha+
		"&telefone="+telefone+
		"&endereco="+endereco+
		"&cidade="+cidade+
		"&estado="+estado+
		"&tipo=user";

	let xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
		}
	}
	
	document.getElementById("cadastrar_cli").reset();
}