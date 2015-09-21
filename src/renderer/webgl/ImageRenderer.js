define(["renderer/webgl/WEbGLUtil"], function (util) {

    var vertexShader = [
        'attribute vec2 a_position;',
        'varying vec2 v_texCoord;',
        'uniform float spritesPerRow;',
        'uniform vec2 spriteTextureSize;',
        'uniform vec2 spriteSize;',
        'uniform vec2 spriteStartPos;',
        'uniform vec4 u_screenDims;',
        'attribute float rotation;',
        'attribute vec2 centerPosition;',
        'attribute float currentFrameNumber;',
        'attribute vec2 preferedDisplaySize;',
        'void main() {',
        '   float row = floor(currentFrameNumber / spritesPerRow);',
        '   vec2 upperLeftTC = spriteStartPos + vec2(spriteTextureSize.x * (currentFrameNumber - (row * spritesPerRow)),spriteTextureSize.y * row);',
        '   vec2 tc = upperLeftTC + spriteTextureSize * a_position;',
        '   v_texCoord = tc;',
        '   float s = sin(rotation);',
        '   float c = cos(rotation);',
        '   mat2 rotMat = mat2(c, -s, s, c);',
        '   vec2 calculatedScale = vec2(preferedDisplaySize.x/spriteSize.x, preferedDisplaySize.y/spriteSize.y);',
        '   vec2 scaledOffset = spriteSize * a_position*calculatedScale;',
        '   vec2 pos = centerPosition + rotMat * scaledOffset;',
        '   gl_Position = vec4(pos * u_screenDims.xy + u_screenDims.zw, 0.0, 1.0); ',
        '}'
    ].join('\n');
    var fragmentShader = [
        "precision mediump float;",
        "uniform sampler2D u_image;",
        "varying vec2 v_texCoord;",
        "void main() {",
        "   gl_FragColor = texture2D(u_image, v_texCoord);",
        "}"
    ].join('\n');

    var shaderProgram
    var gl;
    var canvas;
    var parameterLocations = {};
    var buffers = {};
    var spriteCache = {};
    var imageCache = {};

    var MAX_BATCH = 5000;

    var init = function (fragmentShader, vertexShader) {
        //create program
        var fragmentShader = util.setupShader(gl, "fragment", fragmentShader);
        var vertexShader = util.setupShader(gl, "vertex", vertexShader);
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.bindAttribLocation(shaderProgram, 0, "a_position");
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        gl.useProgram(shaderProgram);

        //setup uniforms and attributes
        parameterLocations.positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
        parameterLocations.currentFrameNumber = gl.getAttribLocation(shaderProgram, "currentFrameNumber");
        parameterLocations.spritesPerRow = gl.getUniformLocation(shaderProgram, "spritesPerRow");
        parameterLocations.spriteTextureSize = gl.getUniformLocation(shaderProgram, "spriteTextureSize");
        parameterLocations.spriteSize = gl.getUniformLocation(shaderProgram, "spriteSize");
        parameterLocations.screenDimsLoc = gl.getUniformLocation(shaderProgram, "u_screenDims");
        parameterLocations.spriteStartPos = gl.getUniformLocation(shaderProgram, "spriteStartPos");
        parameterLocations.rotation = gl.getAttribLocation(shaderProgram, "rotation");
        parameterLocations.centerPosition = gl.getAttribLocation(shaderProgram, "centerPosition");
        parameterLocations.preferedDisplaySize = gl.getAttribLocation(shaderProgram, "preferedDisplaySize");



        // set the resolution
        gl.uniform2f(parameterLocations.resolutionLocation, canvas.width, canvas.height);

        // Create a buffer for the position of the rectangle corners.
        buffers.rectangle = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rectangle);
        gl.enableVertexAttribArray(parameterLocations.positionLocation);
        gl.vertexAttribPointer(parameterLocations.positionLocation, 2, gl.FLOAT, false, 0, 0);

        buffers.preferedDisplaySize = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.preferedDisplaySize);
        gl.enableVertexAttribArray(parameterLocations.preferedDisplaySize);
        gl.vertexAttribPointer(parameterLocations.preferedDisplaySize, 2, gl.FLOAT, false, 0, 0);

        buffers.centerPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.centerPosition);
        gl.enableVertexAttribArray(parameterLocations.centerPosition);
        gl.vertexAttribPointer(parameterLocations.centerPosition, 2, gl.FLOAT, false, 0, 0);

        buffers.currentFrameNumber = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.currentFrameNumber);
        gl.enableVertexAttribArray(parameterLocations.currentFrameNumber);
        gl.vertexAttribPointer(parameterLocations.currentFrameNumber, 2, gl.FLOAT, false, 0, 0);

        buffers.rotation = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
        gl.enableVertexAttribArray(parameterLocations.rotation);
        gl.vertexAttribPointer(parameterLocations.rotation, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0.0, 0.0, 0.0, 0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    };



    function ImageRenderer() {

        this.init = function (_gl, _canvas) {
            gl = _gl;
            canvas = _canvas;
            init(fragmentShader, vertexShader);
        };

        this.loadImage = function (imageInfo) {
            imageInfo.texture = util.createTextureFromImage(gl, imageInfo.image);
            imageCache[imageInfo.key] = imageInfo;
            spriteCache[imageInfo.key] = [];
        };


        this.drawImage = function (sprite) {
            var currentImageSrc = sprite.currentSrc;
            spriteCache[currentImageSrc].push(sprite);

            var imageInfo = imageCache[currentImageSrc];
            if (imageInfo.numberOfFrames > 1) {
                sprite.currentFrameNumber = sprite.frameNumber % imageInfo.numberOfFrames;
                sprite.counter++;
                if (sprite.counter % imageInfo.animationSpeed === 0) {
                    sprite.frameNumber++;
                }

            }
            /*
             spriteCache[currentImageSrc].push({
             x: sprite.getX(),
             y: sprite.getY(),
             scaleX: sprite.getWidth() / imageCache[currentImageSrc].spriteWidth,
             scaleY: sprite.getHeight() / imageCache[currentImageSrc].spriteHeight,
             rotation: 0,
             currentFrameNumber: sprite.getCurrentFrameNumber()
             });
             */
        };



        function createRectangles(limit) {
            var result = new Float32Array(limit * 12);
            var prevSize;

            var rectangles = function (gl, sprites) {
                var offset;
                for (var i = 0; i < sprites.length; i++) {
                    offset = 12 * i;
                    result[offset] = 0;
                    result[offset + 1] = 0;
                    result[offset + 2] = 0;
                    result[offset + 3] = 1;
                    result[offset + 4] = 1;
                    result[offset + 5] = 0;
                    result[offset + 6] = 1;
                    result[offset + 7] = 0;
                    result[offset + 8] = 0;
                    result[offset + 9] = 1;
                    result[offset + 10] = 1;
                    result[offset + 11] = 1;
                }

                if (prevSize > sprites.length) {
                    for (var i = sprites.length; i < prevSize; i++) {
                        offset = 12 * i;
                        result[offset] = 0;
                        result[offset + 1] = 0;
                        result[offset + 2] = 0;
                        result[offset + 3] = 0;
                        result[offset + 4] = 0;
                        result[offset + 5] = 0;
                        result[offset + 6] = 0;
                        result[offset + 7] = 0;
                        result[offset + 8] = 0;
                        result[offset + 9] = 0;
                        result[offset + 10] = 0;
                        result[offset + 11] = 0;
                    }
                }
                prevSize = sprites.length;
                return result;
            };

            return rectangles;
        }
        ;



        function createDisplaySize(limit) {
            var result = new Float32Array(limit * 12);

            var displaySize = function (sprites, startIndex, stopIndex) {
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * i;
                    result[offset] = sprites[i].width;
                    result[offset + 1] = sprites[i].height;
                    result[offset + 2] = sprites[i].width;
                    result[offset + 3] = sprites[i].height;
                    result[offset + 4] = sprites[i].width;
                    result[offset + 5] = sprites[i].height;
                    result[offset + 6] = sprites[i].width;
                    result[offset + 7] = sprites[i].height;
                    result[offset + 8] = sprites[i].width;
                    result[offset + 9] = sprites[i].height;
                    result[offset + 10] = sprites[i].width;
                    result[offset + 11] = sprites[i].height;
                }
                return result;
            };


            return displaySize;
        }
        ;

        function createCenterPositions(limit) {
            var result = new Float32Array(limit * 12);

            var centerPositions = function (sprites, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].x;
                    result[offset + 1] = sprites[i].y;
                    result[offset + 2] = sprites[i].x;
                    result[offset + 3] = sprites[i].y;
                    result[offset + 4] = sprites[i].x;
                    result[offset + 5] = sprites[i].y;
                    result[offset + 6] = sprites[i].x;
                    result[offset + 7] = sprites[i].y;
                    result[offset + 8] = sprites[i].x;
                    result[offset + 9] = sprites[i].y;
                    result[offset + 10] = sprites[i].x;
                    result[offset + 11] = sprites[i].y;
                    index++;
                }
                return result;
            };

            return centerPositions;
        }
        ;

        function createCurrentFrameNumber(limit) {
            var result = new Float32Array(limit * 12);

            var currentFrameNumber = function (sprites, image, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].currentFrameNumber;
                    result[offset + 1] = sprites[i].currentFrameNumber;
                    result[offset + 2] = sprites[i].currentFrameNumber;
                    result[offset + 3] = sprites[i].currentFrameNumber;
                    result[offset + 4] = sprites[i].currentFrameNumber;
                    result[offset + 5] = sprites[i].currentFrameNumber;
                    result[offset + 6] = sprites[i].currentFrameNumber;
                    result[offset + 7] = sprites[i].currentFrameNumber;
                    result[offset + 8] = sprites[i].currentFrameNumber;
                    result[offset + 9] = sprites[i].currentFrameNumber;
                    result[offset + 10] = sprites[i].currentFrameNumber;
                    result[offset + 11] = sprites[i].currentFrameNumber;
                    index++;
                }


                return result;
            };

            return currentFrameNumber;
        }
        ;

        function createRotation(limit) {
            var result = new Float32Array(limit * 12);

            var rotation = function (sprites, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].rotation;
                    result[offset + 1] = sprites[i].rotation;
                    result[offset + 2] = sprites[i].rotation;
                    result[offset + 3] = sprites[i].rotation;
                    result[offset + 4] = sprites[i].rotation;
                    result[offset + 5] = sprites[i].rotation;
                    result[offset + 6] = sprites[i].rotation;
                    result[offset + 7] = sprites[i].rotation;
                    result[offset + 8] = sprites[i].rotation;
                    result[offset + 9] = sprites[i].rotation;
                    result[offset + 10] = sprites[i].rotation;
                    result[offset + 11] = sprites[i].rotation;
                    index++;
                }
                return result;
            };

            return rotation;
        }
        ;

        var rectangleCreator = createRectangles(MAX_BATCH);
        var displaySizeCreator = createDisplaySize(MAX_BATCH);
        var centerPositionCreator = createCenterPositions(MAX_BATCH);
        var currentFrameNumberCreator = createCurrentFrameNumber(MAX_BATCH);
        var rotationCreator = createRotation(MAX_BATCH);


        this.flush = function () {

            gl.uniform4f(parameterLocations.screenDimsLoc,
                    2.0 / canvas.width,
                    -2.0 / canvas.height,
                    -1.0,
                    1.0);


            for (var property in imageCache) {
                if (imageCache.hasOwnProperty(property)) {
                    var image = imageCache[property];
                    gl.uniform1f(parameterLocations.spritesPerRow, image.spritesPerRow);
                    gl.uniform2f(parameterLocations.spriteTextureSize, image.spriteWidth / image.imageWidth, image.spriteHeight / image.imageHeight);
                    gl.uniform2f(parameterLocations.spriteSize, image.spriteWidth, image.spriteHeight);
                    gl.uniform2f(parameterLocations.spriteStartPos, image.spriteX / image.imageWidth, image.spriteY / image.imageHeight);
                    var spritesToDraw = spriteCache[property];
                    gl.bindTexture(gl.TEXTURE_2D, image.texture);

                    var startIndex = 0;
                    var stopIndex = MAX_BATCH < spritesToDraw.length ? MAX_BATCH : spritesToDraw.length;
                    var hasMore = true;
                    while (hasMore) {


                        var rectangles = rectangleCreator(gl, spritesToDraw);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rectangle);
                        gl.bufferData(gl.ARRAY_BUFFER, rectangles, gl.STATIC_DRAW);

                        var preferedDisplaySize = displaySizeCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.preferedDisplaySize);
                        gl.bufferData(gl.ARRAY_BUFFER, preferedDisplaySize, gl.STATIC_DRAW);

                        var centerPositions = centerPositionCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.centerPosition);
                        gl.bufferData(gl.ARRAY_BUFFER, centerPositions, gl.STATIC_DRAW);

                        var currentFrameNumbers = currentFrameNumberCreator(spritesToDraw, image, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.currentFrameNumber);
                        gl.bufferData(gl.ARRAY_BUFFER, currentFrameNumbers, gl.STATIC_DRAW);

                        var rotation = rotationCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
                        gl.bufferData(gl.ARRAY_BUFFER, rotation, gl.STATIC_DRAW);

                        gl.drawArrays(gl.TRIANGLES, 0, MAX_BATCH * 6);

                        startIndex = stopIndex;
                        stopIndex = stopIndex + MAX_BATCH;
                        if (stopIndex > spritesToDraw.length) {
                            stopIndex = spritesToDraw.length;
                        }
                        if (startIndex >= spritesToDraw.length) {
                            hasMore = false;
                        }
                    }



                }


            }

            for (var property in spriteCache) {
                if (spriteCache.hasOwnProperty(property)) {
                    spriteCache[property].length = 0;
                }
            }

        };

    }



    return new ImageRenderer();


});


