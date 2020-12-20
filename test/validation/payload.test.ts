import {
    isConfiguration,
    isConfigurationValue,
} from "../../src/validation/payload";

describe("Validation", () => {
    describe("Configuration", () => {
        test("An empty object is not valid", () => {
            const result = isConfiguration({});

            expect(result).toBe(false);
        });

        test("An Object with more or less than 3 elements is not valid", () => {
            const result = isConfiguration({
                id: "Test",
                value: 5,
            });

            expect(result).toBe(false);

            const result2 = isConfiguration({
                id: "Test",
                name: "tt",
                value: 2,
                pippo: "pluto",
            });

            expect(result2).toBe(false);
        });

        test("A valid configuration Object should be accepted", () => {
            const result = isConfiguration({
                id: "Test",
                name: "Pippo",
                value: {
                    config: true,
                    id: "xpii123",
                },
            });

            expect(result).toBe(true);
        });
    });

    describe("Configuration Value", () => {
        test("A BigInt value should not be valid", () => {
            const result = isConfigurationValue(BigInt(1));

            expect(result).toBe(false);
        });

        test('Every "Jsonable" value is a valid configuration value', () => {
            let result = isConfigurationValue([1, 2, 3]);

            expect(result).toBe(true);

            result = isConfigurationValue({ a: 1, b: true, c: [1, 2, 3] });

            expect(result).toBe(true);

            result = isConfigurationValue(5);

            expect(result).toBe(true);
        });
    });
});
