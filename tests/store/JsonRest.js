define([
	"doh/main",
	"dojo-bits/store/JsonRest"
], function(doh, JsonRest) {
	var classUnderTest = null;
	doh.register("JsonRest Tests", [{
		name : "buildUrl - no trailing slash",
		setUp : function() {
			classUnderTest = new JsonRest();
		},
		runTest : function() {
			doh.assertEqual("/api/42", classUnderTest._buildUrl("/api", 42));
		},
		tearDown : function() {
			classUnderTest = null;
		}
	}, {
		name : "buildUrl - trailing slash",
		setUp : function() {
			classUnderTest = new JsonRest();
		},
		runTest : function() {
			doh.assertEqual("/api/42", classUnderTest._buildUrl("/api/", 42));
		},
		tearDown : function() {
			classUnderTest = null;
		}
	}]);
});
