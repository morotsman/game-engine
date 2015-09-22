// Requirejs Configuration Options
require.config({
  // to set the default folder
  baseUrl: 'src', 
  // paths: maps ids with paths (no extension)
  paths: {
      'jasmine': ['../lib/jasmine-2.3.4/jasmine'],
      'jasmine-html': ['../lib/jasmine-2.3.4/jasmine-html'],
      'jasmine-boot': ['../lib/jasmine-2.3.4/boot']
  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
    'jasmine-html': {
      deps : ['jasmine']
    },
    'jasmine-boot': {
      deps : ['jasmine', 'jasmine-html']
    }
  }
});

require(['jasmine-boot'], function () {
  require(['../spec/CollisionDetectorSpec', "../spec/LineIntersectSpec", "../spec/ListSpec"], function(){
    //trigger Jasmine
    window.onload();
  })
});