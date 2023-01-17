// goals:
// 1 general system that accepts comands and routes to approriate sub dfunction
// 2 2 main domain movement and replacement
// 3 gotchas replacement curson position, history and replayabillity of prior commands
// 4 splitting commands on lengths of both one or two chars
// 5 final position on replace can be tricky confirm with examples

//  func that takes in single arg instructions string
// func should have internal state variable maintained for cursor position starting at 0
// func should split instructs into approp. commands and then seq go thru and apply correct functions. motive function or arbiter
// return result str
export function main(instructions, text = "Hello World") {
  const initialCommandObjects = getCommands(instructions);
  const finalComandObjects = initialCommandObjects.map(translateCommand);

  let resultText = text;
  let cursorPosition = 0;
  for (let cmd of finalComandObjects) {
    const { finalPosition: nextCursorPosition, resultString } = applyCommand(
      cmd,
      cursorPosition,
      resultText
    );
    resultText = resultString;
    cursorPosition = nextCursorPosition;
  }

  return {
    Output: resultText,
    "Cursor Position": cursorPosition,
  };
}

export const moveCmd = "MOVE";
export const replaceCmd = "REPLACE";

export function getCommands(instructions) {
  let insideCommand = false;
  let curCommand = "";
  let insideReplaceContext = false;
  const commands = [];

  for (let i = 0; i < instructions.length; i += 1) {
    const curChar = instructions[i];
    const curCharCode = curChar.charCodeAt(0);
    if (insideCommand && insideReplaceContext) {
      curCommand = curCommand + curChar;
      const command = {
        type: replaceCmd,
        commandStr: curCommand,
      };
      commands.push(command);
      insideCommand = false;
      insideReplaceContext = false;
      continue;
    }
    if (curCharCode >= numberCharStart && curCharCode <= numberCharEnd) {
      if (!insideCommand) {
        insideCommand = true;
      }
      curCommand = curCommand + curChar;
      continue;
    }
    if (curChar === "l" || curChar == "h") {
      curCommand = curCommand + curChar;
      const command = {
        type: moveCmd,
        commandStr: curCommand,
      };
      commands.push(command);
      insideCommand = false;
      curCommand = "";
      continue;
    }
    if (curChar === "r") {
      if (!insideReplaceContext) {
        insideReplaceContext = true;
      }
      if (!insideCommand) {
        insideCommand = true;
      }
      curCommand = curCommand + curChar;
    }
  }

  return commands;
}

export function translateCommand(initialCommand) {
  const { type, commandStr } = initialCommand;
  let command = {};
  if (type === replaceCmd) {
    const [magnitudeStr, replacement] = commandStr.split("r");
    command = {
      command: replaceCmd,
      magnitude: parseInt(magnitudeStr, 10),
      replacement: replacement,
    };
  }
  if (type === moveCmd) {
    const finalCharPosition = commandStr.length - 1;
    const directionFlag = commandStr[finalCharPosition];
    let magnitude = 1;
    if (commandStr.length > 1) {
      magnitude = parseInt(commandStr.slice(0, finalCharPosition), 10);
    }
    if (directionFlag == "h") {
      magnitude = -1 * magnitude;
    }
    command = {
      command: moveCmd,
      magnitude,
    };
  }

  return command;
}

export function applyCommand(cmd, initialPosition = 0, initialString = "") {
  const { command, magnitude, replacement = "" } = cmd;
  let finalPosition = initialPosition;
  let resultString = initialString;
  let length = initialString.length;
  if (command === moveCmd) {
    finalPosition = move(initialPosition, magnitude, length);
  }
  if (command == replaceCmd) {
    const replaceResult = replace(
      initialString,
      replacement,
      initialPosition,
      magnitude
    );
    finalPosition = replaceResult.finalPosition;
    resultString = replaceResult.finalString;
  }

  const result = {
    finalPosition,
    resultString,
  };
  return result;
}
// func that recieves current position, direction flag, movement amount, maxLength  and returns resulting cursor position
export function move(curPosition, amount = 0, length = 0) {
  let finalPosition = curPosition;
  finalPosition = curPosition + amount;

  if (finalPosition > length) {
    finalPosition = length;
  }
  if (finalPosition < 0) {
    finalPosition = 0;
  }

  return finalPosition;
}

// func that recieves initial string, replace char, at start index, amount of replacement and will return an object with the keys representing the resultant string and the final cursor position
export function replace(
  initialString,
  replaceChar,
  startPosition,
  replacementAmount
) {
  let finalPosition = startPosition + replacementAmount;
  if (finalPosition > initialString.length) {
    replacementAmount = initialString.length - startPosition;
    finalPosition = initialString.length - 1;
  }
  let prefix = "";
  if (startPosition > 0) {
    prefix = initialString.slice(0, startPosition) || "";
  }
  let middle = "";
  if (replacementAmount > 0) {
    middle = replaceChar.repeat(replacementAmount);
  }
  const suffix =
    initialString.slice(startPosition + middle.length, initialString.length) ||
    "";

  let result = prefix + middle + suffix;
  result = result.slice(0, initialString.length);

  return {
    finalString: result,
    finalPosition,
  };
}
