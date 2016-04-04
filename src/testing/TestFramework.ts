/// <reference path="../logger/LoggerInterface.ts" />

namespace Blend.testing {

    export interface TestConfig {
        name: string;
        testFn: (t: TestRunner) => void;
        pass: number;
        fail: number;
        testn?: number;
    }

    export class TestRunner {

        /**
         * The index of the next test case
         */
        nextTestIndex: number;

        /**
         * Reference to the current test
         */
        currentTest: TestConfig;

        /**
         * list of defined tests
         */
        private tests: Array<TestConfig>;

        /**
         * Indicates whether the test is started
         */
        testStarted: boolean = false;

        /**
         * Refenece to a Logger implementation
         */
        private logger: Blend.logger.LoggerInterface

        /**
         * @constructor
         */
        constructor(logger: Blend.logger.LoggerInterface) {
            var me = this;
            me.tests = [];
            me.logger = logger;
            me.nextTestIndex = 0;
        }

        /**
         * defineTest can de used to define a test
         */
        public defineTest(name: string, fn: (t: TestRunner) => void) {
            var me = this;
            me.tests.push({
                name: name,
                testFn: fn,
                pass: 0,
                fail: 0,
                testn: 0
            });

        }

        /**
         * Kick start the test 
         */
        public run() {

            var me = this;
            if (console && console.clear) {
                console.clear();
            }

            window.onerror = <ErrorEventHandler>function(errorMsg: string, url: string, fileNo: number, lineNumber: number) {
                me.logger.error(errorMsg, { url: url, line: lineNumber });
            }

            var doCallback = function() {
                if (!me.testStarted) {
                    me.removeEventListener(document, 'DOMContentLoaded', doCallback);
                    me.removeEventListener(window, 'load', doCallback);
                    me.testStarted = true;
                    if (me.tests.length !== 0) {
                        me.logger.open();
                        me.runNextTest();
                    } else {
                        me.logger.warn("No tests to run!");
                    }
                }
            }

            if (document.readyState === "complete") {
                setTimeout(doCallback, 5);
            } else {
                me.addEventListener(document, 'DOMContentLoaded', doCallback);
                me.addEventListener(window, 'load', doCallback);
            }
        }

        public assertTrue(actual: boolean, assertDescription?: string) {
            var me = this;
            if (actual !== true) {
                me.fail(`Failed to assert that ${actual} is TRUE!`, actual, true, assertDescription);
            } else {
                me.pass(assertDescription);
            }
        }
        
        public assertFalse(actual: boolean, assertDescription?: string) {
            var me = this;
            if (actual !== false) {
                me.fail(`Failed to assert that ${actual} is FALSE!`, actual, true, assertDescription);
            } else {
                me.pass(assertDescription);
            }
        }
        

        /**
         * Logs a test as failed
         */
        private fail(failMessage: string, actual: any, expected: any, assertDescription?: string) {
            var me = this;
            me.logger.log("fail", failMessage, {
                test: me.currentTest.name,
                assert: assertDescription || 'Test #' + me.currentTest.testn,
                actual: actual,
                expected: expected,
                failMessage: failMessage
            });
            me.currentTest.testn++;
            me.currentTest.fail++;
        }

        /**
         * Logs a test as passed
         */
        private pass(assertDescription?: string) {
            var me = this;
            me.logger.log("pass", assertDescription || 'Test #' + me.currentTest.testn);
            me.currentTest.testn++;
            me.currentTest.pass++;
        }

        /**
         * Should be called after a test is done to let the test runner to continue
         */
        done() {
            var me = this;
            if (me.currentTest.pass === 0 && me.currentTest.fail === 0) {
                me.logger.warn(`Nothing was tested in [${me.currentTest.name}]!`);
            }
            me.nextTestIndex++;
            me.runNextTest();
        }

        /**
         * Runs the next test from the defined tests
         */
        private runNextTest() {
            var me = this;
            me.currentTest = me.tests[me.nextTestIndex];
            if (me.currentTest) {
                me.currentTest.testFn.apply(me, [me]);
            } else {
                me.testFinished();
            }
        }

        /**
         * Called when all tests are ran.
         */
        private testFinished() {
            var me = this;
            me.logger.info("No more tests to run in this group.");
            me.logger.close();
        }

        /**
         * Adds an event listener
         */
        private addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        /**
         * Removes an event listener
         */
        private removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }

    }
}
