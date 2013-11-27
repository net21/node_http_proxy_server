var
    url = require('url'),
    http = require('http'),
    port = 8888,
    proxy = http.createServer().listen(port);
    console.log('Server listened on ' + port + '...');
    
proxy.on('request', function(request, response) {
    console.log('request ' + request.url);
    request.pause();
    var options = url.parse(request.url);
    options.headers = request.headers;
    options.method = request.method;
    options.agent = false;

    var connector = http.request(options, function(serverResponse) {
        serverResponse.pause();
        response.writeHeader(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(response);
        serverResponse.resume();
    });
    
    connector.on('error', function () {
        console.log('connector retry error');
    });
    request.pipe(connector);
    request.resume();
});

