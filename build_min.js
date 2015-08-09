({
    baseUrl: './src/',
    mainConfigFile: './src/main.js',
    out: 'dist/engine.min.js',
    optimize: 'uglify2',
    include: ['main'],
    name: '../lib/almond/almond',
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
});