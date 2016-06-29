class Request {

	constructor(url){
		let p = new Promise((resolve, reject) => {
			let ajax = new XMLHttpRequest();

			ajax.open("GET", url);
			ajax.send();

			ajax.onload = function(){
				if(this.status >= 200 && this.status < 300){
					resolve(this);
				} else {
					reject(this);
				}
			}

			ajax.onerror = function(){
				reject(this);
			}
		});

		return p;
	}

}