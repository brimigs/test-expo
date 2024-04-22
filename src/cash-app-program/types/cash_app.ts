export type CashApp = {
  version: "0.1.0";
  name: "cash_app";
  instructions: [
    {
      name: "initializeAccount";
      accounts: [
        {
          name: "cashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "depositFunds";
      accounts: [
        {
          name: "cashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "transferFunds";
      accounts: [
        {
          name: "fromCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "toCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawFunds";
      accounts: [
        {
          name: "cashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "addFriend";
      accounts: [
        {
          name: "cashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "pubkey";
          type: "publicKey";
        }
      ];
    },
    {
      name: "createEscrow";
      accounts: [
        {
          name: "fromCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "toCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "acceptEscrow";
      accounts: [
        {
          name: "toCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "cancelEscrow";
      accounts: [
        {
          name: "fromCashAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "escrowAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "balance";
            type: "u64";
          },
          {
            name: "sender";
            type: "publicKey";
          },
          {
            name: "recipient";
            type: "publicKey";
          },
          {
            name: "deadline";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "cashAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "balance";
            type: "u64";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "friends";
            type: {
              vec: "publicKey";
            };
          },
          {
            name: "pendingEscrows";
            type: {
              vec: "publicKey";
            };
          }
        ];
      };
    },
    {
      name: "paymentRequest";
      type: {
        kind: "struct";
        fields: [
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "sender";
            type: "publicKey";
          },
          {
            name: "recipient";
            type: "publicKey";
          },
          {
            name: "status";
            type: {
              defined: "RequestStatus";
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "RequestStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Pending";
          },
          {
            name: "Accepted";
          },
          {
            name: "Rejected";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidAmount";
      msg: "The provided amount must be greater than zero.";
    },
    {
      code: 6001;
      name: "InsufficientFunds";
      msg: "Insufficient funds to perform the transfer.";
    },
    {
      code: 6002;
      name: "Overflow";
      msg: "An overflow occurred in the balance calculation.";
    },
    {
      code: 6003;
      name: "EscrowExpired";
    },
    {
      code: 6004;
      name: "EscrowNotExpiredYet";
    }
  ];
};

export const IDL: CashApp = {
  version: "0.1.0",
  name: "cash_app",
  instructions: [
    {
      name: "initializeAccount",
      accounts: [
        {
          name: "cashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "depositFunds",
      accounts: [
        {
          name: "cashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "transferFunds",
      accounts: [
        {
          name: "fromCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "toCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawFunds",
      accounts: [
        {
          name: "cashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "addFriend",
      accounts: [
        {
          name: "cashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "pubkey",
          type: "publicKey",
        },
      ],
    },
    {
      name: "createEscrow",
      accounts: [
        {
          name: "fromCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "toCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "acceptEscrow",
      accounts: [
        {
          name: "toCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "cancelEscrow",
      accounts: [
        {
          name: "fromCashAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "escrowAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "balance",
            type: "u64",
          },
          {
            name: "sender",
            type: "publicKey",
          },
          {
            name: "recipient",
            type: "publicKey",
          },
          {
            name: "deadline",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "cashAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "balance",
            type: "u64",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "friends",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "pendingEscrows",
            type: {
              vec: "publicKey",
            },
          },
        ],
      },
    },
    {
      name: "paymentRequest",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "sender",
            type: "publicKey",
          },
          {
            name: "recipient",
            type: "publicKey",
          },
          {
            name: "status",
            type: {
              defined: "RequestStatus",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "RequestStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pending",
          },
          {
            name: "Accepted",
          },
          {
            name: "Rejected",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAmount",
      msg: "The provided amount must be greater than zero.",
    },
    {
      code: 6001,
      name: "InsufficientFunds",
      msg: "Insufficient funds to perform the transfer.",
    },
    {
      code: 6002,
      name: "Overflow",
      msg: "An overflow occurred in the balance calculation.",
    },
    {
      code: 6003,
      name: "EscrowExpired",
    },
    {
      code: 6004,
      name: "EscrowNotExpiredYet",
    },
  ],
};
