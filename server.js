let express=require('express');
let app=express();
let fs=require('fs');
let nano=require('nano')('http://localhost:5984');

//o erro 412 é ignorado na maioria das funções porque ele indica que o banco já existe
//se já existir, é só utilizar

popular_produtos();

function popular_produtos() {
	//se o banco de produtos ainda não existe, ele é criado, apenas para teste
	//os produtos são armazenados no arquivo produtos.json
	nano.db.create('prods_db', (err, body)=> {
		if(err) {
			//erro 412 indica que o banco já existe, então ele é ignorado
			if(err.statusCode!=412) {
				if(err.code=='ECONNREFUSED') {
					console.log('\nERRO: INICIE O COUCHDB');
					process.exit();
				}
				console.log(err);
			}
			return;
		}
			
		fs.readFile('json/produtos.json', (err, data)=> {
			if(err) {
				console.log(err);
			}
			else {
				if(data=='') {
					data='[]';//se o arquivo estiver vazio, adiciona os brackets
				}
				let array=JSON.parse(data);//faz o parse do que tem no arquivo
				let users_db=nano.db.use('prods_db');
				for(let i=0;i<array.length;i++) {
					//percorre todos os produtos, cria um objeto com eles e adiciona no banco
					let obj= {
						url: array[i].url,
						nome: array[i].nome,
						quantidade: array[i].quantidade,
						vendidos: array[i].vendidos,
						descricao: array[i].descricao,
						preco: array[i].preco
					};

					users_db.insert(obj, (err, body)=> {
						if(!err){
							//console.log(body);
						}
						else {
							console.log(err);
						}
					});
				}			
			}
		});
	});
}

function retrieve_data(data, datatype, db, callback) {
	//função que retorna procura dados no banco e retorna um onjeto com o resultado
	requested_db=nano.db.use(db);
	requested_db.list('', (err, body)=> { //requisita todos os arquivos do banco
		if(!err) {			
			let dados=JSON.stringify(body.rows);
			dados=JSON.parse(dados);
			
			let dados_size=dados.length;
			let dados_tested=0;
			let ret_value=null;
			
			for(let i=0;i<dados_size;i++) {
				//percorre todos os documentos do banco
				requested_db.get(dados[i]['id'], (err, body)=> { 
					if(!err) {
						if(body[datatype]==data) {
							//quando encontrar o arquivo que bate com o desejado, é retornado
							ret_value=body;
						}
						dados_tested++;
						if(dados_tested==dados_size) {
							callback(ret_value);
						}
					}
					else {
						console.log(err);
					}
				});
			}
			
			if(dados_tested==dados_size) {
				//apenas se não encontra o arquivo
				callback(ret_value);
			}
		}
		else {
			console.log(err);
		}
	});
}

app.get('/cadastro_serv', (req, res)=> {
	//cadastro de serviços
	let nome=req.query.nome;
	let id=req.query.i_d;
	let foto=req.query.foto;
	let descricao=req.query.descricao;
	let preco=req.query.preco;

	nano.db.create('servs_db', (err, body)=> {
		//se não existe, cria
		if(err && err.statusCode!=412) {
			console.log(err);
			return;
		}

		let servs_db=nano.db.use('servs_db');

		let obj= {
			nome: nome,
			id: id,
			foto: foto,
			descricao: descricao,
			preco: +preco
		};

		servs_db.insert(obj, (err, body)=> {
			//insere o objeto passado no banco
			if(!err){
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end("Cadastro de "+nome+" realizado com sucesso");
			}
			else {				
				console.log(err);
			}
		});
	});
});


app.get('/cadastro_prod', (req, res)=> {
	//cadastro de proutos
	let url=req.query.url;
	let nome=req.query.nome;
	let descricao=req.query.descricao;
	let preco=req.query.preco;
	let quantidade=req.query.quantidade;
	let vendidos=req.query.vendidos;

	nano.db.create('prods_db', (err, body)=> {
		//banco é criado, se não existe
		if(err && err.statusCode!=412) {
			console.log(err);
			return;
		}

		let prods_db=nano.db.use('prods_db');

		let obj= {
			url: url,
			nome: nome,
			descricao: descricao,
			preco: +preco,
			quantidade: +quantidade,
			vendidos: +vendidos
		};

		//insere o objeto desejado no banco
		prods_db.insert(obj, (err, body)=> {
			if(!err){
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end("Cadastro de "+nome+" realizado com sucesso");
			}
			else {				
				console.log(err);
			}
		});
	});
});

app.get('/list_animais', (req, res)=> {
	//faz a listagem de todos os animais com o email do usuário
	let email=req.query.email;
	
	if(email=='') {
		console.log('list_animais: faltando email, está logado?');
		return;
	}

	retrieve_data(email, 'email',  'users_db', (data)=> {//busca o id do usuário com o email desejado
		nano.db.create('animais_db', (err, body)=> {
			//banco é criado, se não existir
			if(err && err.statusCode!=412) {
				console.log(err);
				return;
			}	
			animais_db=nano.db.use('animais_db');
			animais_db.list('', (err, body)=> { //lista todos os itens do banco de animais
				if(!err) {			
					let dados=JSON.stringify(body.rows);
					dados=JSON.parse(dados);
					
					let dados_size=dados.length;
					let dados_tested=0;
					let ret_value=null;
					let array=JSON.parse('[]');
					
					for(let i=0;i<dados_size;i++) {
						animais_db.get(dados[i]['id'], (err, body)=> { //busca todos os dados de cada item
							if(!err) {
								dados_tested++;
								if(body.dono==data._id) {
									array.push(body);//se o id do dono bate com o do usuário, é utilizado
								}
								if(dados_tested==dados_size) {
									ret_value=JSON.stringify(array);
									res.writeHead(200, {'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'});
									res.end(ret_value);
								}
							}
							else {
								console.log(err);
							}
						});
					}
					
					if(dados_tested==dados_size) {//apenas se não há animais
						ret_value=JSON.stringify(array);
						res.writeHead(200, {'Content-Type': 'text/plain',
							'Access-Control-Allow-Origin': '*'});
						res.end(ret_value);
					}
				}
				else {
					console.log(err);
				}
			});		
		});
	});	
});

app.get('/cadastro_animal', (req, res)=> {	
	//faz o cadastro de animais
	let nome=req.query.nome;
	let email=req.query.email;
	let raca=req.query.raca;
	let idade=req.query.idade;
	let url=req.query.url;
	
	if(email=='') {
		console.log('altera_user: faltando email, está logado?');
		return;
	}

	retrieve_data(email, 'email',  'users_db', (data)=> {//busca o id do usuário logado
		nano.db.create('animais_db', (err, body)=> {
			if(err && err.statusCode!=412) {
				console.log(err);
				return;
			}
			
			let animais_db=nano.db.use('animais_db');
			
			let obj= {
				nome: nome,
				raca: raca,
				idade: idade,
				url: url,
				dono: data._id//id do dono é salvo no animal
			};

			animais_db.insert(obj, (err, body)=> {//insere no banco
				if(!err){
					res.writeHead(200, {'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin': '*'});
					res.end("Cadastro de "+nome+" realizado com sucesso");
				}
				else {				
					console.log(err);
				}
			});
		});
	});
});


app.get('/cadastro_user', (req, res)=> {
	//faz o cadastro do usuário
	let nome=req.query.nome;
	let email=req.query.email;
	let senha=req.query.senha;
	let telefone=req.query.telefone;
	let endereco=req.query.endereco;
	let cidade=req.query.cidade;
	let estado=req.query.estado;
	let tipo=req.query.tipo;

	nano.db.create('users_db', (err, body)=> {//banco é criado, se não existir
		if(err && err.statusCode!=412) {
			console.log(err);
			return;
		}
		
		let users_db=nano.db.use('users_db');
		
		let obj= {
			nome: nome,
			email: email,
			senha: senha,
			telefone: telefone,
			endereco: endereco,
			cidade: cidade,
			estado: estado,
			tipo: tipo
		};

		users_db.insert(obj, (err, body)=> {//dado é inserido
			if(!err){
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end("Cadastro de "+nome+" realizado com sucesso");
			}
			else {				
				console.log(err);
			}
		});
	});
});

app.get('/login_user', (req, res)=> {//faz o login do usuário
	let email=req.query.email;
	let senha=req.query.senha;
	
	nano.db.create('users_db', (err, body)=> {
		if(err && err.statusCode!=412) {
			console.log(err);
			return;
		}
		
		retrieve_data(email, 'email',  'users_db', (data)=> {//busca os dados com base no email
			res.writeHead(200, {'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*'});
			
			if(data) {
				if(data.senha==senha) {
					//o tipo de dado é verificado e a mensagem correta é passada
					if(data.tipo=='user') {
						res.end("ok_user");
					}
					else {
						res.end('ok_admin');
					}
				}
				else {
					res.end("err_senha");
				}
			}
			else {
				res.end("err_email");
			}					
		});
	});
});

app.get('/altera_user', (req, res)=> {//altera os dados do usuário
	let nome=req.query.nome;
	let email=req.query.email;
	let telefone=req.query.telefone;
	let endereco=req.query.endereco;
	let cidade=req.query.cidade;
	let estado=req.query.estado;
	if(email=='') {
		console.log('altera_user: faltando email, está logado?');
		return;
	}
	retrieve_data(email, 'email', 'users_db',(data)=> {//busca os dados do usuário com base no email
		//apenas os dados preenchidos são alterados
		if(nome=='') {
			nome=data.nome;
		}
		if(telefone=='') {
			telefone=data.telefone;
		}
		if(endereco=='') {
			endereco=data.endereco;
		}
		if(cidade=='') {
			cidade=data.cidade;
		}
		if(estado=='') {
			estado=data.estado;
		}
		
		obj= {
			_id: data._id,
			_rev: data._rev,
			nome: nome,
			email: data.email,
			senha: data.senha,
			telefone: telefone,
			endereco: endereco,
			cidade: cidade,
			estado: estado,
			tipo: data.tipo
		};
		users_db=nano.use('users_db');
		users_db.insert(obj, (err, body)=> {
			//insere novos dados no banco
			//como a revisão foi copiada, o dado é substituído
			if(!err){
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end("Cadastro alterado com sucesso");
			}
			else {
				console.log(err);
			}
		});
	});
});



app.get('/altera_prod', (req, res)=> {
	//faz a edição dos dados de produtos
	let id=req.query.id;
	let nome=req.query.nome;
	let descricao=req.query.descricao;
	let preco=req.query.preco;
	let quantidade=req.query.quantidade;
	let vendidos=req.query.vendidos;
	let url=req.query.url;
	
	retrieve_data(id, '_id', 'prods_db',(data)=> {//busca os dados do produto com base no id
		//altera apenas os dados entrados pelo usuário
		if(nome=='') {
			nome=data.nome;
		}
		if(descricao=='') {
			descricao=data.descricao;
		}
		if(preco=='') {
			preco=data.preco;
		}
		if(quantidade) {
			quantidade=data.quantidade;
		}
		if(vendidos=='') {
			vendidos=data.vendidos;
		}
		if(url=='') {
			url=data.url;
		}
		
		obj= {
			_id: data._id,
			_rev: data._rev,
			url: url,
			nome: nome,
			quantidade: +quantidade,
			vendidos: +vendidos,
			descricao: descricao,
			preco: +preco
		};
		prods_db=nano.use('prods_db');
		prods_db.insert(obj, (err, body)=> {
			//como a revisão foi copiada, o dado inserido substitui o antigo
			if(!err){
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end("Cadastro alterado com sucesso");
			}
			else {
				console.log(err);
			}
		});
	});
});

app.get('/pagamento', (req, res)=> {
	//processa o pagamento
	//ignora os dados de pagamento (assume-se que o pagamento sempre é aprovado)
	//apenas altera a quantidade e o número de produtos vendidos
	prods=JSON.parse(req.query.prods);
	prods_db=nano.use('prods_db');
	for(let i=0;i<prods.length;i++) {
		prods_db.get(prods[i]['id'], (err, body)=> {
			if(!err) {
				obj= {
					_id: body._id,
					_rev: body._rev,
					url: body.url,
					nome: body.nome,
					//modifica o número de vendidos e a quantidade
					quantidade: body.quantidade-(+prods[i]['quantidade']),
					vendidos: body.vendidos+(+prods[i]['quantidade'])
				};

				prods_db.insert(obj, (err, body)=> {
					//como a revisão foi copiada, a inserção substitui os dados
					if(!err){
						//console.log(body);
					}
					else {
						console.log(err);
					}
				});
			}
			else {
				console.log(err);
			}
		});
	}
	res.writeHead(200, {'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin': '*'});
	res.end("Pagamento realizado com sucesso");
});

app.get('/apaga_prod', (req, res)=> {
	//apaga um produto
	id=req.query.id;
	prods_db=nano.db.use('prods_db');
	prods_db.get(id, (err, body)=> { //apenas para poder pegar a revisão
		if(!err) {
			prods_db.destroy(id, body._rev, (err, body)=> {//passa a revisão
				if(!err) {
					res.writeHead(200, {'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin': '*'});
					res.end("Produto apagado com sucesso");
				}
				else {
					console.log(err);
				}
			});
		}
		else {
			console.log(err);
		}
	});
});

app.get('/list_prod', (req, res)=> {
	//faz a listagem de todos os produtos
	prods_db=nano.db.use('prods_db');
	prods_db.list('', (err, body)=> { 
		if(!err) {			
			let dados=JSON.stringify(body.rows);
			dados=JSON.parse(dados);
			
			let dados_size=dados.length;
			let dados_tested=0;
			let ret_value=null;
			let array=JSON.parse('[]');
			
			for(let i=0;i<dados_size;i++) {
				//percorre todos os ids no banco de produto
				prods_db.get(dados[i]['id'], (err, body)=> { 
					if(!err) {
						dados_tested++;
						array.push(body);
						//adiciona cada dado ao objeto de retorno
						if(dados_tested==dados_size) {
							//quando todos os dados são percorridos, o vetor é retornado
							//isso é feito dessa maneira para lidar com o caráter assíncrono das funções
							ret_value=JSON.stringify(array);
							res.writeHead(200, {'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'});
							res.end(ret_value);
						}
					}
					else {
						console.log(err);
					}
				});
			}
			
			if(dados_tested==dados_size) {
				//apenas se não há produtos
				ret_value=JSON.stringify(array);
				res.writeHead(200, {'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});
				res.end(ret_value);
			}
		}
		else {
			console.log(err);
		}
	});
	
});

app.use((req, res, next)=> {
	//garante que pode ser acessado de qualquer fonte
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(express.static( __dirname));//retorna qualquer arquivo pedido

let server=app.listen(8080, ()=> {
	//ouve no localhost na porta 8080
   let host=server.address().address;
   let port=server.address().port;
   console.log("App listening at http://%s:%s", host, port);
});





















