class WebGL_Boxes extends WebGL {

	draw_quad_animate_boxes(){
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
		let fps = 1000 / 6;

		function send_time_to_shader_redraw(timestamp){
			if(!then){
				then = timestamp;
			}

			elapsed = timestamp - then;

			if(elapsed > fps){
				then = timestamp - (elapsed % fps);

				this.gl.uniform1f(time, parseFloat(timestamp));
				this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
			}

			window.requestAnimationFrame(send_time_to_shader_redraw.bind(this));
		}

		send_time_to_shader_redraw.bind(this)(0);
	}

	draw(){
		this.draw_quad_animate_boxes();
	}

}