var tabindexElements = document.querySelectorAll('div[tabindex="0"]');
var i;
for (i = 0; i < tabindexElements.length; i++) {
	var el = tabindexElements[i];
	if (el.innerText === "Inline equation\nInsert mathematical symbols in text.") {
		el.focus();
		jQuery(el).click();
		break;
	}
}
// document.execCommand("insertText", false, "\\sum_{i=0}^{n}");
// jQuery(document.activeElement).dblclick();

