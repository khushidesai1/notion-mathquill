// Get the document element using the id
function docEl(id) {
	return document.getElementById(id);
}

// Handling which view to display in the popup
const MQ = MathQuill.getInterface(2);
let inlinePlaceholderText = "E = mc^2";
let blockPlaceholderText = "|x|";

// Math rendering spans
let mathFieldSpan = docEl('math-field');
let latexSpan = docEl('rendered-latex');

// Notion inserting buttons
let copyButton = docEl('copy');
let insertInlineButton = docEl('insert-inline');
let allowButton = docEl('allow-creation');

// Gets the placeholder and the inner text of the active element
function getPlaceholder() {
  const ed = document.activeElement.contentEditable;
  const p = document.activeElement.getAttribute("placeholder");
  const iT = document.activeElement.innerText;
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

function replaceSetNotation(text) {
	while (text.includes("\\mathbb{R}")) {
		text = text.replace("\\mathbb{R}", "\\reals");
		text = text.replace("\\mathbb{Z}", "\\integers");
		text = text.replace("\\mathbb{C}", "ℂ");
		text = text.replace("\\mathbb{N}", "ℕ");
		text = text.replace("\\mathbb{Q}", "ℚ");
	}
	return text;
}

// Obtains information from the Notion page and performs actions based on the state
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript({
      code: '(' + getPlaceholder + ')();'
  }, (results) => {
      if (results[0][0] === "true") {
        let resultPlaceholder = results[0][1] ? results[0][1].trim() : null;
        let resultInnerText = results[0][2];
        let isMathBlock = resultPlaceholder && (resultPlaceholder === inlinePlaceholderText || resultPlaceholder.startsWith(blockPlaceholderText));
        if (isMathBlock && resultInnerText === "") {
          toggleNewExistingNone(true, false, false);
          mathField.latex("");
          insertInlineButton.innerText = "Insert Equation";
        } else if (isMathBlock) {
          toggleNewExistingNone(false, true, false);
          console.log(resultInnerText);
          mathField.latex(replaceSetNotation(resultInnerText));
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
let mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
		  latexSpan.innerHTML = mathField.latex();
    }
  }
});

// Handling collapsing and expanding button sections
let headerEl = docEl("char-head");
headerEl.addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    this.innerText = !content.style.maxHeight ? "Collapse Characters" : "Expand Characters";
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });

class HashMap {
	constructor() {
		this.keys = [];
		this.primaryValues = [];
		this.secondaryValues = [];
	}

	put(key, primaryValue, secondaryValue) {
		if (this.keys.includes(key)) {
			let insertIndex = this.keys.indexOf(key);
			this.primaryValues[insertIndex] = primaryValue;
			this.secondaryValues[insertIndex] = secondaryValue;
		} else {
			this.keys.push(key);
			this.primaryValues.push(primaryValue);
			this.secondaryValues.push(secondaryValue);
		}
	}

	getPrimary(key) {
		let keyIndex = this.keys.indexOf(key);
		return this.primaryValues[keyIndex];
	}

	getSecondary(key) {
		let keyIndex = this.keys.indexOf(key);
		return this.secondaryValues[keyIndex];
	}

	keySet() {
		return this.keys;
	}

	primaryValueSet() {
		return this.primaryValues;
	}

	secondaryValueSet() {
		return this.secondaryValues;
	}
}

// Creating the database of symbols
let map = new HashMap();

// Handing math character button clicks
function enterCommand(commandText) {
  mathField.typedText(commandText);
  mathField.focus();
  mathField.keystroke('Enter');
  mathField.focus();
}

function initializeMath() {
	let allKeys = map.keySet();
	let i;
	for (i = 0; i < allKeys.length; i++) {
		let k = allKeys[i];
		docEl(k).onclick = function(event) {
			enterCommand(map.getSecondary(k));
		}
		katex.render(map.getPrimary(k), docEl(k));
	}
}

// Adding basic symbols
map.put('noteq', '\\neq', '\\neq');
map.put('root', '\\sqrt{}', '\\sqrt');
map.put('appxeq', '\\approx', '\\approx');
map.put('plusminus', '\\pm', '\\pm');
map.put('subscript', 'a_n', '_');
map.put('superscript', 'a^b', '^');
map.put('multiply', '\\times', '\\times');
map.put('infinity', '\\infty', '\\infty');
map.put('lessthaneq', '\\leq', '\\leq');
map.put('greaterthaneq', '\\geq', '\\geq');
map.put('timesdot', '\\cdot', '\\cdot');
map.put('abs', '\\left|x\\right|', '|');

// Adding algebraic symbols
map.put('sum', '\\sum^{}_{}', '\\sum');
map.put('integral', '\\int', '\\int');
map.put('pi', '\\pi', '\\pi');
map.put('cappi', '\\Pi', '\\Pi');

// Adding set symbols
map.put('subset', '\\subset', '\\subset');
map.put('supset', '\\supset', '\\supset');
map.put('supset', '\\supset', '\\supset');
map.put('subseteq', '\\subseteq', '\\subseteq');
map.put('supseteq', '\\supseteq', '\\supseteq');
map.put('union', '\\cup', '\\cup');
map.put('intersection', '\\cap', '\\cap');
map.put('belongs', '\\in', '\\in');
map.put('notbelongs', '\\notin', '\\notin');
map.put('emptyset', '\\emptyset', '\\emptyset');
map.put('notsubset', '\\not\\subset', '\\notsubset');
map.put('intset', '\\mathbb{Z}', '\\integers');
map.put('realset', '\\reals', '\\reals');
map.put('compset', '\\mathbb{C}', '\\complex');
map.put('rationset', '\\mathbb{Q}', '\\rationals');
map.put('naturalset', '\\mathbb{N}', '\\naturals');

// Adding logic symbols
map.put('forall', '\\forall', '\\forall');
map.put('therefore', '\\therefore', '\\therefore');
map.put('because', '\\because', '\\because');
map.put('implies', '\\Rightarrow', '\\Rightarrow');
map.put('equivalent', '\\Leftrightarrow', '\\Leftrightarrow');
map.put('negate', '\\neg', '\\neg');
map.put('land', '\\land', '\\land');
map.put('lor', '\\lor', '\\lor');
map.put('oplus', '\\oplus', '\\oplus');
map.put('orbar', '\\vert', '\\vert');

// window.renderMathInElement(document.body);
initializeMath();