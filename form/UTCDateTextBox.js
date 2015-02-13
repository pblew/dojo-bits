define([
	"dojo/_base/declare",
	"dijit/form/DateTextBox"
], function(declare, DateTextBox) {
	function isValidDate(value) {
		// summary:
		//      Checks whether the passed value is a valid `Date` object
		// value: Object
		//      anything
		// returns: boolean
		//      true if `value` is a valid `Date` object, false otherwise
		// tags:
		//      private
		return value instanceof Date && isFinite(value.getTime());
	}

	function toUTCDate(value) {
		// summary:
		//      Returns a `Date` which represents the year, month and day of the passed `Date`, but with the time fields
		//      adjusted to take account of timezones and DST so that the `getUTCXXX()` methods will return the correct
		//      date fields and zeroed time fields and `toUTCString()`/`toISOString()`/`toJSON()` will return a UTC
		//      string with the correct date and the time component set to midnight.
		// value: Date
		//      the date to convert
		// returns: Date
		//      the converted date
		// tags:
		//      private
		if (isValidDate(value)) {
			value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
		}
		return value;
	}

	return declare(DateTextBox, {
		_getValueAttr : function() {
			// summary:
			//      Returns the value of the date field in a format that will serialize to `YYYY-MM-DDT00:00:00.000Z`
			//      regardless of the timezone or DST in effect on the client.
			// returns: Date
			//      UTC compatible date
			return toUTCDate(this.inherited("_getValueAttr", arguments));
		}
	});
});
