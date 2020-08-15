// Handling which view to display in the popup
var inlinePlaceholderText = "E = mc^2";
var MQ = MathQuill.getInterface(2);

// Math rendering spans
var mathFieldSpan = document.getElementById('math-field');
var latexSpan = document.getElementById('rendered-latex');

// Notion inserting buttons
let copyButton = document.getElementById('copy');
let insertInlineButton = document.getElementById('insert-inline');

// Character insert buttons
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

function getPlaceholder() {
  var p = document.activeElement.getAttribute("placeholder");
  var iT = document.activeElement.innerText;
  return [p, iT];
}

function toggleNewExistingNone(newToggle, existingToggle, noneToggle) {
  if (!newToggle) {
    document.getElementById("notion-new-math-token").setAttribute("hidden", true);
  } else {
    document.getElementById("notion-new-math-token").removeAttribute("hidden");
  }

  if (!existingToggle) {
    document.getElementById("notion-math-token").setAttribute("hidden", true);
  } else {
    document.getElementById("notion-math-token").removeAttribute("hidden");
  }

  if (!newToggle && !existingToggle) {
    document.getElementById("general-div").setAttribute("hidden", true);
  } else {
    document.getElementById("general-div").removeAttribute("hidden");
  }

  if (!noneToggle) {
    document.getElementById("notion-math-none").setAttribute("hidden", true);
  } else {
    document.getElementById("notion-math-none").removeAttribute("hidden");
  }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript({
      code: '(' + getPlaceholder + ')();'
  }, (results) => {
      var resultPlaceholder = results[0][0].trim();
      var resultInnerText = results[0][1];
      console.log(resultPlaceholder);
      console.log(resultInnerText);
      var isMathBlock = resultPlaceholder === inlinePlaceholderText;
      console.log(isMathBlock);
      console.log(resultInnerText === "");
      if (isMathBlock && resultInnerText === "") {
        toggleNewExistingNone(true, false, false);
        mathField.latex("");
        insertInlineButton.innerText = "Insert Equation";
      } else if (isMathBlock) {
        toggleNewExistingNone(false, true, false);
        mathField.latex(resultInnerText);
        insertInlineButton.innerText = "Save Equation";
      } else {
        toggleNewExistingNone(false, false, true);
      }
  });
});

// if (resultPlaceholder !== inlinePlaceholderText) {
//   console.log("here");
//   document.getElementById("notion-new-math-token").setAttribute("hidden", true);
//   document.getElementById("notion-math-missing").setAttribute("hidden", false);
// } else {
//   console.log("here1");
//   document.getElementById("notion-new-math-token").setAttribute("hidden", false);
//   document.getElementById("notion-math-missing").setAttribute("hidden", true);
// }


// Handling changes in the math editor
function filterText(text) {
  return text.replace("\\", "\\\\");
}

copyButton.onclick = function(event) {
  mathField.select();
  document.execCommand("copy");
}

function insertTextAtCursor(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.execCommand("insertText", false, "' + text + '");'});
  });
}

insertInlineButton.onclick = function(event) {
  insertTextAtCursor(filterText(latexSpan.textContent));
  window.close();
}

// insertBlockButton.onclick = function(event) {
//   insertTextAtCursor("/inline equation");
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'var s = document.createElement("script"); s.setAttribute("src", "insertBlockScript.js");'});
//   });
//   window.close();
//   // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   //   chrome.tabs.executeScript(
//   //     tabs[0].id,
//   //     {file: "jquery-3.5.1.min.js"}, function() {
//   //       chrome.tabs.executeScript({
//   //       file: "insertBlockScript.js"
//   //     });
//   //   });
//   // });
// }

var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
		  latexSpan.innerHTML = mathField.latex();
    }
  }
});

// Handling collapsing and expanding button sections
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

// Handing math character button clicks
function enterCommand(commandText) {
	mathField.typedText(commandText);
	mathField.focus();
	mathField.keystroke('Enter');
	mathField.focus();
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


