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
						
	let nome=document.getElementById("nome").value;
	let email=document.getElementById("email").value;
	let telefone=document.getElementById("telefone").value;
	let endereco=document.getElementById("endereco").value;
	let cidade=document.getElementById("cidade").value;
	let estado=document.getElementById("estado").value;
	
	if(nome=="" && (email==""  || email == logado) && telefone=="" && endereco=="" && cidade=="" && estado=="") 
	{
		alert("Pelo menos um dos campos devem ser preechidos");
		return;
	}	
	
	let solicitacao="http://localhost:8080/altera_user?"+
		"nome="+nome+
		"&email="+email+
		"&telefone="+telefone+
		"&endereco="+endereco+
		"&cidade="+cidade+
		"&estado="+estado;
		
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			alert(string);
			document.getElementById("form_editar").reset();
			document.getElementById("email").value = logado;
		}
	};	
}

function logout() {
	if (typeof(Storage) !== "undefined") 
			localStorage.removeItem("atualLogado");	//deleta o token da pessoa logada
	window.location.href="../index.html";
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
