// import { View } from "react-native";
// import { useTheme } from "react-native-paper";
// import { useAuthorization } from "../../utils/useAuthorization";
// import InitAccount from "./init-ui";
// import { useAnchorWallet } from "../../utils/useAnchorWallet";

// export function InitAccountFeature() {
//   const { authorizeSession, selectedAccount } = useAuthorization();
//   const anchorWallet = useAnchorWallet(authorizeSession, selectedAccount);

//   if (!selectedAccount) {
//     return null;
//   }
//   const theme = useTheme();

//   return (
//     <>
//       <View style={{ marginTop: 24, alignItems: "center" }}>
//         <InitAccount anchorWallet={anchorWallet!} />
//       </View>
//     </>
//   );
// }
