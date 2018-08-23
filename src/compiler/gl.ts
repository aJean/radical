/**
 * create webgl context
 */

const vshaderSource = ['attribute vec4 a_position;', 'void main() {', 'gl_Position = a_position;', '}'].join('');
const fshaderSource = ['void main() {', 'gl_FragColor = vec4(1, 0, 0.5, 1);', '}'].join('');

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vshader, fshader) {
    const program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function creaeGl(opts) {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    canvas.width = opts.width;
    canvas.height = opts.height;
    canvas.style.cssText = 'position:absolute;left:20px;top:20px;border:1px solid #e3f67b;';
    document.body.appendChild(canvas);

    if(!gl) {
        return console.log('Unable to initialize WebGL');
    }



    const vshader = createShader(gl, gl.VERTEX_SHADER, vshaderSource);
    const fshader = createShader(gl, gl.FRAGMENT_SHADER, fshaderSource);
    const program = createProgram(gl, vshader, fshader);

    const position = gl.getAttribLocation(program, "a_position");
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0.5, 0.7, 0]), gl.STATIC_DRAW);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2,  gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    let picBuf = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, picBuf);

    console.log(picBuf);
}

export default {creaeGl}

