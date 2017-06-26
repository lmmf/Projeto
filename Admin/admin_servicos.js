let indexedDB = window.indexedDB || 
				window.mozIndexedDB || 
				window.webkitIndexedDB || 
				window.msIndexedDB || 
				window.shimIndexedDB;

/*
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

function logout() {
	if (typeof(Storage) !== "undefined") 
			localStorage.removeItem("atualLogado");	//deleta o token da pessoa logada
	window.location.href="../Index/index.html";
	return;
}*/

//----------------------------------------------------------

function consultar_servico() {
	
	let data_servico = document.getElementById("data_servico").value;
	
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}
	
	let db;
	//tenta abrir a base de produtos
	let request=indexedDB.open("servicesDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se a base não existe, é criada
		let db=request.result;
		let store=db.createObjectStore("services", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("services", "readwrite");
		let store=tx.objectStore("services");
		
		store.openCursor().onsuccess=(event)=> {
			let cursor=event.target.result;
			//abre um cursor com todos os produtos
			if(cursor) {
				if(cursor.value.data_servico == data_servico) {
					//adiciona os produtos ao DOM
					let tr1 = document.createElement("tr");
					let td1 = document.createElement("td");
					let text1 = cursor.value.hora_servico;
					td1.appendChild(text1);
					tr1.appendChild(td1);
					let text2 = cursor.value.servico + " - " +cursor.value.animal_servico;
					let td2 = document.createElement("td");
					td2.appendChild(text2);
					tr1.appendChild(td2);
					let inputButton = createElement("button");
					let textFunc = "liberar("+cursor.value.id+")";
					inputButton.setAttribute("onclick", textFunc);
					inputButton.setAttribute("value", "Liberar Horário");
					inputButton.setAttribute("class", "button");
					let td3 = document.createElement("td");
					td3.appendChild(inputButton);
					tr1.appendChild(td3);
					
					document.getElementById("tabela_servicos").appendChild(tr1);			
				}
				cursor.continue();
			}
		};
	};
}

/*
document.getElementById("tabela_servicos").innerHTML+='\
<tr>\
<td>'+cursor.value.hora_servico+'</td>\
<td>'+cursor.value.servico+' - '+cursor.value.animal_servico+'</td>\
<td>\
<input type="button" class="button" id="liberar('+cursor.value.id+')" value="Liberar Horário">\
</td>\
</tr>';	
*/

function liberar(id) {

}
