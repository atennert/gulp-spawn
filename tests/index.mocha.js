/*global describe, it */
"use strict";

var gSpawn = require("../"),
	Stream = require("stream"),
	gutil = require("gulp-util"),
	assert = require("assert"),
	es = require("event-stream")
;

describe("gulp-spawn", function () {

	it("should pass null files through", function (done) {

		var stream = gSpawn({
			cmd: "cat"
		});

		var n = 0;

		var fakeFile = new gutil.File({
			cwd: "/home/nfroidure/",
			base: "/home/nfroidure/test",
			path: "/home/nfroidure/test/file.js",
			contents: null
		});

		var fakeFile2 = new gutil.File({
			cwd: "/home/nfroidure/",
			base: "/home/nfroidure/test",
			path: "/home/nfroidure/test/file2.js",
			contents: null
		});

		stream.on("readable", function () {
			var newFile;
			while (newFile = stream.read()) {
				assert(newFile);
				assert.equal(newFile.cwd, "/home/nfroidure/");
				assert.equal(newFile.base, "/home/nfroidure/test");
				assert.equal(newFile.contents, null);
				if (++n === 1) {
					assert.equal(newFile.path, "/home/nfroidure/test/file.js");
				} else  {
					assert.equal(newFile.path, "/home/nfroidure/test/file2.js");
				}
			}
		});

		stream.on("end", function () {
			assert.equal(n, 2);
			done();
		});

		stream.write(fakeFile);
		stream.write(fakeFile2);
		stream.end();
	});

	describe("in stream mode", function () {

		it("should work with sync streams", function (done) {

			var stream = gSpawn({
				cmd: "cat"
			});

			var inputStream = new Stream.PassThrough({objectMode: true}),
				outputStream = new Stream.PassThrough({objectMode: true}),
				n = 0;

			var fakeFile = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file.js",
				contents: new Stream.PassThrough()
			});
			var fakeFile2 = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file2.js",
				contents: new Stream.PassThrough()
			});

			inputStream
				.pipe(stream)
				.pipe(outputStream);


			outputStream.on("readable", function () {
				var newFile;
				while (newFile = outputStream.read()) {
					assert(newFile);
					assert.equal(newFile.cwd, "/home/nfroidure/");
					assert.equal(newFile.base, "/home/nfroidure/test");
					assert(newFile.contents instanceof Stream);
					if (++n === 1) {
						assert.equal(newFile.path, "/home/nfroidure/test/file.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plipplap");
						}));
					} else  {
						assert.equal(newFile.path, "/home/nfroidure/test/file2.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plopplup");
						}));
					}
				}
			});

			outputStream.on("end", function () {
				assert.equal(n, 2);
				done();
			});

			stream.write(fakeFile);
			stream.write(fakeFile2);
			stream.end();

			fakeFile.contents.write("plip");
			fakeFile.contents.write("plap");
			fakeFile.contents.end();

			fakeFile2.contents.write("plop");
			fakeFile2.contents.write("plup");
			fakeFile2.contents.end();

		});

		it("should work with async contents streams", function (done) {

			var stream = gSpawn({
				cmd: "cat"
			});

			var inputStream = new Stream.PassThrough({objectMode: true}),
				outputStream = new Stream.PassThrough({objectMode: true}),
				n = 0;

			var fakeFile = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file.js",
				contents: new Stream.PassThrough()
			});
			var fakeFile2 = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file2.js",
				contents: new Stream.PassThrough()
			});

			inputStream
				.pipe(stream)
				.pipe(outputStream);


			outputStream.on("readable", function () {
				var newFile;
				while (newFile = outputStream.read()) {
					assert(newFile);
					assert.equal(newFile.cwd, "/home/nfroidure/");
					assert.equal(newFile.base, "/home/nfroidure/test");
					assert(newFile.contents instanceof Stream);
					if (++n === 1) {
						assert.equal(newFile.path, "/home/nfroidure/test/file.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plipplap");
						}));
					} else  {
						assert.equal(newFile.path, "/home/nfroidure/test/file2.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plopplup");
						}));
					}
				}
			});

			outputStream.on("end", function () {
				assert.equal(n, 2);
				done();
			});

			inputStream.write(fakeFile);
			inputStream.write(fakeFile2);
			inputStream.end();

			setImmediate(function () {
				fakeFile.contents.write("plip");
				setImmediate(function () {
					fakeFile.contents.write("plap");
					fakeFile.contents.end();
				});
			});

			setImmediate(function () {
				fakeFile2.contents.write("plop");
				setImmediate(function () {
					fakeFile2.contents.write("plup");
					fakeFile2.contents.end();
				});
			});

		});

		it("should work with async files streams", function (done) {

			var stream = gSpawn({
				cmd: "cat"
			});

			var inputStream = new Stream.PassThrough({objectMode: true}),
				outputStream = new Stream.PassThrough({objectMode: true}),
				n = 0;

			var fakeFile = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file.js",
				contents: new Stream.PassThrough()
			});
			var fakeFile2 = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file2.js",
				contents: new Stream.PassThrough()
			});

			inputStream
				.pipe(stream)
				.pipe(outputStream);


			outputStream.on("readable", function () {
				var newFile;
				while (newFile = outputStream.read()) {
					assert(newFile);
					assert.equal(newFile.cwd, "/home/nfroidure/");
					assert.equal(newFile.base, "/home/nfroidure/test");
					assert(newFile.contents instanceof Stream);
					if (++n === 1) {
						assert.equal(newFile.path, "/home/nfroidure/test/file.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plipplap");
						}));
					} else  {
						assert.equal(newFile.path, "/home/nfroidure/test/file2.js");
						newFile.contents.pipe(es.wait(function (err, data) {
							assert.equal(data, "plopplup");
						}));
					}
				}
			});

			outputStream.on("end", function () {
				assert.equal(n, 2);
				done();
			});

			setImmediate(function () {
				inputStream.write(fakeFile);
				fakeFile.contents.write("plip");
				setImmediate(function () {
					fakeFile.contents.write("plap");
					fakeFile.contents.end();
				});

				setImmediate(function () {
					inputStream.write(fakeFile2);
					inputStream.end();
					fakeFile2.contents.write("plop");
					setImmediate(function () {
						fakeFile2.contents.write("plup");
						fakeFile2.contents.end();
					});
				});
			});

		});

	});

	describe("in buffer mode", function () {

		it("should work", function (done) {

			var stream = gSpawn({
				cmd: "cat"
			});

			var inputStream = new Stream.PassThrough({objectMode: true}),
				outputStream = new Stream.PassThrough({objectMode: true}),
				n = 0;

			var fakeFile = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file.js",
				contents: new Buffer("plipplap")
			});
			var fakeFile2 = new gutil.File({
				cwd: "/home/nfroidure/",
				base: "/home/nfroidure/test",
				path: "/home/nfroidure/test/file2.js",
				contents: new Buffer("plipplup")
			});


			inputStream
				.pipe(stream)
				.pipe(outputStream);

			outputStream.on("readable", function () {
				var newFile;
				while (newFile = outputStream.read()) {
					assert(newFile);
					assert.equal(newFile.cwd, "/home/nfroidure/");
					assert.equal(newFile.base, "/home/nfroidure/test");
					assert(newFile.contents instanceof Buffer);
					if (++n === 1) {
						assert.equal(newFile.path, "/home/nfroidure/test/file.js");
						assert.equal(newFile.contents.toString(), "plipplap");
					} else  {
						assert.equal(newFile.path, "/home/nfroidure/test/file2.js");
						assert.equal(newFile.contents.toString(), "plipplup");
					}
				}
			});

			outputStream.on("end", function () {
				assert.equal(n, 2);
				done();
			});

			inputStream.write(fakeFile);
			inputStream.write(fakeFile2);
			inputStream.end();

		});

	});

});
