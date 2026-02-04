import { LAYOUT_CARD_SELECTOR_OPTIONS } from "../helpers";

customElements.whenDefined("hui-view-editor").then(() => {
  const HuiViewEditor = customElements.get("hui-view-editor");

  // Don't patch if already patched by stock layout-card or ourselves
  if (HuiViewEditor.prototype._layoutCardImprovedPatched) return;
  HuiViewEditor.prototype._layoutCardImprovedPatched = true;

  const firstUpdated = HuiViewEditor.prototype.firstUpdated;
  HuiViewEditor.prototype.firstUpdated = function () {
    firstUpdated?.bind(this)();

    // Only patch schema if not already patched
    if (!this._oldSchema) {
      this._oldSchema = this._schema;
      this._schema = (...arg) => {
        const retval = this._oldSchema(...arg);
        const typeSelector = retval.find((e) => e.name === "type");
        
        // If we can't find the type selector, return unchanged
        if (!typeSelector || !typeSelector.selector?.select?.options) {
          return retval;
        }

        // Only add our options if they don't already exist
        if (
          !typeSelector.selector.select.options.find(
            (option) => option.value === LAYOUT_CARD_SELECTOR_OPTIONS[0].value
          )
        ) {
          typeSelector.selector.select.options.push(
            ...LAYOUT_CARD_SELECTOR_OPTIONS
          );
        }

        // Add layout field if it doesn't exist
        if (retval.find((e) => e.name === "layout") === undefined) {
          retval.push({
            name: "layout",
            selector: { object: {} },
          });
        }
        
        return retval;
      };
    }

    // Only add help link if not already added
    if (!this.shadowRoot.querySelector(".layout-card-improved-help")) {
      const helpLink = document.createElement("p");
      helpLink.className = "layout-card-improved-help";
      helpLink.innerHTML = `
        You have layout-card-improved installed which adds enhanced layout options with sections and custom CSS.<br/>
          <style>
            p.layout-card-improved-help {padding: 16px 0 0; margin-bottom: 0;}
            p.layout-card-improved-help a {color: var(--primary-color);}
          </style>
      `;
      this.shadowRoot.appendChild(helpLink);
    }
    
    this.requestUpdate();
  };
});
