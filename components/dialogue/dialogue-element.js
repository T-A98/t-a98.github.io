class Dialogue extends HTMLElement {
  async connectedCallback() {
    // Do not render element twice
    if (this._initialized) return;
    this._initialized = true;

    this.currentTextIndex = 0;
    this.dialoguePath = "/data/dialogue.json";
    this.imagesPath = "/data/images";
    this.dialogueKey = "main";
    this.speedMs = 0;

    this.isTyping = false;
    this.cancelCurrentTyping = null;

    this.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const dialogueRes = await fetch(this.dialoguePath);

    if (!dialogueRes.ok) {
      console.error("Error while getting dialogue JSON");
      return;
    }

    this.dialogueJSON = JSON.parse(await dialogueRes.text());

    this.dialogueShadow = this.attachShadow({ mode: "open" });
    const url = this.getAttribute("src") || "dialogue-element.html";

    const res = await fetch(url);
    if (!res.ok) {
      this.dialogueShadow.innerHTML = `<p>Component couldn't be loaded (${url}).</p>`;
      return;
    }

    this.dialogueShadow.innerHTML = await res.text();
    this.dialogueShadow.getElementById("prevBtn").style.visibility = "hidden";
    this.dialogueShadow.getElementById("imageBtn").style.visibility = "hidden";

    this._typeDialogue(this._getCurrentTextData()?.text); // TODO: create method to get text
  }

  changeText(bNext = true) {
    if (this.isTyping) {this.speedMs = 1; return;}
    bNext
      ? this.currentTextIndex <
        this.dialogueJSON[this.dialogueKey]["steps"].length - 1
        ? this.currentTextIndex++
        : null
      : this.currentTextIndex > 0
        ? this.currentTextIndex--
        : null;

    this._typeDialogue(this._getCurrentTextData()?.text);

    if (this._getCurrentTextData()?.image) {
      this.dialogueShadow.getElementById("imageBtn").style.visibility =
        "visible";
    } else {
      this.dialogueShadow.getElementById("imageBtn").style.visibility =
        "hidden";
    }

    this.dialogueShadow.getElementById("prevBtn").style.visibility =
      this.currentTextIndex > 0 ? "visible" : "hidden";
    this.dialogueShadow.getElementById("nextBtn").style.visibility =
      this.currentTextIndex <
      this.dialogueJSON[this.dialogueKey]["steps"].length - 1
        ? "visible"
        : "hidden";
  }

  _getDialogueTextContainer() {
    return this.dialogueShadow.getElementById("dialogueTextContainer");
  }

  _getDialogueTextParagraph() {
    return this.dialogueShadow.getElementById("dialogueTextParagraph");
  }

  _getCurrentTextData() {
    return this.dialogueJSON[this.dialogueKey]["steps"][this.currentTextIndex];
  }

  _addToParagraph(text = "") {
    const paragraph = this._getDialogueTextParagraph();

    paragraph.innerText = text;
  }

  openImage(src = this._getCurrentTextData()?.image) {
    const imagePath = "/data/images/",
      imageElement = this.dialogueShadow.getElementById("full-image"),
      fullImageContainer = this.dialogueShadow.getElementById("image-viewer");
    imageElement.src = imagePath + src;
    fullImageContainer.hidden = false;
    fullImageContainer.style.display = "block";
  }

  closeViewer() {
    const fullImageContainer =
      this.dialogueShadow.getElementById("image-viewer");
    fullImageContainer.hidden = true;
    fullImageContainer.style.display = "none";
  }

  async _typeDialogue(text, speedMs = 30) {
    const dialogueParagraph = this._getDialogueTextParagraph();
    this.speedMs = speedMs;

    if (this.cancelCurrentTyping) {
      skipped = true;
    }

    this.isTyping = true;
    dialogueParagraph.textContent = "";

    let skipped = false;

    for (let i = 0; i < text.length; i++) {
      if (skipped) {
        dialogueParagraph.textContent = text;
        break;
      }

      const char = text[i];
      dialogueParagraph.textContent += char;

      // Pause for dots, exclamation and question marks
      let delay = this.speedMs;
      if (this._isPauseChar(char)) delay = this.speedMs * 5;
      else if (char === ",") delay = this.speedMs * 3;
      else if (char === "\n") delay = this.speedMs * 20;

      await this.sleep(delay);
    }

    this.isTyping = false;
    this.cancelCurrentTyping = null;
  }

  _isPauseChar(char) {
    return (
       char === "." || char === "!" || char === "?"
    );
  }
}

customElements.define("dialogue-element", Dialogue);
