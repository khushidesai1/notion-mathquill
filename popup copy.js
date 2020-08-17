// Getting necessary elements
var inlinePlaceholderText = "E = mc^2";
var blockPlaceholderText = "|x|";
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