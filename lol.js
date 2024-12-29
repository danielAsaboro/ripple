const FILTER_CONFIG = {
  programId: "BHhjYYFgpQjUDx4RL7ge923gZeJ3vyQScHBwYDCFSkd7",
  skipFailed: false,
};

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Constants from IDL
const INSTRUCTION_DISCRIMINATORS = {
  CREATE_CAMPAIGN: [111, 131, 187, 98, 160, 193, 114, 244],
  DONATE: [121, 186, 218, 211, 73, 70, 196, 180],
  INITIALIZE: [175, 175, 109, 31, 13, 152, 155, 237],
  UPDATE_CAMPAIGN: [235, 31, 39, 49, 121, 173, 19, 92],
  WITHDRAW_FUNDS: [241, 36, 29, 111, 208, 31, 104, 217],
};

const CAMPAIGN_CATEGORIES = [
  "Healthcare",
  "Education",
  "FoodSupply",
  "EmergencyRelief",
  "Infrastructure",
  "WaterSanitation",
];

function decodeBase58(encoded) {
  if (typeof encoded !== "string") return [];
  const result = [];
  for (let i = 0; i < encoded.length; i++) {
    let carry = BASE58_ALPHABET.indexOf(encoded[i]);
    if (carry < 0) return [];
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
  for (let i = 0; i < encoded.length && encoded[i] === "1"; i++) {
    result.push(0);
  }
  return result.reverse();
}

function parseDecodedData(decodedData) {
  try {
    let position = 0;

    // Get instruction type from discriminator
    const discriminator = decodedData.slice(0, 8);
    position += 8;

    // Helper functions
    const readU32 = () => {
      const value =
        decodedData[position] +
        (decodedData[position + 1] << 8) +
        (decodedData[position + 2] << 16) +
        (decodedData[position + 3] << 24);
      position += 4;
      return value;
    };

    const readString = () => {
      const length = readU32();
      const bytes = decodedData.slice(position, position + length);
      position += length;
      // Convert bytes to string directly
      return bytes.reduce((str, byte) => str + String.fromCharCode(byte), "");
    };

    const readU64 = () => {
      const low = readU32();
      const high = readU32();
      return BigInt(high) * BigInt(4294967296) + BigInt(low);
    };

    const readBool = () => {
      const value = decodedData[position] !== 0;
      position += 1;
      return value;
    };

    // Match discriminator for CREATE_CAMPAIGN
    if (
      discriminator.every(
        (byte, i) => byte === INSTRUCTION_DISCRIMINATORS.CREATE_CAMPAIGN[i]
      )
    ) {
      return {
        type: "CREATE_CAMPAIGN",
        data: {
          title: readString(),
          description: readString(),
          category: CAMPAIGN_CATEGORIES[decodedData[position++]],
          organizationName: readString(),
          targetAmount: readU64().toString(),
          startDate: Number(readU64()),
          endDate: Number(readU64()),
          imageUrl: readString(),
          isUrgent: readBool(),
        },
      };
    }

    // Return unrecognized instruction
    return {
      type: "unknown",
      discriminator: discriminator,
    };
  } catch (error) {
    return {
      error: error.message,
      raw: decodedData,
    };
  }
}

function findInstructionsDataByProgramId(data, targetProgramId) {
  const instructions = [];

  for (const outerArray of data) {
    for (const innerObject of outerArray) {
      const found = innerObject.programInvocations.filter(
        (invocation) => invocation.programId === targetProgramId
      );

      for (const match of found) {
        const cleanInstruction = {
          accounts: match.instruction.accounts,
          index: match.instruction.index,
          parsedData: null,
        };

        if (match.instruction.data) {
          try {
            const decodedData = decodeBase58(match.instruction.data);
            cleanInstruction.parsedData = parseDecodedData(decodedData);
          } catch (error) {
            cleanInstruction.parsedData = {
              error: error.message,
            };
          }
        }

        instructions.push(cleanInstruction);
      }
    }
  }

  return instructions;
}

function main(stream) {
  try {
    const data = stream.data ? stream.data : stream;
    return findInstructionsDataByProgramId(data, FILTER_CONFIG.programId)[0];
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
