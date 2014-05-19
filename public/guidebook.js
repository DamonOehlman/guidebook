var qsa = require('fdom/qsa');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');

function initCodeSection(el) {
  var runButton = crel('button', 'run');

  if (el.nextElementSibling) {
    el.parentNode.insertBefore(el.nextElementSibling, runButton);
  }
  else {
    el.parentNode.appendChild(runButton);
  }

  runButton.addEventListener('click', prepareClickHandler(el));
}

function prepareClickHandler(el) {
  return function(evt) {
    var sandbox = createSandbox({
      cdn: 'http://localhost:3000',
      container: document.querySelector('div.play'),
      iframeStyle: 'body, html { height: 100%; width: 100%; }',
      cacheOpts: {
        inMemory: true
      }
    });

    sandbox
      .on('modules', function(modules) {
      })
      .on('bundleStart', function() {
      })
      .on('bundleEnd', function(html) {
        console.log('bundling done: ', html);
      });

    sandbox.bundle(el.innerText);
  };
}

qsa('div.highlight').forEach(initCodeSection);
