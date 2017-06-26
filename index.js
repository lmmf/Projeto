let indexedDB = window.indexedDB || 
				window.mozIndexedDB || 
				window.webkitIndexedDB || 
				window.msIndexedDB || 
				window.shimIndexedDB;

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

	if(!window.indexedDB) {
		//verifica se o indexedDB está disponível
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
		window.location.href="../Admin/admin-cadastrar.html";
		return;
	}
	
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
	}

	// abre banco de dados (ou cria, caso não exista)
	let request=indexedDB.open("usersDB",2);

	//se IndexedDB der erro
	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		let db=request.result;
		let store=db.createObjectStore("users", {keyPath: "email"});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("users", "readwrite");
		let store=tx.objectStore("users");
		
		let senha_salva;		
		let getUser=store.get(email);
	
		getUser.onsuccess=()=> {
			try {senha_salva=getUser.result.senha;}
			
			catch(err) {
				alert("Email incorreto. Possui cadastro?");
				return;
			}
			
			//se a senha confere
			if(senha_salva==senha) {
				//guardaremos o "token" numa local storage
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("atualLogado", email);
				}
				else {
					alert("Seu navegador não suporte Local Storage");
					return;
				}
				//direciona para a página certa, dependendo do tipo de usuário
				if(getUser.result.tipo=="user") {
					window.location.href="../User/user.html";
				}
				else {
					window.location.href="../Admin/admin-cadastrar.html";
				}
			}
			//se a senha não confere
			else {
				alert("Senha incorreta.");
			}
		};	

		tx.oncomplete=()=> {
			db.close();
		};
	};
}