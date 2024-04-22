import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAuthorization } from "../utils/useAuthorization";
import { Section } from "../Section";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
import { SolanaPayButton } from "../components/solana-pay/solana-pay-ui";

export function ScanScreen() {
  const { selectedAccount } = useAuthorization();

  return (
    <View style={styles.screenContainer}>
      {selectedAccount ? (
        <View style={styles.container}>
          <Text style={styles.headerText}>@brimigs</Text>
          <SolanaPayButton address={selectedAccount.publicKey} />
        </View>
      ) : (
        <>
          <Text style={styles.headerTextLarge}>Solana Cash App</Text>
          <Section description="Sign in with Solana (SIWS) to link your wallet." />
          <SignInFeature />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
  headerText: {
    fontWeight: "bold",
    marginBottom: 1,
    textAlign: "center",
    fontSize: 30,
  },
  headerTextLarge: {
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 12,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
});
