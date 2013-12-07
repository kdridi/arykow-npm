/*
 * arykow-twitter
 * https://github.com/kdridi/arykow-twitter
 *
 * Copyright (c) 2013 Karim DRIDI
 * Licensed under the MIT license.
 */
'use strict';

var q = require('q'),
	npm = require('npm');

var createPromiseCallback = function(deferred) {
	return function() {
		try {
			var parameters = [];
			Array.prototype.push.apply(parameters, arguments);

			if (parameters.length === 0) {
				deferred.reject('error is not defined');
			}
			var error = parameters.shift();

			if (error) {
				deferred.reject(error);
			} else {
				if (parameters.length === 1) {
					parameters = parameters.shift();
				}
				deferred.resolve(parameters);
			}
		} catch(error) {
			console.log('stacktrace: ' + error.stack);
			deferred.reject(error);
		}
	};
};

var createPromise = function() {
	var parameters = [];
	Array.prototype.push.apply(parameters, arguments);
	if (parameters.length === 0) {
		throw new Error('objet is not defined');
	}
	var object = parameters.shift();
	if (parameters.length === 0) {
		throw new Error('message is not defined');
	}
	var method = object[parameters.shift()];
	if (method === null) {
		throw new Error('method is not defined');
	}

	var deferred = q.defer();
	try {
		parameters.push(createPromiseCallback(deferred));
		method.apply(object, parameters);
	} catch(error) {
		console.log('stacktrace: ' + error.stack);
		deferred.reject(error);
	}

	return deferred.promise;
};

var NPM = function(delegate) {
	this.delegate = delegate;
};

NPM.prototype.search = function() {
	var parameters = [ this.delegate.commands, 'search' ];
	Array.prototype.push.apply(parameters, arguments);
	return createPromise.apply(null, parameters);
};

NPM.newInstance = function() {
	var parameters = [ npm, 'load' ];
	Array.prototype.push.apply(parameters, arguments);
	return createPromise.apply(null, parameters).then(function(delegate) {
		return new NPM(delegate);
	});
};

var SearchFunctionBuilder = function() {
	this.data = {
		options: {
			'description' : true,
			'loglevel'    : 'silent',
			'long'        : true
		},
		searchTerms: [],
		silent: true,
		staleness: 600
	};
};

SearchFunctionBuilder.prototype.options = function(options) {
	this.data.options = options;
	return this;
};

SearchFunctionBuilder.prototype.addTerms = function() {
	var data = this.data;

	var searchTerms = [];
	Array.prototype.push.apply(searchTerms, arguments);
	searchTerms.forEach(function(searchTerm) {
		if (typeof(searchTerm) === "string") {
			data.searchTerms.push(searchTerm);
		}
	});
	return this;
};

SearchFunctionBuilder.prototype.execute = function(callback) {
	var data = this.data;
	return NPM.newInstance(data.options).then(function(npm) {
		return npm.search(data.searchTerms, data.silent, data.staleness);
	}).then(function(result) {
		callback(null, result);
	}, function(error) {
		callback(error);
	});
};

exports.search = function() {
	return new SearchFunctionBuilder();
};