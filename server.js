//servidor baseado na reposta do usuário Psyche Genius em:
//https://stackoverflow.com/questions/17478566/using-node-js-to-serve-up-basic-web-page-with-css-and-js-includes

let http=require('http');
let fs=require('fs');
let path=require('path');

http.createServer((req, res)=> {
	let filePath=req.url;
	if(filePath=='/') {
		filePath='/index.html';
	}

	filePath=__dirname+filePath;
	let extname=path.extname(filePath);
	let contentType;
	switch(extname) {
		case '.html':
			contentType='text/html';
			break;
		case '.js':
			contentType='text/javascript';
			break;
		case '.css':
			contentType='text/css';
			break;
		case '.jpg':
			contentType='image/jpeg';
			break;
		case '.json':
			contentType='application/json';
			break;
		default:
			console.log(extname+' requested');
			contentType='text/html';
			break;
	}

	fs.exists(filePath, (exists)=> {
		if(exists) {
			fs.readFile(filePath, (error, content)=> {
				if(error) {
					res.writeHead(500);
					res.end();
				}
				else {
					res.writeHead(200, {'Content-Type': contentType});
					res.end(content, 'utf-8');                  
				}
			});
		}
		else {
			console.log(filePath+' not found');
		}
	});
}).listen(8080);