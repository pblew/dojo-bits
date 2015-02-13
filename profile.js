var profile = (function () {
    var testResourceRe = /^dojo-bits\/tests\//,

        copyOnly = function (filename, mid) {
            var list = {
                "profile": 1,
                "package.json": 1
            };
            return (mid in list) || (/^dojo-bits\/resources\//.test(mid) && !/\.css$/.test(filename)) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
        };

    return {
        resourceTags: {
            test: function (filename, mid) {
                return testResourceRe.test(mid);
            },

            copyOnly: function (filename, mid) {
                return copyOnly(filename, mid);
            },

            amd: function (filename, mid) {
                return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
//            },
//
//            miniExclude: function (filename, mid) {
//                return /^dijit\/bench\//.test(mid) || /^dijit\/themes\/themeTest/.test(mid);
            }
        }
    };
})();



