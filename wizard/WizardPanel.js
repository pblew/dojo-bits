define([
	"dojo/_base/declare",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin"
], function(declare, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin) {
	return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		title : "",

		onShow : function() {
			// summary:
			//      Called when the panel is shown in a container
			// tags:
			//      extension
		},

		isValid : function() {
			// summary:
			//      Returns whether the panel is valid
			// returns: boolean
			//      true=valid, false=invalid
			// tags:
			//      extension
			return true;
		},

		_getDataAttr : function() {
			// summary:
			//      Returns the panel's data
			// returns: Object
			//      Panel's data
			// tags:
			//      extension
			return {};
		}
	});
});
