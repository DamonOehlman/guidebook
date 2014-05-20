var qsa = require('fdom/qsa');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');

function initCodeSection(el) {
  var runButton = crel('button', 'run');

  el.classList.add('codehilite');

  if (el.nextElementSibling) {
    el.parentNode.insertBefore(runButton, el.nextElementSibling);
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

    console.log(el.innerText);
    sandbox.bundle(el.innerText);
  };
}

qsa('div.highlight').forEach(initCodeSection);
