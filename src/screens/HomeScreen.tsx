import React, { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization } from "../utils/useAuthorization";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
import { InitAccountFeature } from "../components/anchor-program/int-feature";
import { SnsFeature } from "../components/sns/sns-feature";

export function HomeScreen() {
  const { selectedAccount } = useAuthorization();

  return (
    <View style={styles.screenContainer}>
      {selectedAccount ? (
        <>
          <InitAccountFeature />
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
    backgroundColor: "#141414",
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
  headerText: {
    marginBottom: 1,
    textAlign: "left",
    fontSize: 20,
    color: "white",
  },
  headerTextLarge: {
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 12,
    textAlign: "center",
    color: "white",
  },
  modalView: {
    backgroundColor: "#444",
    padding: 35,
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2, // Negative value to lift the shadow up
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    width: "100%", // Ensure the modal occupies full width
    height: "40%", // Only take up half the screen height
  },
  bottomView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF", // Light text color for buttons
  },
});
