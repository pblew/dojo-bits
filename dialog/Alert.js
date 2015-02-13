define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/dom-class",
	"dojo/on",
	"dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/alert.html",
	// widgets in template
	"dijit/form/Button"
], function(declare, lang, aspect, domClass, on, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	// summary:
	//	  Displays an alert dialog to the user.
	return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// templateString:			String
		//							Injected HTML template for the alert dialogue.
		templateString : template,
		startup : function() {
			// summary:
			//		Startup; register the click event handlers.
			this.inherited(arguments);
			this._registerEventHandlers();
			this._configureDialog();
		},
		_registerEventHandlers : function() {
			// summary:
			//		Register event handler for the 'OK' button.
			// tags:
			//      private
			this.own(on(this.okNode, "click", lang.hitch(this, function() {
				// Call the standard Dialog cancel functionality.
				this.getParent().onCancel();
			})));
		},
		_configureDialog : function() {
			// summary:
			//      Hides the [X] on the title bar and ensures the dialog is destroyed when it is closed.
			// tags:
			//      private
			var dialog = this.getParent();
			domClass.add(dialog.closeButtonNode, "dijitDisplayNone");
			dialog.own(
				aspect.after(dialog, "onHide", lang.hitch(dialog, function() {
					var self = this;
					setTimeout(function() {
						self.destroyRecursive();
					}, 10);
				}))
			);
		}
	});
});
