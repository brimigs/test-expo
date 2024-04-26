import { View, StyleSheet } from "react-native";
import { SnsButton } from "./sns-ui";
import { useAuthorization } from "../../utils/useAuthorization";
import React from "react";

export function SnsFeature() {
  const { selectedAccount } = useAuthorization();

  if (!selectedAccount) {
    return null;
  }
  return (
    <View style={styles.buttonGroup}>
      <SnsButton address={selectedAccount.publicKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: 16,
    flexDirection: "row",
  },
});
