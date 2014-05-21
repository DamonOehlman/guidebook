var actionman = require('actionman');
var eve = require('eve');
var qsa = require('fdom/qsa');
var createEditor = require('javascript-editor');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');
var toc = document.querySelector('.toc');
var sandbox;

function initCodeSection(el) {
  var runButton = crel('button', 'run');
  var container = crel('div', { class: 'editor' });
  var pre = el.parentNode;
  var editor;

  el.parentNode.removeChild(el);

  if (pre.nextElementSibling) {
    pre.parentNode.insertBefore(runButton, pre.nextElementSibling);
  }
  else {
    pre.parentNode.appendChild(runButton);
  }

  pre.parentNode.insertBefore(container, runButton);

  // create the editor
  editor = createEditor({
    container: container,
    value: el.innerText,
    viewportMargin: Infinity
  });

  runButton.addEventListener('click', prepareClickHandler(pre));
}

function prepareClickHandler(el) {
  var container = document.querySelector('div.play');
  var prelude = [
    'var console = require("demo-console");',
    ''
  ].join('\n');

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

    sandbox.bundle(prelude + el.innerText);
  };
}

eve.on('guidebook.toc.show', function() {
  toc.classList.toggle('active');
});

qsa('code.lang-js').forEach(initCodeSection);
actionman('guidebook');
