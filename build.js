({
    baseUrl: './src/',
    mainConfigFile: './src/main.js',
    out: 'dist/engine.js',
    optimize: 'none',
    include: ['main'],
    name: '../lib/almond/almond',
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
});