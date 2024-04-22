import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization } from "../utils/useAuthorization";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
// import { InitAccountFeature } from "../components/anchor-program/int-feature";

export function HomeScreen() {
  const { selectedAccount } = useAuthorization();

  return (
    <View style={styles.screenContainer}>
      {selectedAccount ? (
        <>
          <Text style={styles.headerText}>Cash Balance</Text>
          {/* <InitAccountFeature /> */}
          <AccountDetailFeature />
        </>
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
});
