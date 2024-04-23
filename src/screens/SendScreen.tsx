import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { RootStackParamList } from "../navigators/AppNavigator";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { useMobileWallet } from "../utils/useMobileWallet";

type RequestScreenRouteProp = RouteProp<RootStackParamList, "Receive">;
type RequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Receive"
>;

type Props = {
  route: RequestScreenRouteProp;
  navigation: RequestScreenNavigationProp;
};

const RequestScreen: React.FC<Props> = ({ route, navigation }) => {
  const [sns, setSNS] = useState("");
  const [reason, setReason] = useState("");
  const { inputValue } = route.params;
  const amount = parseFloat(inputValue);
  //   const { pubkey } = getDomainKeySync(sns);
  const wallet = useMobileWallet();
  const [purchaseProtection, setPurchaseProtection] = useState(false);

  // const handleRequest = (pubkey: PublicKey, amount: BigNumber, reason: string) => {
  //   const url = encodeURL({ recipient: pubkey, amount, memo: reason });
  //   const qr = createQR(url, 512, 'transparent');
  // };

  // const transferSol = useTransferSol(wallet);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>${inputValue}</Text>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => {
          //   transferSol
          //   .mutateAsync({
          //     destination: pubkey,
          //     amount,
          //   })
          // }}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSNS}
          value={sns}
          placeholder="User"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>For:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setReason}
          value={reason}
          placeholder="Memo"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.regular}>Enable purchase protection:</Text>
        <Switch
          value={purchaseProtection}
          onValueChange={setPurchaseProtection}
          trackColor={{ false: "#767577", true: "#7F5AF0" }}
          thumbColor={purchaseProtection ? "#7F5AF0" : "#f4f3f4"}
        />
      </View>
      <View style={styles.friendContainer}>
        <Text style={styles.friendLabel}>Friends:</Text>
        <View style={styles.friendRow}>
          <Text style={styles.regularBlack}>Friend 1</Text>
        </View>
        <View style={styles.friendRow}>
          <Text style={styles.regularBlack}>Friend 2</Text>
        </View>
        <View style={styles.friendRow}>
          <Text style={styles.regularBlack}>Friend 3</Text>
        </View>
        <View style={styles.friendRow}>
          <Text style={styles.regularBlack}>Friend 4</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch", // Ensure inputs stretch to full width
    justifyContent: "flex-start", // Align items to the top
    padding: 20,
    backgroundColor: "#141414", // Charcoal grey background
  },
  row: {
    flexDirection: "row", // Arrange label and input in one line
    alignItems: "center", // Center items vertically in the row
    marginBottom: 20, // Add space between rows
  },
  rowRight: {
    flexDirection: "row", // Arrange label and input in one line
    alignItems: "center", // Center items vertically in the row
    marginBottom: 20, // Add space between rows
    justifyContent: "flex-end",
  },
  label: {
    width: 40,
    marginRight: 10,
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  regular: {
    marginRight: 10, // Space between label and input
    color: "#ccc", // Text color set to white
    fontSize: 15,
  },
  regularBlack: {
    marginRight: 10, // Space between label and input
    color: "#ccc", // Text color set to white
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    left: 20,
    top: 20, // Adjust this value if it needs to be lower or higher
    zIndex: 1, // Make sure it is clickable over other elements if necessary
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32, // Larger font size
    color: "white",
    fontWeight: "bold",
    textAlign: "center", // Center text horizontally
    marginVertical: 35, // Add vertical spacing
    alignSelf: "center", // Ensure the text is centered horizontally in the container
  },
  input: {
    flex: 1,
    borderBottomWidth: 0.5,
    padding: 10,
    height: 40,
    borderColor: "#ccc",
    borderRadius: 5, // Rounded corners for input fields
    backgroundColor: "#141414",
    color: "#000",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#555", // Solana's primary purple color
    borderRadius: 20, // More pronounced rounded corners for buttons
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold", // Bold text for better readability on buttons
  },
  friendContainer: {
    backgroundColor: "#333", // Light grey background
    padding: 20, // Increased padding for better spacing inside the container
    marginTop: 20, // Margin top to separate it from elements above
    borderRadius: 15, // Round corners for a softer look
    shadowColor: "#000", // Shadow for depth, optional
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6, // Elevation for Android shadow
    flex: 1,
    opacity: 0.9,
  },
  friendLabel: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18, // Increased font size for better readability
    color: "#ccc", // Dark grey for better contrast
    textTransform: "uppercase", // Optional: style choice to make the label stand out
    letterSpacing: 1, // Increase spacing between letters for a more refined look
    paddingTop: 5, // Padding top to align text better within its container
    paddingBottom: 5, // Padding bottom for symmetry with paddingTop
  },
  friendColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    padding: 10, // Increased padding for better spacing
    backgroundColor: "#333", // Lighter grey for background
    borderColor: "#d1d1d1", // Soft grey for border
    borderTopWidth: 0.5,
    borderRadius: 10, // Soften round edges
    shadowColor: "#000", // Optional: Adding shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    opacity: 0.9, // Optional: Adding elevation for Android shadow
  },
});

export default RequestScreen;
