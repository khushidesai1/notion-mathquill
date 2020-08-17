// Handling which view to display in the popup
var MQ = MathQuill.getInterface(2);
var inlinePlaceholderText = "E = mc^2";
var blockPlaceholderText = "|x|";

// Math rendering spans
var mathFieldSpan = document.getElementById('math-field');
var latexSpan = document.getElementById('rendered-latex');

// Notion inserting buttons
let copyButton = document.getElementById('copy');
let insertInlineButton = document.getElementById('insert-inline');
let allowButton = document.getElementById('allow-creation');

// Gets the placeholder and the inner text of the active element
function getPlaceholder() {
  var ed = document.activeElement.contentEditable;
  var p = document.activeElement.getAttribute("placeholder");
  var iT = document.activeElement.innerText;
  return [ed, p, iT];
}

// Changes the view of the popup based on user's document interaction
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

// Obtains information from the Notion page and performs actions based on the state
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript({
      code: '(' + getPlaceholder + ')();'
  }, (results) => {
      if (results[0][0] === "true") {
        var resultPlaceholder = results[0][1] ? results[0][1].trim() : null;
        var resultInnerText = results[0][2];
        var isMathBlock = resultPlaceholder && (resultPlaceholder === inlinePlaceholderText || resultPlaceholder.startsWith(blockPlaceholderText));
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
      } else {
        toggleNewExistingNone(false, false, true);
        allowButton.setAttribute("disabled", true);
      }
  });
});

// Helper to filter and fix latex rendered by mathquill
function filterText(text) {
  return text.replace(/\\/g, "\\\\");
}

// Inserts the given text at the cursor
function insertTextAtCursor(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.execCommand("insertText", false, "' + text + '");'});
  });
}

// Handler for the copy button
copyButton.onclick = function(event) {
  mathField.select();
  document.execCommand("copy");
}

// Handler for the create equation button
allowButton.onclick = function(event) {
  toggleNewExistingNone(true, false, false);
  mathField.latex("");
  insertInlineButton.innerText = "Insert Equation";
}

// Handler for the insert equation button
insertInlineButton.onclick = function(event) {
  insertTextAtCursor(filterText(latexSpan.textContent));
  window.close();
}

// Adding handlers to the math field and initializing the math span
var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
		  latexSpan.innerHTML = mathField.latex();
      // if (latexSpan.innerHTML !== "") {
      //   insertInlineButton.removeAttribute("disabled");
      //   copyButton.removeAttribute("disabled");
      // }
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

// Basic symbols
let noteq = document.getElementById('noteq');
let root = document.getElementById('root');
let approxeq = document.getElementById('appxeq');
let plusminus = document.getElementById('plus-minus');
let superscript = document.getElementById('superscript');
let subscript = document.getElementById('subscript');

// Algebra symbols
let sum = document.getElementById('sum');
let integral = document.getElementById('integral');
let pi = document.getElementById('pi');
let cappi = document.getElementById('cappi');

// Set symbols
let subset = document.getElementById('subset');
let supset = document.getElementById('supset');
let subseteq = document.getElementById('subseteq');
let supseteq = document.getElementById('supseteq');
let union = document.getElementById('union');
let intersection = document.getElementById('intersection');
let belongs = document.getElementById('belongs');
let notbelongs = document.getElementById('notbelongs');

//Logic expressions
let forall = document.getElementById('forall');
let implies = document.getElementById('implies');

// Handing math character button clicks
function enterCommand(commandText) {
  mathField.typedText(commandText);
  mathField.focus();
  mathField.keystroke('Enter');
  mathField.focus();
}

// Handlers for all the character button clicks
// Basic symbols
noteq.onclick = function (event) {
  enterCommand("\\neq");
}

root.onclick = function(event) {
  enterCommand("\\sqrt");
}

approxeq.onclick = function(event) {
  enterCommand("\\approx");
}

plusminus.onclick = function(event) {
  enterCommand("\\pm");
}

superscript.onclick = function(event) {
  enterCommand('^');
}

subscript.onclick = function(event) {
  enterCommand("_");
}

// Algebra symbols
sum.onclick = function(event) {
  enterCommand('\\sum');
}

integral.onclick = function(event) {
  enterCommand('\\int');
}

pi.onclick = function(event) {
  enterCommand('\\pi');
}

cappi.onclick = function(event) {
  enterCommand('\\Pi');
}

// Set symbols
subset.onclick = function(event) {
  enterCommand("\\subset");
}

supset.onclick = function(event) {
  enterCommand("\\supset");
}

subseteq.onclick = function(event) {
  enterCommand("\\subseteq");
}

supseteq.onclick = function(event) {
  enterCommand("\\supseteq");
} 

union.onclick = function(event) {
  enterCommand("\\union");
}

intersection.onclick = function(event) {
  enterCommand("\\intersection");
}

belongs.onclick = function(event) {
  enterCommand("\\in");
}

notbelongs.onclick = function(event) {
  enterCommand("\\notin");
}

// Logic symbols
forall.onclick = function(event) {
  enterCommand("\\forall");
}

implies.onclick = function(event) {
  enterCommand("\\implies");
}
