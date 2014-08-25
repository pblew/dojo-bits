define([
    "dojo/request"
], function (request) {
    return function (url, handleAs, sync) {
        // summary:
        //      Retrieves and parses a resource from the specified URL
        // url: String
        //      The resource to be retrieved
        // handleAs: String?
        //      How to parse the resource - 'text' (default), 'json', 'javascript' or 'xml'
        // sync: boolean?
        //      If true, retrieve the resource synchronously. The default is false (asynchronous)
        // returns: dojo/request.__Promise
        var deferred = request(url, {
            handleAs: handleAs || "text",
            sync: sync === true
        });
        deferred.otherwise(function (err) {
            console.error({
                message: err.message,
                status: err.response.status,
                url: err.response.url
            });
        });
        return deferred;
    }
});
