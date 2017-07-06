let express=require('express');
let app=express();
let fs=require('fs');
let nano=require('nano')('http://localhost:5984');

popular_produtos();

function popular_produtos() {
	nano.db.create('prods_db', (err, body)=> {
		if(err) {
			if(err.statusCode!=412) {
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
	requested_db=nano.db.use(db);
	requested_db.list('', (err, body)=> { 
		if(!err) {			
			let dados=JSON.stringify(body.rows);
			dados=JSON.parse(dados);
			
			let dados_size=dados.length;
			let dados_tested=0;
			let ret_value=null;
			
			for(let i=0;i<dados_size;i++) {
				requested_db.get(dados[i]['id'], (err, body)=> { 
					if(!err) {
						if(body[datatype]==data) {
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
				callback(ret_value);
			}
		}
		else {
			console.log(err);
		}
	});
}

/*nano.db.create('users_db', (err, body)=> {
	users_db=nano.db.use('users_db');
	users_db.list('', (err, body)=> { 
		if(!err) {
			let dados=JSON.stringify(body.rows);
			dados=JSON.parse(dados);
			
			for(let i=0;i<dados.length;i++) {
				users_db.get(dados[i]['id'], (err, body)=> { 
					if(!err) {
						console.log(body.nome);
					}
					else {
						console.log(err);
					}
				});
			}
		}
		else {
			console.log(err);
		}
	});
	if(err.statusCode!=412) {
		console.log(err);
	}
});*/

/*
nano.db.create('users_db', (err, body)=> {
	fs.readFile('json/animais.json', (err, data)=> {
		if(err) {
			console.log(err);
		}
		else {
			if(data=='') {
				data='[]';//se o arquivo estiver vazio, adiciona os brackets
			}
			console.log(data);
			let array=JSON.parse(data);//faz o parse do que tem no arquivo
			console.log(array.length);
			let users_db=nano.db.use('users_db');
			for(let i=0;i<array.length;i++) {
				console.log(array[i].url);
				let obj= {
					url: array[i].url,
					nome: array[i].nome,
					raca: array[i].raca,
					idade: array[i].idade,
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
	if(err.statusCode!=412) {
		console.log(err);
	}
});*/

app.get('/cadastro_serv', (req, res)=> {
	let nome=req.query.nome;
	let id=req.query.i_d;
	let foto=req.query.foto;
	let descricao=req.query.descricao;
	let preco=req.query.preco;

	nano.db.create('servs_db', (err, body)=> {
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
	let url=req.query.url;
	let nome=req.query.nome;
	let descricao=req.query.descricao;
	let preco=req.query.preco;
	let quantidade=req.query.quantidade;
	let vendidos=req.query.vendidos;

	nano.db.create('prods_db', (err, body)=> {
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
	let email=req.query.email;
	
	if(email=='') {
		console.log('list_animais: faltando email, está logado?');
		return;
	}

	retrieve_data(email, 'email',  'users_db', (data)=> {	
		nano.db.create('animais_db', (err, body)=> {
			if(err && err.statusCode!=412) {
				console.log(err);
				return;
			}	
			animais_db=nano.db.use('animais_db');
			animais_db.list('', (err, body)=> { 
				if(!err) {			
					let dados=JSON.stringify(body.rows);
					dados=JSON.parse(dados);
					
					let dados_size=dados.length;
					let dados_tested=0;
					let ret_value=null;
					let array=JSON.parse('[]');
					
					for(let i=0;i<dados_size;i++) {
						animais_db.get(dados[i]['id'], (err, body)=> { 
							if(!err) {
								dados_tested++;
								if(body.dono=data._id) {
									array.push(body);
									if(dados_tested==dados_size) {
										ret_value=JSON.stringify(array);
										res.writeHead(200, {'Content-Type': 'text/plain',
											'Access-Control-Allow-Origin': '*'});
										res.end(ret_value);
									}
								}
							}
							else {
								console.log(err);
							}
						});
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
		});
	});	
});

app.get('/cadastro_animal', (req, res)=> {	
	let nome=req.query.nome;
	let email=req.query.email;
	let raca=req.query.raca;
	let idade=req.query.idade;
	let url=req.query.url;
	
	if(email=='') {
		console.log('altera_user: faltando email, está logado?');
		return;
	}

	retrieve_data(email, 'email',  'users_db', (data)=> {
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
				dono: data._id
			};

			animais_db.insert(obj, (err, body)=> {
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
	let nome=req.query.nome;
	let email=req.query.email;
	let senha=req.query.senha;
	let telefone=req.query.telefone;
	let endereco=req.query.endereco;
	let cidade=req.query.cidade;
	let estado=req.query.estado;
	let tipo=req.query.tipo;

	nano.db.create('users_db', (err, body)=> {
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

		users_db.insert(obj, (err, body)=> {
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

app.get('/login_user', (req, res)=> {
	let email=req.query.email;
	let senha=req.query.senha;
	
	nano.db.create('users_db', (err, body)=> {
		if(err && err.statusCode!=412) {
			console.log(err);
			return;
		}
		
		retrieve_data(email, 'email',  'users_db', (data)=> {
			res.writeHead(200, {'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*'});
			
			if(data) {
				if(data.senha==senha) {
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

app.get('/altera_user', (req, res)=> {
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
	retrieve_data(email, 'email', 'users_db',(data)=> {
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
					quantidade: body.quantidade-(+prods[i]['quantidade']),
					vendidos: body.vendidos+(+prods[i]['quantidade'])
				};

				prods_db.insert(obj, (err, body)=> {
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

app.get('/list_prod', (req, res)=> {
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
				prods_db.get(dados[i]['id'], (err, body)=> { 
					if(!err) {
						dados_tested++;
						array.push(body);
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
	
});

app.use((req, res, next)=> {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(express.static( __dirname));

let server=app.listen(8080, ()=> {
   let host=server.address().address;
   let port=server.address().port;
   console.log("App listening at http://%s:%s", host, port);
});





















