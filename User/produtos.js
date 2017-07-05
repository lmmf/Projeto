exibir_produtos();

function exibir_produtos() {	
	//inclui todos os produtos no DOM

	//primeiro limpa todos os produtos, para evitar repetição
	document.getElementById("produtos").innerHTML='';
	
	let solicitacao="http://localhost:8080/list_prod";

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", solicitacao, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange=()=> {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			let string=xmlhttp.responseText;
			obj=JSON.parse(string);
			
			//adiciona todos os produtos no DOM
			for(let i=0;i<obj.length;i++) {
				if(obj[i].quantidade>0) {
					document.getElementById("produtos").innerHTML+='\
								<div class="produto">\
									<img onclick="alert(\''+obj[i].descricao+'\')" src="'+obj[i].url+'" alt="'+obj[i].nome+'" style="width:160px;height:160px">\
									<p>'+obj[i].nome+'</p>\
									<p>R$'+(+obj[i].preco).toFixed(2).toString().replace('.', ',')+' cada</p>\
									<p>Quantidade disponível: '+obj[i].quantidade+'</p>\
									<button type="button" onclick="adicionar(\''+obj[i]._id+'\',\''
									+obj[i].url+'\',\''+obj[i].nome+'\','+obj[i].quantidade+','+obj[i].preco+')">Adicionar ao carrinho</button>\
								</div>';	
				}
			}
			
		}
	}
}