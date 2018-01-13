class WebGL {

	constructor(vert, frag){
		this.canvas = document.querySelector("#canvas");
		this.gl = null;
		this.vertex_shader_src = null;
		this.fragment_shader_src = null;
		this.program = null;
		this.buffer = null;

		if(!vert && !frag){
			console.error("No vertex or fragment shader");
			return;
		}

		this.vert_shader_path = vert;
		this.frag_shader_path = frag;

		this.init();
	}

	init(){
		try {
			this.gl = this.canvas.getContext("webgl");
		} catch(e){
			console.error("No WebGL");
		}

		if(this.gl){
			this.load_shader_sources().then(() => {
				this.init_buffer();
				this.init_shaders();
				this.clear();
				this.draw();
			}).catch(() => console.error("Can't load shader files"));
		}
	}

	load_shader_sources(){
		return new Promise(async (resolve, reject) => {

			try {

				let vert_response = await fetch(this.vert_shader_path);
				let frag_response = await fetch(this.frag_shader_path);

				this.vertex_shader_src = (vert_response.ok)? await vert_response.text() : "";
				this.fragment_shader_src = (frag_response.ok)? await frag_response.text() : "";

				if(!this.vertex_shader_src.length && !this.fragment_shader_src.length){
					reject();
				} else {
					resolve();
				}

			} catch(error){
				reject(error);
			}

		});
	}
	
	init_shaders(){
		let program = this.create_program(this.vertex_shader_src, this.fragment_shader_src);

		this.program = program;
		this.gl.useProgram(program);
	}

	create_program(V_SHADER = "", F_SHADER = ""){
		let vertex_shader = this.load_shader(V_SHADER, this.gl.VERTEX_SHADER);
		let fragment_shader = this.load_shader(F_SHADER, this.gl.FRAGMENT_SHADER);

		if(!vertex_shader || !fragment_shader){
			console.error("Can't load shaders");

			return null;
		}

		let program = this.gl.createProgram();

		if(!program){
			console.error("Can't create program");
		}

		this.gl.attachShader(program, vertex_shader);
		this.gl.attachShader(program, fragment_shader);
		this.gl.linkProgram(program);
		this.gl.validateProgram(program);

		let linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

		if(!linked){
			console.error("Can't link program: " + linked.getProgramInfoLog());

			this.gl.deleteProgram(program);
			this.gl.deleteShader(vertex_shader);
			this.gl.deleteShader(fragment_shader);

			return null;
		}

		return program;
	}

	load_shader(shader_src = "", shader_type){
		let shader = this.gl.createShader(shader_type);

		if(shader){
			this.gl.shaderSource(shader, shader_src);
			this.gl.compileShader(shader);

			let compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

			if(!compiled){
				console.error("Can't compile shader: " + this.gl.getShaderInfoLog(shader));
				this.gl.deleteShader(shader);
			}
		} else {
			console.error("Can't create vertex shader");
		}

		return shader;
	}

	clear(){
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	init_buffer(){
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
		this.buffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	}

	draw(){
		console.error("Nothing to draw");
	}

}
