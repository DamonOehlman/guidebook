var actionman = require('actionman');
var eve = require('eve');
var qsa = require('fdom/qsa');
var marked = require('marked');
var createEditor = require('javascript-editor');
var createSandbox = require('browser-module-sandbox');
var crel = require('crel');
var toc = document.querySelector('.toc');
var guideContainer = qsa('div.guidebook')[0];
var demoContainer = document.querySelector('div.play');
var sandbox;
var errorBox;

function closeDemo() {
  demoContainer.classList.remove('active');
}

function cycleLayout() {
  var layout = parseInt(guideContainer.dataset.layout, 10) || 0;
  guideContainer.dataset.layout = (layout + 1) % 3;
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
    viewportMargin: Infinity,
    autofocus: false
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

    // if we had an errorbox remove it
    if (errorBox) {
      demoContainer.removeChild(errorBox);
      errorBox = undefined;
    }

    sandbox = createSandbox({
      cdn: location.origin,
      container: demoContainer,
      iframeStyle: 'body, html { height: 100%; width: 100%; }',
      iframeBody: '<link rel="stylesheet" href="demorunner.css">',
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
      })
      .on('bundleError', function(err) {
        var message = (err instanceof Error) ? err.message : err;

        demoContainer.classList.remove('loading');
        demoContainer.appendChild(errorBox = crel('pre', { class: 'bundleError' }, message));
      });

    sandbox.bundle(prelude + editor.getValue());
  };
}

function showTOC() {
  guideContainer.dataset.layout = 0;
  toc.classList.toggle('active');
}

eve.on('guidebook.toc.show', showTOC);
eve.on('guidebook.cycle', cycleLayout);

qsa('code.lang-js').forEach(initCodeSection);
actionman('guidebook');
