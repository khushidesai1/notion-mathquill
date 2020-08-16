// Handling which view to display in the popup
var inlinePlaceholderText = "E = mc^2";
var blockPlaceholderText = "|x|";
var MQ = MathQuill.getInterface(2);

// Math rendering spans
var mathFieldSpan = document.getElementById('math-field');
var latexSpan = document.getElementById('rendered-latex');

// Notion inserting buttons
let copyButton = document.getElementById('copy');
let insertInlineButton = document.getElementById('insert-inline');
let allowButton = document.getElementById('allow-creation');

// Gets the placeholder and the inner text of the active element
function getPlaceholder() {
  var p = document.activeElement.getAttribute("placeholder");
  var iT = document.activeElement.innerText;
  return [p, iT];
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
      var resultPlaceholder = results[0][0].trim();
      var resultInnerText = results[0][1];
      var isMathBlock = resultPlaceholder === inlinePlaceholderText || resultPlaceholder.startsWith(blockPlaceholderText);
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

// Handler for the insert equation button
insertInlineButton.onclick = function(event) {
  insertTextAtCursor(filterText(latexSpan.textContent));
  window.close();
}

// Handler for the create equation button
allowButton.onclick = function(event) {
  toggleNewExistingNone(true, false, false);
  mathField.latex("");
  insertInlineButton.innerText = "Insert Equation";
}

// Adding handlers to the math field and initializing the math span
var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
		  latexSpan.innerHTML = mathField.latex();
      if (latexSpan.innerHTML !== "") {
        insertInlineButton.removeAttribute("disabled");
        copyButton.removeAttribute("disabled");
      }
    }
  }
});
