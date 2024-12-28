/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ripple.json`.
 */
export type Ripple = {
  address: "BHhjYYFgpQjUDx4RL7ge923gZeJ3vyQScHBwYDCFSkd7";
  metadata: {
    name: "ripple";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "createCampaign";
      discriminator: [111, 131, 187, 98, 160, 193, 114, 244];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "arg";
                path: "title";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "category";
          type: {
            defined: {
              name: "campaignCategory";
            };
          };
        },
        {
          name: "organizationName";
          type: "string";
        },
        {
          name: "targetAmount";
          type: "u64";
        },
        {
          name: "startDate";
          type: "i64";
        },
        {
          name: "endDate";
          type: "i64";
        },
        {
          name: "imageUrl";
          type: "string";
        },
        {
          name: "isUrgent";
          type: "bool";
        }
      ];
    },
    {
      name: "donate";
      discriminator: [121, 186, 218, 211, 73, 70, 196, 180];
      accounts: [
        {
          name: "donor";
          writable: true;
          signer: true;
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "donor";
              }
            ];
          };
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.authority";
                account: "campaign";
              }
            ];
          };
        },
        {
          name: "donation";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 111, 110, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "campaign";
              },
              {
                kind: "account";
                path: "donor";
              },
              {
                kind: "arg";
                path: "countInString";
              }
            ];
          };
        },
        {
          name: "campaignVault";
          docs: [
            "The seeds and constraints ensure it is the correct vault for this campaign."
          ];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.authority";
                account: "campaign";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "paymentMethod";
          type: {
            defined: {
              name: "paymentMethod";
            };
          };
        },
        {
          name: "countInString";
          type: "string";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        }
      ];
    },
    {
      name: "updateCampaign";
      discriminator: [235, 31, 39, 49, 121, 173, 19, 92];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: {
              name: "updateCampaignParams";
            };
          };
        }
      ];
    },
    {
      name: "withdrawFunds";
      discriminator: [241, 36, 29, 111, 208, 31, 104, 217];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "campaignVault";
          docs: [
            "The seeds and constraints ensure it is the correct vault for this campaign, and only the",
            "campaign authority can withdraw from it when the campaign is completed."
          ];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.authority";
                account: "campaign";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "recipient";
          docs: [
            "It can be any valid system account as specified by the campaign authority."
          ];
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "campaign";
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192];
    },
    {
      name: "donation";
      discriminator: [189, 210, 54, 77, 216, 85, 7, 68];
    },
    {
      name: "user";
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236];
    }
  ];
  events: [
    {
      name: "badgeAwarded";
      discriminator: [153, 87, 158, 115, 220, 200, 52, 1];
    },
    {
      name: "campaignCreated";
      discriminator: [9, 98, 69, 61, 53, 131, 64, 152];
    },
    {
      name: "campaignUpdated";
      discriminator: [110, 209, 206, 190, 205, 2, 234, 81];
    },
    {
      name: "donationReceived";
      discriminator: [160, 135, 32, 7, 241, 105, 91, 158];
    },
    {
      name: "fundsWithdrawn";
      discriminator: [56, 130, 230, 154, 35, 92, 11, 118];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "titleTooLong";
      msg: "The provided title is too long";
    },
    {
      code: 6001;
      name: "descriptionTooLong";
      msg: "The provided description is too long";
    },
    {
      code: 6002;
      name: "organizationNameTooLong";
      msg: "The provided organization name is too long";
    },
    {
      code: 6003;
      name: "imageUrlTooLong";
      msg: "The provided image URL is too long";
    },
    {
      code: 6004;
      name: "campaignDurationTooShort";
      msg: "Campaign duration is too short";
    },
    {
      code: 6005;
      name: "campaignDurationTooLong";
      msg: "Campaign duration is too long";
    },
    {
      code: 6006;
      name: "targetAmountTooLow";
      msg: "Campaign target amount is too low";
    },
    {
      code: 6007;
      name: "campaignEnded";
      msg: "Campaign has already ended";
    },
    {
      code: 6008;
      name: "campaignNotActive";
      msg: "Campaign is not active";
    },
    {
      code: 6009;
      name: "donationTooLow";
      msg: "Donation amount is too low";
    },
    {
      code: 6010;
      name: "invalidAuthority";
      msg: "Invalid authority";
    },
    {
      code: 6011;
      name: "invalidStatusTransition";
      msg: "Invalid campaign status transition";
    },
    {
      code: 6012;
      name: "insufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 6013;
      name: "nameTooLong";
      msg: "Maximum name length exceeded";
    },
    {
      code: 6014;
      name: "emailTooLong";
      msg: "Maximum email length exceeded";
    },
    {
      code: 6015;
      name: "invalidEmailFormat";
      msg: "Invalid email format";
    },
    {
      code: 6016;
      name: "transactionHashTooLong";
      msg: "Maximum transaction hash length exceeded";
    },
    {
      code: 6017;
      name: "impactDescriptionTooLong";
      msg: "Maximum impact description length exceeded";
    },
    {
      code: 6018;
      name: "maxBadgesReached";
      msg: "Maximum number of badges reached";
    }
  ];
  types: [
    {
      name: "badge";
      type: {
        kind: "struct";
        fields: [
          {
            name: "badgeType";
            type: {
              defined: {
                name: "badgeType";
              };
            };
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "imageUrl";
            type: "string";
          },
          {
            name: "dateEarned";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "badgeAwarded";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "badgeType";
            type: {
              defined: {
                name: "badgeType";
              };
            };
          },
          {
            name: "timestamp";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "badgeType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "gold";
          },
          {
            name: "silver";
          },
          {
            name: "bronze";
          },
          {
            name: "championOfChange";
          },
          {
            name: "sustainedSupporter";
          }
        ];
      };
    },
    {
      name: "campaign";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "category";
            type: {
              defined: {
                name: "campaignCategory";
              };
            };
          },
          {
            name: "organizationName";
            type: "string";
          },
          {
            name: "targetAmount";
            type: "u64";
          },
          {
            name: "raisedAmount";
            type: "u64";
          },
          {
            name: "donorsCount";
            type: "u32";
          },
          {
            name: "startDate";
            type: "i64";
          },
          {
            name: "endDate";
            type: "i64";
          },
          {
            name: "status";
            type: {
              defined: {
                name: "campaignStatus";
              };
            };
          },
          {
            name: "imageUrl";
            type: "string";
          },
          {
            name: "isUrgent";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "campaignCategory";
      type: {
        kind: "enum";
        variants: [
          {
            name: "healthcare";
          },
          {
            name: "education";
          },
          {
            name: "foodSupply";
          },
          {
            name: "emergencyRelief";
          },
          {
            name: "infrastructure";
          },
          {
            name: "waterSanitation";
          }
        ];
      };
    },
    {
      name: "campaignCreated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "category";
            type: {
              defined: {
                name: "campaignCategory";
              };
            };
          },
          {
            name: "targetAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "campaignStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "active";
          },
          {
            name: "inProgress";
          },
          {
            name: "completed";
          },
          {
            name: "expired";
          }
        ];
      };
    },
    {
      name: "campaignUpdated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "newStatus";
            type: {
              option: {
                defined: {
                  name: "campaignStatus";
                };
              };
            };
          }
        ];
      };
    },
    {
      name: "donation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "donor";
            type: "pubkey";
          },
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "status";
            type: {
              defined: {
                name: "donationStatus";
              };
            };
          },
          {
            name: "paymentMethod";
            type: {
              defined: {
                name: "paymentMethod";
              };
            };
          },
          {
            name: "transactionHash";
            type: "string";
          },
          {
            name: "impactDescription";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "donationReceived";
      type: {
        kind: "struct";
        fields: [
          {
            name: "donation";
            type: "pubkey";
          },
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "donor";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "paymentMethod";
            type: {
              defined: {
                name: "paymentMethod";
              };
            };
          }
        ];
      };
    },
    {
      name: "donationStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "pending";
          },
          {
            name: "completed";
          },
          {
            name: "allocated";
          },
          {
            name: "spent";
          }
        ];
      };
    },
    {
      name: "fundsWithdrawn";
      type: {
        kind: "struct";
        fields: [
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "recipient";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "impactMetrics";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mealsProvided";
            type: "u32";
          },
          {
            name: "childrenEducated";
            type: "u32";
          },
          {
            name: "familiesHoused";
            type: "u32";
          },
          {
            name: "treesPlanted";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "paymentMethod";
      type: {
        kind: "enum";
        variants: [
          {
            name: "cryptoWallet";
          },
          {
            name: "card";
          }
        ];
      };
    },
    {
      name: "updateCampaignParams";
      type: {
        kind: "struct";
        fields: [
          {
            name: "description";
            type: {
              option: "string";
            };
          },
          {
            name: "imageUrl";
            type: {
              option: "string";
            };
          },
          {
            name: "endDate";
            type: {
              option: "i64";
            };
          },
          {
            name: "status";
            type: {
              option: {
                defined: {
                  name: "campaignStatus";
                };
              };
            };
          },
          {
            name: "isUrgent";
            type: {
              option: "bool";
            };
          }
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "walletAddress";
            type: "pubkey";
          },
          {
            name: "email";
            type: "string";
          },
          {
            name: "avatarUrl";
            type: "string";
          },
          {
            name: "totalDonations";
            type: "u64";
          },
          {
            name: "campaignsSupported";
            type: "u32";
          },
          {
            name: "impactMetrics";
            type: {
              defined: {
                name: "impactMetrics";
              };
            };
          },
          {
            name: "badges";
            type: {
              vec: {
                defined: {
                  name: "badge";
                };
              };
            };
          },
          {
            name: "rank";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};
