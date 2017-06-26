let indexedDB = window.indexedDB || 
				window.mozIndexedDB || 
				window.webkitIndexedDB || 
				window.msIndexedDB || 
				window.shimIndexedDB;
				
let logado = localStorage.getItem("atualLogado");

//usuario logado fica escrito na tela
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

let email = document.getElementById("email").value = logado; //deixa email ja preenchido


function alterarCadastro()
{
	//checa de o browser consegue trabalhar com indexeDB
	if(!indexedDB)
	{
		console.log("Seu navegador não suporta indexedDB.");
		return;		
	}

	//abre o pseudo banco (ou cria, caso não exista)
	let request=indexedDB.open("usersDB",2);

	//se IndexedDB der erro
	request.onerror = (event) => {alert("Erro ao utilizar IndexedDB.");};

	//cria o schema do banco
	request.onupgradeneeded = (event) => 
	{ 
		let db=request.result;
		let store=db.createObjectStore("users", {keyPath: "email"});
	};
	
	//realiza os operacoes no pseudobanco 
	request.onsuccess = (event) => 
	{
		let db=request.result;
		let tx=db.transaction("users", "readwrite");
		let store=tx.objectStore("users");	
		
		//se browser suporta storage
		if (typeof(Storage) !== "undefined") 
		{
			let atualiza = store.openCursor();					//abre cursor para atualizar
			atualiza.onsuccess = (event) => 
			{
				let cursor = event.target.result;
				if(cursor) {
					if(cursor.value.email == logado) 
					{
						let dados = cursor.value;				//recupera dados no banco
						//console.log(dados);
						
						let nome=document.getElementById("nome").value;
						let email=document.getElementById("email").value;
						let telefone=document.getElementById("telefone").value;
						let endereco=document.getElementById("endereco").value;
						let cidade=document.getElementById("cidade").value;
						let estado=document.getElementById("estado").value;
						
						//se alguma dos inputs estiverem vazios, nao alterar nada no banco
						if(nome!=="")
							dados.nome = nome;
						//if(email!=="") 
						//{
							//dados.email = email;
							//localStorage.setItem("atualLogado", email); //troca email logado tb
						//}
						
						if(telefone!=="")
							dados.telefone = telefone;
						if(endereco!=="")
							dados.endereco = endereco;
						if(cidade!=="")
							dados.cidade = cidade;
						if(estado!=="")
							dados.estado = estado;
						if(nome=="" && (email==""  || email == logado) && telefone=="" && endereco=="" && cidade=="" && estado=="") 
						{
							alert("Pelo menos um dos campos devem ser preechidos");
							return;
						}						
							
						//atualiza banco
						console.log("Novo nome: "+dados.nome);
						let atualizaBD = cursor.update(dados);
						atualizaBD.onsuccess = () => {alert("Os dados foram atualizados com sucesso" + dados.nome);};
						
						atualizaBD.onerror = () => {alert("Não foi possível atualizar o Banco de Dados");};						
					}
					//nao encontrou ninguem com o email logado, no banco
					else {alert("Não foi possível encontrar o usuário do email "+logado);}
				}
				//nao conseguiu reabrir o banco para o update
				else {alert("Não foi possível reabrir o banco;");}	
				cursor.continue();
			};			
		}
		else {alert("Seu navegador não suporte Local Storage");}

		//encerra banco
		tx.oncomplete = () => {db.close();}	
	};
}

function logout() {
	if (typeof(Storage) !== "undefined") 
			localStorage.removeItem("atualLogado");	//deleta o token da pessoa logada
	window.location.href="../Index/index.html";
	return;
}

function agendar() 
{
	let servico=document.getElementById("servico").value;
	if(servico=="") 
	{
		alert("Preencha o tipo de serviço");
		return;
	}
	let animal_servico=document.getElementById("animal_servico").value;
	if(animal_servico=="") 
	{
		alert("Preencha o animal.");
		return;
	}	
	let data_servico=document.getElementById("data_servico").value;
	if(data_servico=="") 
	{
		alert("Insira a data do serviço.");
		return;
	}
	let hora_servico=document.getElementById("hora_servico").value;
	if(hora_servico=="") 
	{
		alert("Insira a hora do serviço");
		return;
	}
	
	if(!window.indexedDB) 
	{
		//verifica se o indexedDB está disponível
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	// abre banco de dados (ou cria, caso não exista)
	let request=indexedDB.open("servicesDB",2);

	//se IndexedDB der erro
	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	// cria o schema do banco
	request.onupgradeneeded=(event)=> { 
		let db=request.result;			
		let store=db.createObjectStore("services", {keyPath: "id", autoIncrement: true});	//id sera a chave primaria da tupla users
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("services", "readwrite");	//recupera tupla services
		let store=tx.objectStore("services");

		store.put({servico: servico, animal_servico: animal_servico, data_servico: data_servico, hora_servico: hora_servico});

		//fecha banco de dados
		tx.oncomplete=()=> {
			db.close();
		};
	};
	
	alert("Cadastro do serviço realizado com sucesso.");
	document.getElementById("form_services").reset();
	
	
}

//---------------------------------------------------------------------------------
//povoa o calendario	
let eventos=JSON.parse(dados_eventos);

$(document).ready(function() 
{
	$('#calendar').fullCalendar(
	{
		header: 
		{
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listMonth'
		},
		
		eventStartEditable: false,
		theme: true,
		defaultDate: '2017-05-12',
		locale: 'pt-br',
		buttonIcons: false, // show the prev/next text
		weekNumbers: true,
		navLinks: true, // can click day/week names to navigate views
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		events: eventos
	});
});
