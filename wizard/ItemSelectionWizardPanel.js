define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dojo/when",
	"./WizardPanel",
	"dojo/text!./templates/itemSelectionWizardPanel.html",
	// widgets in the template
	"dijit/form/Button",
	"dgrid/OnDemandGrid",
	"dgrid/Selection",
	"dgrid/extensions/DnD"
], function(declare, lang, on, Memory, Observable, when, WizardPanel, template) {

	function _selectionTracker(context, list, button) {
		// summary:
		//      Tracks how many list items are selected and enables a button if it is greater than zero.
		// context: Destroyable
		//      The widget which owns this tracker
		// list: OnDemandGrid
		//      The list which is being tracked
		// button: Button
		//      The button to be enabled/disabled
		// tags:
		//      private
		var selected = 0;
		context.own(
			list.on("dgrid-select", function(event) {
				selected += event.rows.length;
				button.set("disabled", selected === 0);
			}),
			list.on("dgrid-deselect", function(event) {
				selected -= event.rows.length;
				button.set("disabled", selected === 0);
			})
		);
	}

	function _moveSelectedItems(fromList, toList) {
		// summary
		//      Moves selected items from one list to another
		// fromList: OnDemandGrid
		//      List from which to move selected items
		// toList: OnDemandGrid
		//      List into which selected items are to be moved
		// tags:
		//      private
		var fromStore = fromList.get("store"),
			toStore = toList.get("store"),
			itemIds = fromList.get("selection");
		for (var itemId in itemIds) {
			if (itemIds[itemId] === true) {
				var item = fromStore.get(itemId);
				toStore.add(item);
				fromStore.remove(itemId);
			}
		}
	}

	return declare([WizardPanel], {
		templateString : template,

		// sourceStore: dojo/store/api/Store
		//      Store from which available items will be sourced
		// tags:
		//      extension
		sourceStore: null,

		// noItemsAvailablePrompt: String
		//      Prompt to show in the 'Available' panel when nothing is available
		noItemsAvailablePrompt: "No items available",

		// dragPrompt: String
		//      Prompt to show in the 'Selected' panel when nothing is selected
		dragPrompt: "Drag items here",

		// returnPropertyName: String
		//      Property name under which to provide the IDs of the selected items in object returned from `get("data")`
		returnPropertyName: "selection",

		postCreate : function() {
			// summary:
			//      Registers event handlers and attaches remote stores
			this.inherited(arguments);
			this._registerEventHandlers();
			this._setupStores();
		},

		_getDataAttr : function() {
			var storeData = this._selectedStore.data,
				selectedIds = [];
			for (var item in storeData) {
				selectedIds.push(storeData[item].id);
			}
			var data = {};
			data[this.returnPropertyName] = selectedIds;
			return data;
		},

		_registerEventHandlers : function() {
			// summary:
			//		Register event handlers.
			// tags:
			//      private
			_selectionTracker(this, this._availableItems, this._addToSelectionButton);
			_selectionTracker(this, this._selectedItems, this._removeFromSelectionButton);
			this.own(
				on(this._addToSelectionButton, "click", lang.hitch(this, this._onAddToSelectionClicked)),
				on(this._removeFromSelectionButton, "click", lang.hitch(this, this._onRemoveFromSelectionClicked))
			);
		},

		_onAddToSelectionClicked : function() {
			// summary:
			//      Adds selected items to the selected list
			// tags:
			//      private
			_moveSelectedItems(this._availableItems, this._selectedItems);
		},

		_onRemoveFromSelectionClicked : function() {
			// summary:
			//      Removes selected items from the selected list
			// tags:
			//      private
			_moveSelectedItems(this._selectedItems, this._availableItems);
		},

		_setupStores : function() {
			// summary:
			//      Initialises the stores which back the 'available' and 'selected' lists
			// tags:
			//      private
			var self = this,
				availableItems = [];
			when(this.sourceStore.query({})).then(function(queryResults) {
				queryResults.forEach(function(item) {
					availableItems.push({
						"id" : item.id,
						"name" : item.name
					});
				});

				self._availableStore = new Observable(new Memory({
					data : availableItems
				}));
				self._availableItems.set("store", self._availableStore);

				self._selectedStore = new Observable(new Memory({
					data : []
				}));
				self._selectedItems.set("store", self._selectedStore);
			});
		}
	});
});
