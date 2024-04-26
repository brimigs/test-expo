import { devnet } from "@bonfida/spl-name-service";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useCallback, useState } from "react";
import { Button } from "react-native-paper";
import { TextInput, View } from "react-native";
import { useConnection } from "../../utils/ConnectionProvider";
import { useMobileWallet } from "../../utils/useMobileWallet";
import { useAuthorization } from "../../utils/useAuthorization";
import { alertAndLog } from "../../utils/alertAndLog";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import React from "react";

export function SnsButton({ address }: { address: PublicKey }) {
  const { authorizeSession } = useAuthorization();
  const { selectedAccount } = useAuthorization();
  const user = selectedAccount?.publicKey;
  const { connection } = useConnection();
  const space = 1000;
  const [name, setName] = useState("");
  const [signingInProgress, setSigningInProgress] = useState(false);
  const wallet = useMobileWallet();

  const signTransaction = useCallback(async () => {
    return await transact(async (wallet: Web3MobileWallet) => {
      // First, request for authorization from the wallet and fetch the latest
      // blockhash for building the transaction.
      const [authorizationResult, latestBlockhash] = await Promise.all([
        authorizeSession(wallet),
        connection.getLatestBlockhash(),
      ]);

      const [, ix] = await devnet.bindings.registerDomainName(
        connection,
        "devnet-test-5", // The name of the domain you want to register
        1_000,
        user!, // PublicKey of fee payer
        getAssociatedTokenAddressSync(NATIVE_MINT, user!, true), // import from @solana/spl-token
        NATIVE_MINT
      );

      // Construct a transaction.
      const instructions: TransactionInstruction =
        await devnet.bindings.createNameRegistry(
          connection,
          name,
          space,
          user!,
          user!
        );

      const snsTransaction = new Transaction({
        ...latestBlockhash,
        feePayer: authorizationResult.publicKey,
      }).add(instructions);

      // Sign a transaction and receive
      const signedTransactions = await wallet.signTransactions({
        transactions: [snsTransaction],
      });

      return signedTransactions[0];
    });
  }, [authorizeSession, connection]);

  const handleConnectPress = async () => {
    const txSignature = await transact(async (wallet) => {
      // Authorize the wallet session
      const authorization = await authorizeSession(wallet);
      const instructions: TransactionInstruction[] = [
        await devnet.bindings.createNameRegistry(
          connection,
          name,
          space,
          address,
          address
        ),
      ];

      const latestBlockhash = await connection.getLatestBlockhash();

      // Construct the Versioned message and transaction.
      const txMessage = new TransactionMessage({
        payerKey: address,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToV0Message();

      const transferTx = new VersionedTransaction(txMessage);

      // Send the unsigned transaction, the wallet will sign and submit it to the network,
      // returning the transaction signature.
      const transactionSignatures = await wallet.signAndSendTransactions({
        transactions: [transferTx],
      });

      return transactionSignatures[0];
    });

    // Confirm the transaction was successful.
    const confirmationResult = await connection.confirmTransaction(
      txSignature,
      "confirmed"
    );

    if (confirmationResult.value.err) {
      throw new Error(JSON.stringify(confirmationResult.value.err));
    } else {
      console.log("Transaction successfully submitted!");
    }
  };

  const handleTransaction = async () => {
    try {
      const [, ix] = await devnet.bindings.registerDomainName(
        connection,
        "devnet-test-5", // The name of the domain you want to register
        1_000,
        user!, // PublicKey of fee payer
        getAssociatedTokenAddressSync(NATIVE_MINT, user!, true), // import from @solana/spl-token
        NATIVE_MINT
      );
      const instruction: TransactionInstruction[] = [
        await devnet.bindings.createNameRegistry(
          connection,
          name,
          space,
          address,
          address
        ),
      ];
      const latestBlockhash = await connection.getLatestBlockhash();
      const txMessage = new TransactionMessage({
        payerKey: address,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: ix,
      }).compileToV0Message();
      const transaction = new VersionedTransaction(txMessage);
      const signature = await wallet.signAndSendTransaction(transaction);
      console.log("Transaction signed");
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };

  //   return (
  //     <View
  //       style={{
  //         padding: 20,
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <TextInput
  //         value={name}
  //         onChangeText={setName}
  //         style={{
  //           marginBottom: 20,
  //           backgroundColor: "#f0f0f0",
  //           height: 50,
  //           padding: 10,
  //           fontSize: 18,
  //           width: "80%",
  //         }}
  //       />
  //       <Button
  //         mode="contained"
  //         disabled={signingInProgress}
  //         onPress={async () => {
  //           if (signingInProgress) {
  //             return;
  //           }
  //           setSigningInProgress(true);
  //           try {
  //             const signedTransaction = await signTransaction();
  //             alertAndLog(
  //               "Transaction signed",
  //               "View SignTransactionButton.tsx for implementation."
  //             );
  //             console.log(signTransaction);
  //           } catch (err: any) {
  //             alertAndLog(
  //               "Error during signing",
  //               err instanceof Error ? err.message : err
  //             );
  //           } finally {
  //             setSigningInProgress(false);
  //           }
  //         }}
  //       >
  //         Set User Name
  //       </Button>
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          marginBottom: 20,
          backgroundColor: "#f0f0f0",
          height: 50,
          padding: 10,
          fontSize: 18,
          width: "80%",
        }}
      />
      <Button mode="contained" onPress={handleTransaction}>
        Set User Name
      </Button>
    </View>
  );
}
