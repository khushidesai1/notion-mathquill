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

// Math field and character buttons
var MQ = MathQuill.getInterface(2);
var mathSpan = document.getElementById("math-field");
var mathField = MQ(mathSpan);

// Character insert buttons

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