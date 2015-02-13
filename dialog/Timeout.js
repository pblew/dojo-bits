define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/on",
	"dojo/topic",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"../topics",
	"dojo/text!./templates/timeout.html",
	// widgets in template
	"dijit/form/Button"
], function(declare, lang, aspect, domClass, domStyle, on, topic, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, topics, template) {
	// summary:
	//	  Displays an timeout dialog to the user.
	return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString : template,

		durationSeconds : 60,

		remaining : 0,

		startup : function() {
			// summary:
			//		Startup; register the click event handlers.
			this.inherited(arguments);
			this._registerEventHandlers();
			this._configureDialog();
			this._originalTitle = this.get("pageTitle");
			domStyle.set(this._secondsToGo, {
				width : (0.6 * String(this.durationSeconds).length) + "em"
			});
		},

		destroy : function() {
			this.clearTimer();
			this.inherited(arguments);
		},

		_registerEventHandlers : function() {
			// summary:
			//		Register event handlers for the 'Continue Session' and 'Logout' buttons.
			// tags:
			//      private
			this.own(
				on(this._continueNode, "click", lang.hitch(this, this._timeoutReset)),
				on(this._logoutNode, "click", lang.hitch(this, this._timeoutExpire))
			);
		},

		_configureDialog : function() {
			// summary:
			//      Hides the [X] on the title bar and ensures the dialog is destroyed when it is closed.
			// tags:
			//      private
			var dialog = this.getParent();
			domClass.add(dialog.closeButtonNode, "dijitDisplayNone");
			dialog.own(
				aspect.after(dialog, "onHide", dialog.destroyRecursive)
			);
		},

		_timeoutReset : function() {
			// summary:
			//      Cancels the countdown timer, resets the page title and inactivity timer and closes the dialogue.
			this.clearTimer();
			this.set("pageTitle", this._originalTitle);
			topic.publish(topics.TIMEOUT_RESET);
			this.getParent().hide();
		},

		_timeoutExpire : function() {
			// summary:
			//      Resets the page title and notifies that the timeout has expired.
			this.clearTimer();
			this.set("pageTitle", this._originalTitle);
			topic.publish(topics.TIMEOUT_EXPIRED);
		},

		runTimer : function() {
			// summary:
			//      Runs the timer for automatic logout from this dialogue.
			this.setRemaining(0 + this.durationSeconds, true);
			this._countdown = setInterval(lang.hitch(this, this._onTimerTick), 1000);
		},

		_onTimerTick : function() {
			// summary:
			//      Decrements `remaining` by one second. If `remaining` reaches zero then the timer is cancelled and
			//      the user logged out.
			if (this.setRemaining(-1) === 0) {
				this._timeoutExpire();
			}
		},

		clearTimer : function() {
			// summary:
			//      Clears the countdown timer if it exists
			if (this._countdown) {
				this._countdown = clearInterval(this._countdown);
			}
		},

		setRemaining : function(value, isAbsolute) {
			// summary:
			//      sets `remaining` and updates related UI elements
			// value: Number
			//      delta or absolute value
			// isAbsolute: boolean?
			//      true - `value` is an absolute value, otherwise `value` is a delta
			// returns: Number
			//      new value for `remaining`
			var remaining = this.get("remaining");
			if (isAbsolute === true) {
				remaining = value;
			} else {
				remaining += value;
			}
			this.set("pageTitle", this._originalTitle + " - logout in " + remaining + "s");
			this.set("remaining", remaining);
			return remaining;
		},

		// _setRemainingAttr: Number
		//      Binds the value of the `remaining` attribute to the content of the `_secondsToGo` node
		_setRemainingAttr : { node : "_secondsToGo", type : "innerHTML" },

		// pageTitle: String
		//      The page title
		_setPageTitleAttr : function(newTitle) {
			document.title = newTitle;
		},
		_getPageTitleAttr : function() {
			return document.title;
		}
	});
});
