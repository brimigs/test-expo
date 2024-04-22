import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import * as anchor from "@coral-xyz/anchor";

import { CashApp as CashAppProgram } from "../cash-app-program/types/cash_app";
import idl from "../cash-app-program/idl/cash_app.json";

export function UseCashAppProgram(anchorWallet: anchor.Wallet | null) {
  const cashAppProgramId = useMemo(() => {
    return new PublicKey("BxCbQks4iaRvfCnUzf3utYYG9V53TDwVLxA6GGBnhci4");
  }, []);

  const [connection] = useState(
    () => new Connection("https://api.devnet.solana.com")
  );

  const [counterPDA] = useMemo(() => {
    const counterSeed = anchor.utils.bytes.utf8.encode("counter");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      cashAppProgramId
    );
  }, [cashAppProgramId]);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return null;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "confirmed",
      commitment: "processed",
    });
  }, [anchorWallet, connection]);

  const cashAppProgram = useMemo(() => {
    if (!provider) {
      return null;
    }

    return new Program<CashAppProgram>(
      idl as CashAppProgram,
      cashAppProgramId,
      provider
    );
  }, [cashAppProgramId, provider]);

  const value = useMemo(
    () => ({
      cashAppProgram: cashAppProgram,
      cashAppProgramId: cashAppProgramId,
      cashAppPDA: counterPDA,
    }),
    [cashAppProgram, cashAppProgramId, counterPDA]
  );

  return value;
}
