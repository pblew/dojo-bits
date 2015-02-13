define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/dom-class",
	"dojo/on",
	"dijit/Dialog",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"./WizardPanel",
	"dojo/text!./templates/wizardContainer.html",
	// widgets in template
	"dijit/layout/StackContainer",
	"dijit/form/Button"
], function(declare, array, lang, aspect, domClass, on, Dialog, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, WizardPanel, template) {
	return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,
		doLayout: false,
		panels: [],

		postCreate : function() {
			this.inherited(arguments);
			this._registerButtonNavigationHandlers();
			this._addPanels();
		},

		_addPanels : function() {
			// summary:
			//      Adds panels defined in `this.panels` to the container node
			// tags:
			//      private
			array.forEach(this.panels, function(panelDetail) {
				var panel = new panelDetail.type(lang.mixin({
					title: panelDetail.title,
					container: this
				}, this.params));
				if (panel.isInstanceOf(WizardPanel)) {
					this.containerNode.addChild(panel, "last");
				} else {
					console.error(panel, "is not an instance of WizardPanel");
				}
			}, this);
			this._panelIndex = 0;
		},

		_registerButtonNavigationHandlers : function() {
			this.own(
				on(this._btnCancel, "click", lang.hitch(this, this._onCancelClicked)),
				on(this._btnPrevious, "click", lang.hitch(this, this._onPreviousClicked)),
				on(this._btnNext, "click", lang.hitch(this, this._onNextClicked)),
				on(this._btnFinish, "click", lang.hitch(this, this._onFinishClicked)),
				this.containerNode.watch("selectedChildWidget", lang.hitch(this, this._onPanelChanged))
			)
		},

		_onCancelClicked : function() {
			// summary:
			//      Hides (and destroys) the dialog
			// tags:
			//      private
			this.dialog.hide();
		},

		_onPreviousClicked : function() {
			// summary:
			//      Returns to the previous panel
			// tags:
			//      private
			this._panelIndex--;
			this._updateButtons();
			this.containerNode.back();
		},

		_onNextClicked : function() {
			// summary:
			//      Checks the current panel is valid.  If it is, advance to the next panel
			// tags:
			//      private
			if (this.get("currentPanel").isValid()) {
				this._panelIndex++;
				this._updateButtons();
				this.containerNode.forward();
			}
		},

		_onFinishClicked : function() {
			// summary:
			//      Checks the current panel is valid.  If it is, call the wizard's `onFinish` method
			// tags:
			//      private
			if (this.get("currentPanel").isValid()) {
				this.onFinish(this.get("data"));
			}
		},

		startup : function() {
			// summary:
			//      Applies `Dialog` customisations
			this.inherited(arguments);
			this.dialog = this.getParent();
			this._configureDialog(this.dialog);
			this._configureButtons();
			this._updateButtons();
			this._onPanelChanged("selectedChildWidget", null, this.get("currentPanel"));
		},

		onFinish : function(data) {
			// summary:
			//      Called when all panels are valid and the `Finish` button is clicked
			// data: Object
			//      Compound data from the data attributes of each panel
			// tags:
			//      extension
		},

		_configureDialog : function(dialog) {
			// summary:
			//      Hides the [X] on the title bar and ensures the dialog is destroyed when it is closed.
			// dialog: dijit/Dialog
			//      The `Dialog` which contains this wizard
			// tags:
			//      private
			if (dialog instanceof Dialog) {
				domClass.add(dialog.closeButtonNode, "dijitDisplayNone");
				dialog.own(
					aspect.after(dialog, "onHide", function() {
						setTimeout(function() {
							dialog.destroyRecursive();
						}, 10);
					})
				);
			}
		},

		_configureButtons : function() {
			// summary:
			//      Hides the 'Previous' and 'Next' buttons if there is only one panel
			// tags:
			//      private
			if (this.get("numPanels") < 2) {
				domClass.add(this._btnPrevious.domNode, "dijitDisplayNone");
				domClass.add(this._btnNext.domNode, "dijitDisplayNone");
			}
		},

		_onPanelChanged : function(propertyName, oval, nval) {
			// summary:
			//      Updates the container title when the selected panel changes and calls the new panel's onShow()
			//      function.
			// propertyName: String
			//      Name of the property which changed - ie. "selectedChildWidget"
			// oval: WizardPanel
			//      Old `WizardPanel`
			// nval: WizardPanel
			//      New `WizardPanel`
			// tags:
			//      private
			this.set("title", nval.get("title"));
			nval.onShow();
		},

		_updateButtons : function() {
			// summary:
			//      Enables/disabled the 'Previous' and 'Next' buttons depending on the current panel index
			// tags:
			//      private
			if (this.get("numPanels") < 2) {
				return;
			}
			var panelIdx = this._panelIndex;
			this._btnPrevious.set("disabled", (panelIdx === 0));
			var isLastPanel = (panelIdx === this.get("numPanels") - 1);
			this._btnNext.set("disabled", isLastPanel);
			this._btnFinish.set("disabled", !isLastPanel);
		},

		_getCurrentPanelAttr : function() {
			// summary:
			//      Returns the currently visible panel
			// returns: WizardPanel
			//      Currently visible panel
			return this.containerNode.get("selectedChildWidget");
		},

		_getNumPanelsAttr : function() {
			// summary:
			//      Returns the number of panels in the wizard
			// returns: Number
			//      Count of panels
			return this.containerNode.getChildren().length;
		},

		// title: String
		//      Wizard title
		_setTitleAttr : { node: "titleNode", type: "innerHTML"},

		_getDataAttr : function() {
			// summary:
			//      Accumulates the `data` attribute of all panels
			// returns: Object
			//      Data from all panels as a single object
			var data = {};
			array.forEach(this.containerNode.getChildren(), function(panel) {
				data = lang.mixin(data, panel.get("data"));
			}, this);
			return data;
		}

	});
});
