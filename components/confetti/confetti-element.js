class Confetti extends HTMLElement {
  async connectedCallback() {
    // Verhindert doppeltes Rendern, falls das Element verschoben wird
    if (this._initialized) return;
    this._initialized = true;

    const shadow = this.attachShadow({ mode: 'open' });
    const url = this.getAttribute('src') || 'confetti-element.html';

    const res = await fetch(url);
    if (!res.ok) {
      shadow.innerHTML = `<p>Component couldn't be loaded (${url}).</p>`;
      return;
    }

    shadow.innerHTML = await res.text();
  }
}

customElements.define('confetti-element', Confetti);