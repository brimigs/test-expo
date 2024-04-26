import React, { useCallback, useState } from "react";
import { Button } from "react-native";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { useAuthorization } from "../../utils/useAuthorization";
import { UseCashAppProgram } from "../../utils/useCashAppProgram";
import { CashApp } from "../../cash-app-program/types/cash_app";
import { alertAndLog } from "../../utils/alertAndLog";
import { Program } from "@coral-xyz/anchor";

type signCashApp = Readonly<{ user: PublicKey }>;

export default function InitAccount({ user }: signCashApp) {
  const [genInProgress, setGenInProgress] = useState(false);
  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com")
  );
  const { authorizeSession, selectedAccount } = useAuthorization();
  const { cashAppProgram, cashAppPDA } = UseCashAppProgram(user);

  const signIncrementTransaction = useCallback(
    async (program: Program<CashApp>) => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const [authorizationResult, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);

        // Generate the increment ix from the Anchor program
        const incrementInstruction = await program.methods
          .initializeAccount()
          .accounts({
            user: authorizationResult.publicKey,
            cashAccount: cashAppPDA,
          })
          .instruction();

        // Build a transaction containing the instruction
        const incrementTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(incrementInstruction);

        // Sign a transaction and receive
        const signedTransactions = await wallet.signTransactions({
          transactions: [incrementTransaction],
        });

        return signedTransactions[0];
      });
    },
    [authorizeSession, connection, cashAppPDA]
  );

  return (
    <Button
      title="Set up account"
      disabled={genInProgress}
      onPress={async () => {
        if (genInProgress) {
          return;
        }
        setGenInProgress(true);
        try {
          if (!cashAppProgram || !selectedAccount) {
            console.warn(
              "Program/wallet is not initialized yet. Try connecting a wallet first."
            );
            return;
          }
          const incrementTransaction = await signIncrementTransaction(
            cashAppProgram
          );

          alertAndLog(
            "Increment Transaction: ",
            "See console for logged transaction."
          );
          console.log(incrementTransaction);
        } finally {
          setGenInProgress(false);
        }
      }}
    />
  );
}
