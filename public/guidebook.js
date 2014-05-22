var actionman = require('actionman');
var eve = require('eve');
var qsa = require('fdom/qsa');
var createEditor = require('javascript-editor');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');
var toc = document.querySelector('.toc');
var demoContainer = document.querySelector('div.play');
var sandbox;

function closeDemo() {
  demoContainer.classList.remove('active');
}

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

  runButton.addEventListener('click', prepareClickHandler(pre, editor));
}

function prepareClickHandler(el, editor) {
  var prelude = [
    'var console = require("demo-console");',
    ''
  ].join('\n');

  return function(evt) {
    var button = evt.target;

    // if we already have a sandbox, then clean it up
    if (sandbox && sandbox.iframe) {
      sandbox.iframe.remove();
    }

    sandbox = createSandbox({
      cdn: 'http://localhost:3000',
      container: demoContainer,
      iframeStyle: 'body, html { height: 100%; width: 100%; }',
      cacheOpts: {
        inMemory: true
      }
    });

    sandbox
      .on('modules', function(modules) {
      })
      .on('bundleStart', function() {
        demoContainer.classList.add('loading');
      })
      .on('bundleEnd', function(html) {
        demoContainer.classList.remove('loading');
        demoContainer.classList.add('active');
      });

    sandbox.bundle(prelude + editor.getValue());
  };
}

eve.on('guidebook.toc.show', function() {
  toc.classList.toggle('active');
});

qsa('code.lang-js').forEach(initCodeSection);
actionman('guidebook');
