/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const ObjectMiddleware = require("../serialization/ObjectMiddleware");

class PropertiesSerializer {
	constructor(Constructor, properties, onRestored) {
		this.Constructor = Constructor;
		this.properties = properties;
		this.onRestored = onRestored;
	}

	serialize(obj, { write }) {
		for (const prop of this.properties) {
			write(obj[prop]);
		}
	}

	deserialize({ read }) {
		const obj = new this.Constructor();
		for (const prop of this.properties) {
			obj[prop] = read();
		}
		if (this.onRestored) this.onRestored(obj);
		return obj;
	}
}

module.exports = (Constructor, request, properties, onRestored) => {
	ObjectMiddleware.register(
		Constructor,
		request,
		null,
		new PropertiesSerializer(Constructor, properties, onRestored)
	);
};
