import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";

import { CashApp as CashAppProgram } from "../cash-app-program/types/cash_app";
import idl from "../cash-app-program/idl/cash_app.json";

export function UseCashAppProgram(user: PublicKey) {
  const cashAppProgramId = new PublicKey(
    "BxCbQks4iaRvfCnUzf3utYYG9V53TDwVLxA6GGBnhci4"
  );

  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com")
  );

  const [cashAppPDA] = useMemo(() => {
    const counterSeed = user.toBuffer();
    return PublicKey.findProgramAddressSync([counterSeed], cashAppProgramId);
  }, [cashAppProgramId]);

  // const provider = useMemo(() => {
  //   if (!anchorWallet) {
  //     return null;
  //   }
  //   return new AnchorProvider(connection, anchorWallet, {
  //     preflightCommitment: "confirmed",
  //     commitment: "processed",
  //   });
  // }, [anchorWallet, connection]);

  const cashAppProgram = useMemo(() => {
    return new Program<CashAppProgram>(idl as CashAppProgram, cashAppProgramId);
  }, [cashAppProgramId]);

  const value = useMemo(
    () => ({
      cashAppProgram: cashAppProgram,
      cashAppProgramId: cashAppProgramId,
      cashAppPDA: cashAppPDA,
    }),
    [cashAppProgram, cashAppProgramId, cashAppPDA]
  );

  return value;
}
