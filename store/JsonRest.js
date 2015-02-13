define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/request",
	"dojo/store/JsonRest"
], function(declare, lang, request, JsonRest) {
	// summary:
	//      An extension of `dojo/store/JsonRest` which
	//      * allows GET requests to work when `target` does not have a trailing '/'
	//      * uses `dojo/request` rather than the deprecated `dojo/_base/xhr`
	return declare(JsonRest, {
		// accepts: String
		//		Defines the Accept header to use on HTTP requests
		accepts : "application/json",

		get : function(id, options) {
			// summary:
			//		Retrieves an object by its identity. This will trigger a GET request to the server using
			//		the url `this.target [+ "/"] + id`.
			// id: Number
			//		The identity to use to lookup the object
			// options: Object?
			//		HTTP headers. For consistency with other methods, if a `headers` key exists on this object, it will be
			//		used to provide HTTP headers instead.
			// returns: Object
			//		The object in the store that matches the given id.
			options = options || {};
			var headers = lang.mixin({ Accept : this.accepts }, this.headers, options.headers || options);
			return request.get(
				this._buildUrl(this.target, id),
				{
					handleAs : "json",
					headers : headers
				}
			);
		},

		_buildUrl : function(target, id) {
			// summary:
			//      Returns a URL built from `target` and `id` with a '/' inserted if required
			// target: String
			//      Base URL for resource
			// id: Number
			//      identity to be appended
			// returns: String
			//      valid URL
			// tags:
			//      private
			var url = target + id;
			if (!/\/$/.test(target)) {
				url = target + "/" + id;
			}
			return url;
		}

	});
});
