/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const BinaryMiddleware = require("./BinaryMiddleware");
const FileMiddleware = require("./FileMiddleware");
const ObjectMiddleware = require("./ObjectMiddleware");
const TextMiddleware = require("./TextMiddleware");

class Serializer {
	constructor() {
		this.middlewares = [
			new ObjectMiddleware(),
			new BinaryMiddleware(),
			new FileMiddleware()
		];
	}

	serializeToFile(obj, filename) {
		const context = {
			filename
		};
		return Promise.resolve(
			this.middlewares.reduce(
				(last, middleware) => {
					if (last instanceof Promise)
						return last.then(data => middleware.serialize(data, context));
					else return middleware.serialize(last, context);
				},
				[obj]
			)
		);
	}

	deserializeFromFile(filename) {
		const context = {
			filename
		};
		return Promise.resolve(
			this.middlewares
				.slice()
				.reverse()
				.reduce((last, middleware) => {
					if (last instanceof Promise)
						return last.then(data => middleware.deserialize(data, context));
					else return middleware.deserialize(last, context);
				}, [])
		).then(array => array[0]);
	}
}

module.exports = Serializer;
