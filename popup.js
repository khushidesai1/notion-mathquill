var mathFieldSpan = document.getElementById('math-field');
var latexSpan = document.getElementById('rendered-latex');
var katexSpan = document.getElementById('rendered-katex');

var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
		  latexSpan.innerHTML = mathField.latex();
      katex.render(latexSpan.textContent, katexSpan, {throwOnError: false});
    }
  }
});

let copyButton = document.getElementById('copy');
let insertInlineButton = document.getElementById('insert-inline');
let insertBlock = document.getElementById('insert-block');
let summationButton = document.getElementById('summation');
let integralButton = document.getElementById('integral');
let superscriptButton = document.getElementById('superscript');
let subscriptButton = document.getElementById('subscript');
let notequalButton = document.getElementById('notequal');
let subsetButton = document.getElementById('subset');
let supsetButton = document.getElementById('supset');
let subseteqButton = document.getElementById('subseteq');
let supseteqButton = document.getElementById('supseteq');
let forallButton = document.getElementById('forall');

let coll = document.getElementsByClassName("sub-label");

let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

function filterText(text) {
	return text.replace("\\", "\\\\");
}

function enterCommand(commandText) {
	mathField.typedText(commandText);
	mathField.focus();
	mathField.keystroke('Enter');
	mathField.focus();
}

copyButton.onclick = function(event) {
	mathField.select();
	document.execCommand("copy");
}

function getInline() {
  var outermostSpan = document.createElement('span');
  outermostSpan.setAttribute("data-token-index", "0");
  outermostSpan.setAttribute("contenteditable", "false");
  outermostSpan.setAttribute("class", "notion-text-equation-token");
  outermostSpan.setAttribute("style", "user-select:all;-webkit-user-select:all;-moz-user-select:all");
  var innerEmptySpan = document.createElement('span');
  var coverSpan = document.createElement('span');
  coverSpan.appendChild(katexSpan);
  var idSpan = document.createElement('span');
  idSpan.innerHTML = "&#65279;";
  outermostSpan.appendChild(innerEmptySpan);
  outermostSpan.appendChild(coverSpan);
  outermostSpan.appendChild(idSpan);
  return outermostSpan;
}

insertInlineButton.onclick = function(event) {
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  // chrome.tabs.executeScript(
  //   tabs[0].id,
  //   {file: "clearScript.js"});
  // });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.execCommand("insertText", false, "' + filterText(latexSpan.textContent) + '");'});
  });
}

summationButton.onclick = function(event) {
	enterCommand('\\sum');
}

integralButton.onclick = function(event) {
	enterCommand('\\int');
}

superscriptButton.onclick = function(event) {
	enterCommand('^');
}

subscriptButton.onclick = function(event) {
	enterCommand("_");
}

notequalButton.onclick = function (event) {
	enterCommand("\\neq");
}

subsetButton.onclick = function(event) {
	enterCommand("\\subset");
}

supsetButton.onclick = function(event) {
	enterCommand("\\supset");
}

subseteqButton.onclick = function(event) {
	enterCommand("\\subseteq");
}

supseteqButton.onclick = function(event) {
	enterCommand("\\supseteq");
} 

forallButton.onclick = function(event) {
	enterCommand("\\forall");
}


