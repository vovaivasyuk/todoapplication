/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

// eslint-disable-next-line no-undef
exports.defineAutoTests = function () {

    // eslint-disable-next-line no-undef
    var isAndroid = (cordova.platformId === "android");

    // eslint-disable-next-line no-undef
    describe('Whitelist API (cordova.whitelist)', function () {

        // eslint-disable-next-line no-undef
        it("should exist", function () {
            // eslint-disable-next-line no-undef
            expect(cordova.whitelist).toBeDefined();
        });

        // eslint-disable-next-line no-undef
        describe("Match function (cordova.whitelist.match) that checks URLs against patterns", function () {
            function expectMatchWithResult(result) {
                return (function (url, patterns, description) {
                    description = description || ((result ? "should accept " : "should reject ") + url + " for " + JSON.stringify(patterns));
                    this.result = result;

                    // eslint-disable-next-line no-undef
                    describe("Match function", function () {
                        if (!isAndroid) {
                            // eslint-disable-next-line no-undef
                            pending("Whitelist Plugin only exists for Android");
                        }

                        // Timeout is 7.5 seconds to allow physical devices enough
                        // time to query the response. This is important for some
                        // Android devices.
                        var originalTimeout,
                            cb;

                        // eslint-disable-next-line no-undef
                        beforeEach(function (done) {
                            // eslint-disable-next-line no-undef
                            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                            // eslint-disable-next-line no-undef
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;
                            
                            // eslint-disable-next-line no-undef
                            cb = jasmine.createSpy('spy').and.callFake(function () {
                                done();
                            });
                            // eslint-disable-next-line no-undef
                            cordova.whitelist.match(url, patterns, cb);
                        });

                        // eslint-disable-next-line no-undef
                        afterEach(function () {
                            // eslint-disable-next-line no-undef
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                        });

                        // eslint-disable-next-line no-undef
                        it(description, function () {
                            // eslint-disable-next-line no-undef
                            expect(cb).toHaveBeenCalledWith(result);
                        });
                    });
                });
            }

            var itShouldMatch = expectMatchWithResult(true);
            var itShouldNotMatch = expectMatchWithResult(false);

            // eslint-disable-next-line no-undef
            it("should exist", function () {
                // eslint-disable-next-line no-undef
                expect(cordova.whitelist.match).toBeDefined();
                // eslint-disable-next-line no-undef
                expect(typeof cordova.whitelist.match).toBe("function");
            });

            itShouldMatch('http://www.apache.org/',     ['*'],  "should accept any domain for *");
            itShouldNotMatch('http://www.apache.org/',  [],     "should not accept any domain for []");

            itShouldMatch('http://apache.org/',                                             ['http://*.apache.org']);
            itShouldMatch('http://www.apache.org/',                                         ['http://*.apache.org']);
            itShouldMatch('http://www.apache.org/some/path',                                ['http://*.apache.org']);
            itShouldMatch('http://some.domain.under.apache.org/',                           ['http://*.apache.org']);
            itShouldMatch('http://user:pass@apache.org/',                                   ['http://*.apache.org']);
            itShouldMatch('http://user:pass@www.apache.org/',                               ['http://*.apache.org']);
            itShouldMatch('http://www.apache.org/?some=params',                             ['http://*.apache.org']);
            itShouldNotMatch('http://apache.com/',                                          ['http://*.apache.org']);
            itShouldNotMatch('http://www.evil.com/?url=www.apache.org',                     ['http://*.apache.org']);
            itShouldNotMatch('http://www.evil.com/?url=http://www.apache.org',              ['http://*.apache.org']);
            itShouldNotMatch('http://www.evil.com/?url=http%3A%2F%2Fwww%2Eapache%2Eorg',    ['http://*.apache.org']);
            itShouldNotMatch('https://apache.org/',                                         ['http://*.apache.org']);
            itShouldNotMatch('http://www.apache.org:pass@evil.com/',                        ['http://*.apache.org']);
            itShouldNotMatch('http://www.apache.org.evil.com/',                             ['http://*.apache.org']);

            itShouldMatch('http://www.apache.org/',     ['http://*.apache.org', 'https://*.apache.org']);
            itShouldMatch('https://www.apache.org/',    ['http://*.apache.org', 'https://*.apache.org']);
            itShouldNotMatch('ftp://www.apache.org/',   ['http://*.apache.org', 'https://*.apache.org']);
            itShouldNotMatch('http://www.apache.com/',  ['http://*.apache.org', 'https://*.apache.org']);

            itShouldMatch('http://www.apache.org/',         ['http://www.apache.org']);
            itShouldNotMatch('http://build.apache.org/',    ['http://www.apache.org']);
            itShouldNotMatch('http://apache.org/',          ['http://www.apache.org']);

            itShouldMatch('http://www.apache.org/',             ['http://*/*']);
            itShouldMatch('http://www.apache.org/foo/bar.html', ['http://*/*']);

            itShouldMatch('http://www.apache.org/foo',          ['http://*/foo*']);
            itShouldMatch('http://www.apache.org/foo/bar.html', ['http://*/foo*']);
            itShouldNotMatch('http://www.apache.org/',          ['http://*/foo*']);

            itShouldMatch('file:///foo', ['file:///*']);

            itShouldMatch('file:///foo',                ['file:///foo*']);
            itShouldMatch('file:///foo/bar.html',       ['file:///foo*']);
            itShouldNotMatch('file:///foo.html',        []);
            itShouldNotMatch('http://www.apache.org/etc/foo',   ['http://www.apache.org/foo*']);
            itShouldNotMatch('http://www.apache.org/foo',       ['file:///foo*']);

            itShouldMatch('http://www.apache.org/',     ['*://www.apache.org/*']);
            itShouldMatch('https://www.apache.org/',    ['*://www.apache.org/*']);
            itShouldMatch('ftp://www.apache.org/',      ['*://www.apache.org/*']);
            itShouldMatch('file://www.apache.org/',     ['*://www.apache.org/*']);
            // eslint-disable-next-line no-undef
            if (cordova.platformId == 'android')
                itShouldMatch('content://www.apache.org/', ['*://www.apache.org/*']);
            itShouldMatch('foo://www.apache.org/',      ['*://www.apache.org/*']);
            itShouldNotMatch('http://www.apache.com/',  ['*://www.apache.org/*']);

            itShouldMatch('http://www.apache.org/',     ['*.apache.org']);
            itShouldMatch('https://www.apache.org/',    ['*.apache.org']);
            itShouldNotMatch('ftp://www.apache.org/',   ['*.apache.org']);

            itShouldMatch('http://www.apache.org:81/',                          ['http://www.apache.org:81/*']);
            itShouldMatch('http://user:pass@www.apache.org:81/foo/bar.html',    ['http://www.apache.org:81/*']);
            itShouldNotMatch('http://www.apache.org:80/',                       ['http://www.apache.org:81/*']);
            itShouldNotMatch('http://www.apache.org/',                          ['http://www.apache.org:81/*']);
            itShouldNotMatch('http://www.apache.org:foo/',                      ['http://www.apache.org:81/*']);
            itShouldNotMatch('http://www.apache.org:81@www.apache.org/',        ['http://www.apache.org:81/*']);
            itShouldNotMatch('http://www.apache.org:81@www.evil.com/',          ['http://www.apache.org:81/*']);

            itShouldMatch('http://www.APAche.org/', ['*.apache.org']);
            itShouldMatch('http://WWw.apache.org/', ['*.apache.org']);
            itShouldMatch('http://www.apache.org/', ['*.APACHE.ORG']);
            itShouldMatch('HTTP://www.apache.org/', ['*.apache.org']);
            itShouldMatch('HTTP://www.apache.org/', ['http://*.apache.org']);
            itShouldMatch('http://www.apache.org/', ['HTTP://*.apache.org']);

            itShouldMatch('http://www.apache.org/foo/',         ['*://*.apache.org/foo/*']);
            itShouldMatch('http://www.apache.org/foo/bar',      ['*://*.apache.org/foo/*']);
            itShouldNotMatch('http://www.apache.org/bar/foo/',  ['*://*.apache.org/foo/*']);
            itShouldNotMatch('http://www.apache.org/Foo/',      ['*://*.apache.org/foo/*']);
            itShouldNotMatch('http://www.apache.org/Foo/bar',   ['*://*.apache.org/foo/*']);
        });

        // eslint-disable-next-line no-undef
        describe("Test function (cordova.whitelist.test) that checks against config.xml", function () {
            function expectTestWithResult(result) {
                return (function (url, description) {
                    description = description || ((result ? "should accept " : "should reject ") + url);

                    // eslint-disable-next-line no-undef
                    describe("Test function", function () {
                        if (!isAndroid) {
                            // eslint-disable-next-line no-undef
                            pending("Whitelist Plugin only exists for Android");
                        }

                        var cb,
                            originalTimeout;

                        // eslint-disable-next-line no-undef
                        beforeEach(function (done) {
                            // eslint-disable-next-line no-undef
                            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                            // eslint-disable-next-line no-undef
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;
                            // eslint-disable-next-line no-undef
                            cb = jasmine.createSpy('spy').and.callFake(function (){
                                done();
                            });
                            // eslint-disable-next-line no-undef
                            cordova.whitelist.test(url, cb);
                        });

                        // eslint-disable-next-line no-undef
                        afterEach(function () {
                            // eslint-disable-next-line no-undef
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                        });

                        // eslint-disable-next-line no-undef
                        it(description, function () {
                            // eslint-disable-next-line no-undef
                            expect(cb).toHaveBeenCalledWith(result);
                        });
                    });
                });
            }

            var itShouldAccept = expectTestWithResult(true);
            var itShouldReject = expectTestWithResult(false);

            // eslint-disable-next-line no-undef
            it("should exist", function () {
                // eslint-disable-next-line no-undef
                expect(cordova.whitelist.test).toBeDefined();
                // eslint-disable-next-line no-undef
                expect(typeof cordova.whitelist.test).toBe("function");
            });

            itShouldAccept('http://apache.org');
            itShouldAccept('http://apache.org/');
            itShouldAccept('http://www.apache.org/');
            itShouldAccept('http://www.apache.org/some/path');
            itShouldAccept('http://some.domain.under.apache.org/');
            itShouldAccept('http://user:pass@apache.org/');
            itShouldAccept('http://user:pass@www.apache.org/');
            itShouldAccept('https://www.apache.org/');

            itShouldReject('ftp://www.apache.org/');
            itShouldReject('http://www.apache.com/');
            itShouldReject('http://www.apache.org:pass@evil.com/');
            itShouldReject('http://www.apache.org.evil.com/');

            itShouldAccept('file:///foo');
            // eslint-disable-next-line no-undef
            if (cordova.platformId == 'android')
                itShouldReject('content:///foo');
        });
    });
}