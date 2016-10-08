// support browser <script src="">
// support common.js, node.js, browserify: require('');
// support ES5
// do not use ES6 (ES2015) or later

//  var request = require('light-request');
//  p = request(method, [options], uri, [data]);
//     method: GET, POST, PUT, DELETE

//  p = request.get([options], uri);
//  p = request.post([options], uri, [data]);
//  p = request.put([options], uri, [data]);
//  p = request.del([options], uri, [data]);
//  p = request.delete([options], uri, [data]);

//  options: {headers: {'x-get-data': true}}

(this || {}).request = function () {
	'use strict';

	var request, deps;
	try {
		new XMLHttpRequest;
		deps = {readyState: [
			'0: UNSENT, uninitialized: not open',
			'1: OPENED, loading: not send',
			'2: HEADERS_RECEIVED, loaded: status & headers',
			'3: LOADING, interactive: download in progress',
			'4: DONE, complete']};
		request = requestXHR;
	}
	catch (e) {
		deps = {parseURL: require('url').parse,
			'http:': require('http'),
			'https:': require('https')};
		request = requestHTTP;
	}

	if (typeof module === 'object' && module.exports)
		module.exports = request;

	//request.setDefaultHeaders(headers)
	request.get  = function (opts, uri, data) { return request('GET',    opts, uri, data); };
	request.post = function (opts, uri, data) { return request('POST',   opts, uri, data); };
	request.put  = function (opts, uri, data) { return request('PUT',    opts, uri, data); };
	request.del  = function (opts, uri, data) { return request('DELETE', opts, uri, data); };
	request['delete'] = request.del;

	return request;

	function requestXHR(method, options, uri, data) {
		if (typeof options === 'string')
			data = uri, uri = options, options = {};
		var start = new Date;
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest;
			xhr.onreadystatechange = function () {
				//console.log('time:', (new Date - start) / 1000, 'sec, State:',
				//	deps.readyState[xhr.readyState]);
				if (xhr.readyState === 4) {
					if (xhr.status < 400) {
						var res = {statusCode: xhr.status,
							statusMessage: xhr.statusText,
							body: xhr.response};
						//xhr.getResponseHeader()
						res.headers = xhr.getAllResponseHeaders();
						res.responseURL = xhr.responseURL;
						res.type = xhr.responseType;
						try {
							if (typeof res.body === 'string')
								res.body = JSON.parse(res.body);
						} catch (e) {}
						resolve(res);
					}
					else reject(new Error('Status ' + xhr.status + ': ' + xhr.statusText));
				}
			}
			xhr.onerror = reject;
			xhr.open(method, uri, true);
			if (options && options.headers)
				for (var i in options.headers)
					try { xhr.setRequestHeader(i, options.headers[i]); }
					catch (e) { console.error(e); }
			if (typeof data !== 'undefined') {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(data));
			}
			else xhr.send();
		}); // new Promise
	} // requestXHR

	function requestHTTP(method, options, uri, data) {
		if (typeof options === 'string')
			data = uri, uri = options, options = {};
		return new Promise(function (resolve, reject) {
			var opts = deps.parseURL(uri);
			opts.method = method;
			opts.headers = {};
			if (options && options.headers)
				for (var i in options.headers)
					opts.headers[i] = options.headers[i];

			if (typeof data !== 'undefined') {
				opts.headers['Content-Type'] = 'application/json';
				data = JSON.stringify(data);
			}

			var req = deps[opts.protocol].request(opts, function (res) {
				var bufs = [];
				res.on('data', function (buf) { bufs.push(buf); });
				res.on('end', function () {
					res.body = Buffer.concat(bufs).toString();
					try { res.body = JSON.parse(res.body); } catch (e) {}
					resolve(res);
				});
			});
			if (typeof data !== 'undefined') req.write(data);
			req.end();
		}); // new Promise
	} // requestHTTP

} ();

// http://js-next.hatenablog.com/entry/2013/11/28/093230
// https://ja.wikipedia.org/wiki/XMLHttpRequest
// https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest
// https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
// http://www.html5rocks.com/ja/tutorials/es6/promises/
