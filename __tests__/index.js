const index = require('../graphql/index')

describe("hello", () => {
    test("it should return hello", () => {
        expect(index.hello()).toBe("hello");
    })
})