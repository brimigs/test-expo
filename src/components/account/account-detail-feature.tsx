import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";
import {
  AccountBalance,
  AccountButtonGroup,
  PendingTransactions,
} from "./account-ui";

export function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();

  if (!selectedAccount) {
    return null;
  }
  const theme = useTheme();

  return (
    <>
      <View style={{ marginTop: 24, alignItems: "center" }}>
        <AccountBalance address={selectedAccount.publicKey} />
        <AccountButtonGroup address={selectedAccount.publicKey} />
      </View>
      <View style={{ marginTop: 48 }}>
        <PendingTransactions address={selectedAccount.publicKey} />
      </View>
    </>
  );
}
