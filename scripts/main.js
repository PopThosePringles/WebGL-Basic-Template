// Do drawing in the "draw" method.
// vert and frag shader will need a little work to show something though :)

class WebGL_Template {

	static init(){
		this.canvas = document.querySelector("#canvas");
		this.gl = null;
		this.vertex_shader_src = null;
		this.fragment_shader_src = null;
		this.program = null;

		try {
			this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
		} catch(e){
			console.warn("No WebGL");
		}

		if(this.gl){
			this.load_shader_sources().then(() =>{
				this.init_shaders();
				this.clear();
				this.draw();
			}).catch(() => console.warn("Can't load shader files"));	
		}
	}

	static load_shader_sources(){
		return new Promise((resolve, reject) => {
			new Request("shaders/basic.vert").then((response) => {
				this.vertex_shader_src = response.responseText;

				new Request("shaders/basic.frag").then(response => {
					this.fragment_shader_src = response.responseText;
					resolve();
				}).catch(reject);
			}).catch(reject);
		});
	}
	
	static init_shaders(){
		let program = this.create_program(this.vertex_shader_src, this.fragment_shader_src);

		this.program = program;
		this.gl.useProgram(program);
	}

	static create_program(V_SHADER = "", F_SHADER = ""){
		let vertex_shader = this.load_shader(V_SHADER, this.gl.VERTEX_SHADER);
		let fragment_shader = this.load_shader(F_SHADER, this.gl.FRAGMENT_SHADER);

		if(!vertex_shader || !fragment_shader){
			console.warn("Can't load shaders");

			return null;
		}

		let program = this.gl.createProgram();

		if(!program){
			console.warn("Can't create program");
		}

		this.gl.attachShader(program, vertex_shader);
		this.gl.attachShader(program, fragment_shader);
		this.gl.linkProgram(program);

		let linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

		if(!linked){
			console.warn("Can't link program: " + linked.getProgramInfoLog());

			this.gl.deleteProgram(program);
			this.gl.deleteShader(vertex_shader);
			this.gl.deleteShader(fragment_shader);

			return null;
		}

		return program;
	}

	static load_shader(shader_src = "", shader_type){
		let shader = this.gl.createShader(shader_type);

		if(shader){
			this.gl.shaderSource(shader, shader_src);
			this.gl.compileShader(shader);

			let compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

			if(!compiled){
				console.warn("Can't compile shader: " + this.gl.getShaderInfoLog(shader));
				this.gl.deleteShader(shader);
			}
		} else {
			console.warn("Can't create vertex shader");
		}

		return shader;
	}

	static clear(){
		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	static draw(){

		// Do your drawing here...

	}

}