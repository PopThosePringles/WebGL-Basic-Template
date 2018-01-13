class WebGL_Template {

	static init(){
		this.canvas = document.querySelector("#canvas");
		this.gl = null;
		this.vertex_shader_src = null;
		this.fragment_shader_src = null;
		this.program = null;
		this.buffer = null;

		try {
			this.gl = this.canvas.getContext("webgl");
		} catch(e){
			console.warn("No WebGL");
		}

		if(this.gl){
			this.load_shader_sources().then(() => {
				this.init_buffer();
				this.init_shaders();
				this.clear();
				this.draw();
			}).catch(r => {
				console.log(r);
				console.warn("Can't load shader files")
			});
		}
	}

	static load_shader_sources(){
		return new Promise(async (resolve, reject) => {

			try {

				let vert_response = await fetch("shaders/basic.vert.glsl");
				let frag_response = await fetch("shaders/basic.frag.glsl");

				this.vertex_shader_src = (vert_response.ok)? await vert_response.text() : "";
				this.fragment_shader_src = (frag_response.ok)? await frag_response.text() : "";

				if(!this.vertex_shader_src.length && !this.fragment_shader_src.length){
					reject();
				} else {
					resolve();
				}

			} catch(error){
				reject();
			}

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
		this.gl.validateProgram(program);

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
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	static init_buffer(){
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
		this.buffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	}

	static draw_quad_animate_color(){
		let positions = new Float32Array([
			-1, 1,
			-1, -1,
			1, 1,
			1, -1
		]);

		this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

		let pos = this.gl.getAttribLocation(this.program, "_Position");

		this.gl.enableVertexAttribArray(pos);
		this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);

		let width = this.gl.getUniformLocation(this.program, "_Width");
		let height = this.gl.getUniformLocation(this.program, "_Height");

		this.gl.uniform1f(width, parseFloat(this.canvas.width));
		this.gl.uniform1f(height, parseFloat(this.canvas.height));

		let time = this.gl.getUniformLocation(this.program, "_Time");
		let elapsed = 0;
		let then = 0;
		let fps = 1000 / 20; // change fps here (currently 20 fps)

		function send_time_to_shader(timestamp){
			if(!then){
				then = timestamp;
			}

			elapsed = timestamp - then;

			if(elapsed > fps){
				then = timestamp - (elapsed % fps);

				this.gl.uniform1f(time, parseFloat(timestamp));
				this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
			}

			window.requestAnimationFrame(send_time_to_shader.bind(this));
		}

		send_time_to_shader.bind(this)(0);
	}

	static draw(){
		this.draw_quad_animate_color();
	}

}
