//parte do IndexedDB foi baseada no tutorial da MDN,
//disponível em https://developer.mozilla.org/pt-BR/docs/IndexedDB/Usando_IndexedDB
//parte do IndexedDB foi baseada nesse exemplo:
//https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b
//parte do IndexedDB foi baseada nos slides de aula
//a parte de cursores foi baseada em:
//https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor

exibir_animais();

function popular_animais() {		
	//dados de animais para teste da funcionalidade
	let dados_animais=`[
		{"url":"Animais/fifi.jpg", "nome":"Fifi", "id":1, "raca":"Poodle", "idade":3},
		{"url":"Animais/rex.jpg", "nome":"Rex", "id":2, "raca":"Pit Bull", "idade":2},
		{"url":"Animais/pantera.jpg", "nome":"Pantera", "id":3, "raca":"Bengal", "idade":1},
		{"url":"Animais/lorde.jpg", "nome":"Lorde", "id":4, "raca":"Persa", "idade":6},
		{"url":"Animais/cenoura.jpg", "nome":"Cenoura", "id":5, "raca":"Coelho", "idade":3},
		{"url":"Animais/faisca.jpg", "nome":"Faísca", "id":6, "raca":"Calopsita", "idade":2},
		{"url":"Animais/haroldo.jpg", "nome":"Haroldo", "id":7, "raca":"Furão", "idade":8}
	]`;

	if(!window.indexedDB) {//tesra o indexedDB
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco de animais
	let request=indexedDB.open("animaisDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> {
		//caso não exista o banco, ele é criado
		let db=request.result;
		let store=db.createObjectStore("animais", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("animais", "readwrite");
		let store=tx.objectStore("animais");
		
		//salva os dados de teste de animais em um vetor
		let animais=JSON.parse(dados_animais);

		//acessa as posições do vetor e salva todos os animais no banco
		for(let i=0;i<animais.length;i++){
			let obj=animais[i];
			let teste=store.put({url: obj.url, nome: obj.nome, raca: obj.raca, idade: obj.idade});
		}

		tx.oncomplete=()=> {
			db.close();
		};
	};
	exibir_animais();
}

function exibir_animais() {	//função que lista todos os aniamis, inserindo no DOM

	//flag indica se há ao menos um animal
	let flag=0;

	if(!window.indexedDB) {
		//testa o indexedDB
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}

	let db;
	//tenta abrir o banco aniamisDB
	let request=indexedDB.open("animaisDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//caso o banco não exista, ele é criado
		let db=request.result;
		let store=db.createObjectStore("animais", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("animais", "readwrite");
		let store=tx.objectStore("animais");
		
		store.openCursor().onsuccess=(event)=> {
			//abre um cursor com todos os animais no banco
			let cursor=event.target.result;
			
			if(cursor) {
				//percorre o cursor e adiciona cada animal no DOM
				
				if(!flag) {
					//se ainda não houver animais, o botão é apagado
					flag=1;
					document.getElementById("animais").innerHTML='';
				}
							
				document.getElementById("animais").innerHTML+='\
					<div class="animal">\
						<img src="'+cursor.value.url+'" alt="'+cursor.value.nome+'" style="width:160px;height:160px">\
					</div>\
					<div class="quantidade">\
						<p>Nome:</p>\
						<p>'+cursor.value.nome+'</p>\
					</div>\
					<div class="quantidade">\
						<p>ID:</p>\
						<p>'+cursor.value.id+'</p>\
					</div>\
					<div class="quantidade">\
						<p>Raça:</p>\
						<p>'+cursor.value.raca+'</p>\
					</div>\
					<div class="quantidade">\
						<p>Idade:</p>\
						<p>'+cursor.value.idade+' anos</p>\
					</div>\
					<br>';
				
				cursor.continue();
			}
		};
	};
}

function adicionar_animal() {	
	//permite a adição de animais
	if(!window.indexedDB) {
		console.log("Seu navegador não suporta indexedDB.");
		return;
	}
	
	//como não é possível trabalhar com os arquivos, usa-se uma imagem falsa
	//sempre que um animal é adicionado, sua foto é uma imagem de erro
	let url="Animais/error.jpg";
	let nome=document.getElementById("nome_animal").value;
	let raca=document.getElementById("raca_animal").value;
	let idade=document.getElementById("idade_animal").value;
	
	if(nome=="" || raca=="" || idade=="") {
		alert("Insira todos os dados do animal");
		return;
	}

	let db;
	//tenta abrir o banco animaisDB
	let request=indexedDB.open("animaisDB", 2);

	request.onerror=(event)=> {
		alert("Erro ao utilizar IndexedDB.");
	};

	request.onupgradeneeded=(event)=> { 
		//se o banco não existir, é criado
		let db=request.result;
		let store=db.createObjectStore("animais", {keyPath: "id", autoIncrement: true});
	};

	request.onsuccess=(event)=> {
		let db=request.result;
		let tx=db.transaction("animais", "readwrite");
		let store=tx.objectStore("animais");
		
		//adiciona o animal no banco
		let teste=store.put({url: url, nome: nome, raca: raca, idade: idade});
		

		tx.oncomplete=()=> {
			db.close();
		};
	};
	//refaz a lista de animais
	exibir_animais();
}

