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
	
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	// abre banco de dados (ou cria, caso não exista)
	let request=indexedDB.open("usersDB",2);

	//se IndexedDB der erro
	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	// cria o schema do banco
	request.onupgradeneeded=(event)=> { 
		let db=request.result;			
		let store=db.createObjectStore("users", {keyPath: "email"});	//email sera a chave primaria da tupla users
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("users", "readwrite");	//recupera tupla users
		let store=tx.objectStore("users");

		store.add({nome: nome, email: email, senha: senha,
			 tipo: "admin"});

		//fecha banco de dados
		tx.oncomplete=()=> {
			db.close();
		};
	};
	
	alert("Cadastro de "+nome+" realizado com sucesso.");
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
	
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	// abre banco de dados (ou cria, caso não exista)
	let request=indexedDB.open("usersDB",2);

	//se IndexedDB der erro
	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	// cria o schema do banco
	request.onupgradeneeded=(event)=> { 
		let db=request.result;			
		let store=db.createObjectStore("users", {keyPath: "email"});	//email sera a chave primaria da tupla users
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("users", "readwrite");	//recupera tupla users
		let store=tx.objectStore("users");

		store.add({nome: nome, email: email, senha: senha,
			telefone: telefone, endereco: endereco, cidade: cidade, estado: estado, tipo: "user"});

		//fecha banco de dados
		tx.oncomplete=()=> {
			db.close();
		};
	};
	
	alert("Cadastro de "+nome+" realizado com sucesso.");
}