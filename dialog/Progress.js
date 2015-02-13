define([
	"dojo/_base/declare",
	"dojo/aspect",
	"dojo/dom-class",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/progress.html"
], function(declare, aspect, domClass, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString : template,

		message : "",

		_setMessageAttr : { node : "_messageNode", type : "innerHTML" },

		startup : function() {
			this.inherited(arguments);
			this._configureDialog();
		},

		_configureDialog : function() {
			// summary:
			//      Hides the title bar and ensures the dialog is destroyed when it is closed.
			// tags:
			//      private
			var dialog = this.getParent();
			domClass.add(dialog.titleBar, "dijitDisplayNone");
			dialog.own(
				aspect.after(dialog, "onHide", dialog.destroyRecursive)
			);
		}
	});
});
