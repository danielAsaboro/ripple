function findPlacesByProgramId(data, targetProgramId) {
  const instructions = [];

  for (const outerArray of data) {
    for (const innerObject of outerArray) {
      const found = innerObject.programInvocations.filter(
        (invocation) => invocation.programId === targetProgramId
      );

      for (const match of found) {
        instructions.push(match.instruction); // Collect all matching instructions.
      }
    }
  }

  return instructions;
}

let lol = {
  accounts: [
    {
      postBalance: 2969966320,
      preBalance: 2981294360,
      pubkey: "4SJTnpibSEo7rwBAsdRkbAap5XSw851rxnWbMcKz8anX",
    },
    {
      postBalance: 18680640,
      preBalance: 18680640,
      pubkey: "ezQ3KJbo9DweyZWUjzDrbA8cJr5v1YZ2gQ4X1q12iye",
    },
    {
      postBalance: 11303040,
      preBalance: 0,
      pubkey: "B46bQNsygdewpBcUjnJeJiNmj5V12wxxtVbzQpMy2i1h",
    },
    {
      postBalance: 1,
      preBalance: 1,
      pubkey: "11111111111111111111111111111111",
    },
  ],
  data: "yx8Ht4ECG13fVgoccF2U4S1ptTuTxkqhh6Bij9yDKwSgCxYkBVVEmd22k7NMAj4vJkWfGQfFnyo2R8Er2Fk5LEYG6tZe5qaXQW73TQE3kLdZcMWTrswirDC9mHyjzWKefUCbZ3n",
  index: 2,
  tokenBalances: null,
};

function decodeBase58(encoded) {
  if (typeof encoded !== "string") return [];
  const result = [];
  for (let i = 0; i < encoded.length; i++) {
    let carry = BASE58_ALPHABET.indexOf(encoded[i]);
    if (carry < 0) return []; // Invalid character, return empty array
    for (let j = 0; j < result.length; j++) {
      carry += result[j] * 58;
      result[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      result.push(carry & 0xff);
      carry >>= 8;
    }
  }
  // Add leading zeros
  for (let i = 0; i < encoded.length && encoded[i] === "1"; i++) {
    result.push(0);
  }
  return result.reverse();
}
