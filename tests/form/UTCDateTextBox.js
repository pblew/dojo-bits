define([
	"doh/main",
	"dojo/json",
	"dojo-bits/form/UTCDateTextBox"
], function (doh, json, UTCDateTextBox) {
	var classUnderTest = null;
	
	function setUp(dateValue) {
		classUnderTest = new UTCDateTextBox({});
		classUnderTest.set("value", dateValue);
	}
	
	function tearDown() {
		classUnderTest.destroyRecursive();
		classUnderTest = null;
	}
	
	doh.register("UTCDateTextBox Tests", [{
		name : "Get with null date",
		setUp : function() {
			setUp(null);
		},
		runTest : function() {
			doh.assertEqual(null, classUnderTest.get("value"));
		},
		tearDown : function() {
			tearDown();
		}
	}, {
		name : "Get with non-date",
		setUp : function() {
			setUp("X");
		},
		runTest : function() {
			doh.assertEqual(null, classUnderTest.get("value"));
		},
		tearDown : function() {
			tearDown();
		}
	}, {
		name : "Get with invalid date",
		setUp : function() {
			setUp(new Date("X"));
		},
		runTest : function() {
			doh.assertEqual(null, classUnderTest.get("value"));
		},
		tearDown : function() {
			tearDown();
		}
	}, {
		name : "Get with GMT date",
		setUp : function() {
			setUp(new Date(2014, 2, 11)); // 11th March, 2014
		},
		runTest : function() {
			doh.assertEqual("\"2014-03-11T00:00:00.000Z\"", json.stringify(classUnderTest.get("value")));
		},
		tearDown : function() {
			tearDown();
		}
	}, {
		name : "Get with BST date",
		setUp : function() {
			setUp(new Date(2014, 4, 12)); // 12th May, 2014
		},
		runTest : function() {
			doh.assertEqual("\"2014-05-12T00:00:00.000Z\"", json.stringify(classUnderTest.get("value")));
		},
		tearDown : function() {
			tearDown();
		}
	}]);
});
