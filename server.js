let express=require('express');
let app=express();
let fs=require('fs');
let nano=require('nano')('http://localhost:5984');

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
				res.writeHead(200, {"Content-Type": "text/plain"});
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
			res.writeHead(200, {"Content-Type": "text/plain"});
			
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

app.use(express.static( __dirname));

let server=app.listen(8080, ()=> {
   let host=server.address().address;
   let port=server.address().port;
   console.log("App listening at http://%s:%s", host, port);
});