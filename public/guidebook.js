var qsa = require('fdom/qsa');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');
var sandbox;

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
  var container = document.querySelector('div.play');

  return function(evt) {
    // if we already have a sandbox, then clean it up
    if (sandbox && sandbox.iframe) {
      sandbox.iframe.remove();
    }

    sandbox = createSandbox({
      cdn: 'http://localhost:3000',
      container: container,
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
        container.classList.add('active');
      });

    sandbox.bundle(el.innerText);
  };
}

qsa('div.highlight').forEach(initCodeSection);
