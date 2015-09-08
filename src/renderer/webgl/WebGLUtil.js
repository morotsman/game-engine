define([], function () {

    function Util() {
        var that = this;

        this.initGL = function (canvas) {
            var gl;
            try {
                gl = canvas.getContext("webgl");
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
            } catch (e) {
            }
            if (!gl) {
                alert("Could not initialise WebGL, sorry :-(");
            } else {
                return gl;
            }

        };

        this.setupShader = function (gl, type, source) {
            var shader;
            if (type === "fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (type === "vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };



        this.getShaderUniforms = function (gl, program, uniforms) {
            var result = {};
            uniforms.forEach(function (uniform) {
                result[uniform] = gl.getUniformLocation(program, uniform);
            });
            return result;
        };

        this.getShaderAttributes = function (gl, program, attributes) {
            var result = {};
            attributes.forEach(function (attribute) {
                result[attribute] = gl.getAttribLocation(program, attribute);
            });
            return result;
        };

        this.createTextureFromImage = function (gl, image) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        };

    }
    ;
    
    return new Util();

});




