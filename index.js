function cadastrar() {
	//faz o cadastro de novos usuários
	let nome=document.getElementById("nome").value;
	if(nome=="") {
		alert("Insira seu nome.");
		return;
	}
	let email=document.getElementById("email").value;
	if(email=="") {
		alert("Insira seu email.");
		return;
	}
	let senha=document.getElementById("senha").value;
	if(senha=="") {
		alert("Insira uma senha.");
		return;
	}
	let senha_confirme=document.getElementById("senha_confirme").value;
	if(senha_confirme!=senha) {
		alert("As senhas não conferem.");
		return;
	}
	let telefone=document.getElementById("telefone").value;
	if(telefone=="") {
		alert("Insira seu telefone.");
		return;
	}
	let endereco=document.getElementById("endereco").value;
	if(endereco=="") {
		alert("Insira seu endereço.");
		return;
	}
	let cidade=document.getElementById("cidade").value;
	if(cidade=="") {
		alert("Insira sua cidade.");
		return;
	}
	let estado=document.getElementById("estado").value;
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

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
		}
	}
	
	document.getElementById("form_cadastra").reset();
}

function login() {
	let email=document.getElementById("cadastrado_email").value;
	if(email=="") {
		alert("Insira seu email.");
		return;
	}
	let senha=document.getElementById("cadastrado_senha").value;
	if(senha=="") {
		alert("Insira uma senha.");
		return;
	}
	
	if(email=="admin" && senha=="admin") {
		//se o user e a senha forem admin, quer dizer que é o administrador padrão
		localStorage.setItem("atualLogado", "admin");
		window.location.href="/Admin/admin-cadastrar.html";
		return;
	}	
	
	let solicitacao="http://localhost:8080/login_user?"+
		"&email="+email+
		"&senha="+senha;

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			switch(string) {
				case 'err_email':
					alert("Email incorreto. Possui cadastro?");
					break;
				case 'err_senha':
					alert("Senha incorreta.");
					break;
				case 'ok_user':
					if(typeof(Storage)!=="undefined") {
						localStorage.setItem("atualLogado", email);
					}
					else {
						alert("Seu navegador não suporte Local Storage");
						break;
					}
					window.location.href="/User/user.html";
					break;
				case 'ok_admin':
					if(typeof(Storage)!=="undefined") {
						localStorage.setItem("atualLogado", email);
					}
					else {
						alert("Seu navegador não suporte Local Storage");
						break;
					}
					window.location.href="/Admin/admin-cadastrar.html";
					break;
			}
		}
	};
}