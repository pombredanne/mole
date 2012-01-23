#!/usr/bin/env node
/*
 * Copyright 2012 Trent Mick. All rights reserved.
 */

var burrito = require('burrito');
var sprintf = require('sprintf').sprintf;
var fs = require('fs');

var config = {
  json: false
};



function dumpNode(node) {
  if (config.json) {
    var data = {
      name: node.name,
      start: node.start,
      end: node.start,
      source: node.source(),
      level: node.state.level,
      label: node.label(),
      value: node.value
    };
    //console.log(node); //XXX
    console.log(JSON.stringify(data, null, 2))
  } else {
    var spaces = '';
    for (var i = 0; i < node.state.level; i++) spaces += '  ';
    console.log(sprintf("[%13s]%s%s", node.name, spaces, node.source()));
  }
}

function dumpPath(path) {
  var code = fs.readFileSync(path, 'utf-8');
  dumpString(code);
}

function dumpString(code) {
  //var ast = burrito.parse(code, false, true);
  //burrito(ast, dumpNode);
  burrito(code, dumpNode);
}



//---- mainline

var paths = process.argv.slice(2);
if (paths.length) {
  for (var i=0; i < paths.length; i++) {
    dumpPath(paths[i]);
  }
} else {
  var chunks = [];
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    chunks.push(chunk);
  });
  process.stdin.on('end', function () {
    var code = chunks.join('')
    dumpString(code);
  });
}

