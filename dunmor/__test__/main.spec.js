import {
  applyCommand,
  move,
  moveCmd,
  replace,
  replaceCmd,
  translateCommand,
} from "../main.js";

const initialString = "Hello World";
describe("helper funcs", () => {
  describe("move", () => {
    test("move right normal", () => {
      const input = [0, 1, 2];
      const recieved = move(...input);
      const expected = 1;

      expect(recieved).toEqual(expected);
    });
    test("move right over bound", () => {
      const input = [0, 1, 2];
      const recieved = move(...input);
      const expected = 1;

      expect(recieved).toEqual(expected);
    });
    test("move left normal", () => {
      const input = [1, -1, 2];
      const recieved = move(...input);
      const expected = 0;

      expect(recieved).toEqual(expected);
    });
    test("move left over bound", () => {
      const input = [0, -1, 1];
      const recieved = move(...input);
      const expected = 0;

      expect(recieved).toEqual(expected);
    });
    test("move left from already out of right bound", () => {
      const input = [5, -1, 1];
      const recieved = move(...input);
      const expected = 1;

      expect(recieved).toEqual(expected);
    });
  });
  describe("replace", () => {
    test("null replace", () => {
      const input = [initialString, "a", 0, 0];
      const recieved = replace(...input);
      const expected = {
        finalString: initialString,
        finalPosition: 0,
      };

      expect(recieved).toEqual(expected);
    });
    test("single replace from start", () => {
      const input = [initialString, "a", 0, 1];
      const recieved = replace(...input);
      const finalString = "aello World";
      const expected = {
        finalString: finalString,
        finalPosition: 1,
      };

      expect(recieved).toEqual(expected);
    });
    test("multiple replace from start", () => {
      const input = [initialString, "a", 0, 2];
      const recieved = replace(...input);
      const finalString = "aallo World";
      const expected = {
        finalString: finalString,
        finalPosition: 2,
      };

      expect(recieved).toEqual(expected);
    });
    test("single replace from middle", () => {
      const input = [initialString, "a", 1, 1];
      const recieved = replace(...input);
      const finalString = "Hallo World";
      const expected = {
        finalString: finalString,
        finalPosition: 2,
      };

      expect(recieved).toEqual(expected);
    });
    test("multiple replace from start exceeding length", () => {
      const input = [initialString, "a", 0, 100];
      const recieved = replace(...input);
      const finalString = "aaaaaaaaaaa";
      const expected = {
        finalString: finalString,
        finalPosition: 10,
      };

      expect(recieved).toEqual(expected);
    });
  });
});

describe("applyCommand", () => {
  describe("move", () => {
    test("applies null move", () => {
      const input = {
        command: moveCmd,
        magnitude: 0,
      };
      const expected = {
        finalPosition: 0,
        resultString: initialString,
      };
      const result = applyCommand(input, 0, initialString);
      expect(result).toEqual(expected);
    });
    test("applies simple right move", () => {
      const input = [
        {
          command: moveCmd,
          magnitude: 1,
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 1,
        resultString: initialString,
      };
      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("applies excess right move", () => {
      const input = [
        {
          command: moveCmd,
          magnitude: 1,
        },
        initialString.length,
        initialString,
      ];
      const expected = {
        finalPosition: initialString.length,
        resultString: initialString,
      };
      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("applies simple left move", () => {
      const input = [
        {
          command: moveCmd,
          magnitude: -1,
        },
        5,
        initialString,
      ];

      const expected = {
        finalPosition: 4,
        resultString: initialString,
      };
      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("applies excess left move", () => {
      const input = [
        {
          command: moveCmd,
          magnitude: -1,
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 0,
        resultString: initialString,
      };
      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
  });
  describe("replace", () => {
    test("null replace", () => {
      const input = [
        {
          command: replaceCmd,
          magnitude: 0,
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 0,
        resultString: initialString,
      };

      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("single replace from first position", () => {
      const input = [
        {
          command: replaceCmd,
          magnitude: 1,
          replacement: "a",
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 1,
        resultString: "aello World",
      };

      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("double replace from first position", () => {
      const input = [
        {
          command: replaceCmd,
          magnitude: 2,
          replacement: "a",
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 2,
        resultString: "aallo World",
      };

      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
    test("excessive replace from first position", () => {
      const input = [
        {
          command: replaceCmd,
          magnitude: 999,
          replacement: "s",
        },
        0,
        initialString,
      ];
      const expected = {
        finalPosition: 10,
        resultString: "sssssssssss",
      };

      const result = applyCommand(...input);
      expect(result).toEqual(expected);
    });
  });
});

describe("translateCmd", () => {
  describe("move", () => {
    test("simple move left", () => {
      const cmd = {
        type: moveCmd,
        commandStr: "h",
      };
      const input = cmd;

      const expected = {
        command: moveCmd,
        magnitude: -1,
      };

      const result = translateCommand(input);
      expect(expected).toEqual(result);
    });
    test("x move left", () => {
      const cmd = {
        type: moveCmd,
        commandStr: "10h",
      };
      const input = cmd;

      const expected = {
        command: moveCmd,
        magnitude: -10,
      };

      const result = translateCommand(input);
      expect(expected).toEqual(result);
    });
    test("simple move right", () => {
      const cmd = {
        type: moveCmd,
        commandStr: "l",
      };
      const input = cmd;

      const expected = {
        command: moveCmd,
        magnitude: 1,
      };

      const result = translateCommand(input);
      expect(expected).toEqual(result);
    });
    test("x move right", () => {
      const cmd = {
        type: moveCmd,
        commandStr: "10l",
      };
      const input = cmd;

      const expected = {
        command: moveCmd,
        magnitude: 10,
      };

      const result = translateCommand(input);
      expect(expected).toEqual(result);
    });
  });
});
