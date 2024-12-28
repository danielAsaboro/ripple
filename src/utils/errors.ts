// src/utils/errors.ts
export class RippleError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "RippleError";
  }

  static titleTooLong() {
    return new RippleError("The provided title is too long", 6000);
  }
  static descriptionTooLong() {
    return new RippleError("The provided description is too long", 6001);
  }
  static organizationNameTooLong() {
    return new RippleError("The provided organization name is too long", 6002);
  }
  static campaignDurationTooShort() {
    return new RippleError("Campaign duration is too short", 6004);
  }
  static campaignDurationTooLong() {
    return new RippleError("Campaign duration is too long", 6005);
  }
  static donationTooLow() {
    return new RippleError("Donation amount is too low", 6009);
  }
  // Add other error types from your contract
}

export const handleProgramError = (error: any): RippleError => {
  // Extract error code and return appropriate RippleError
  const errorCode = error.code || error.error?.code;
  switch (errorCode) {
    case 6000:
      return RippleError.titleTooLong();
    case 6001:
      return RippleError.descriptionTooLong();
    // Add other cases
    default:
      return new RippleError("Unknown error occurred", -1);
  }
};
