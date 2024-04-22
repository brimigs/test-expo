import { PublicKey } from "@solana/web3.js";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { AppModal } from "../ui/app-modal";
import BigNumber from "bignumber.js";
import { createQR, encodeURL } from "@solana/pay";
import QRCode from "react-native-qrcode-svg";

export function SolanaPayButton({ address }: { address: PublicKey }) {
  const [showPayModal, setShowPayModal] = useState(false);
  let ref = useRef(null);

  const [qrValue, setQRValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <QRCode
          value="www.google.com"
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>
      <View>
        <SolPayModal
          hide={() => setShowPayModal(false)}
          show={showPayModal}
          address={address}
        />
        <Button
          mode="contained"
          onPress={() => setShowPayModal(true)}
          style={{ marginLeft: 6 }}
        >
          Create QR Code
        </Button>
      </View>
    </>
  );
}

export function SolPayModal({
  hide,
  show,
  address,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
}) {
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");
  const [url, setUrl] = useState<URL>();
  const [qrValue, setQrValue] = useState("");
  const number = BigNumber(amount);
  let ref = useRef(null);

  const handleSubmit = () => {
    console.log("test");
    const newUrl = encodeURL({ recipient: address, amount: number, memo });
    setUrl(newUrl);
    console.log(url);
    setQrValue(newUrl.toString());
  };

  useEffect(() => {
    if (url) {
      const qr = createQR(url, 512, "transparent");
      console.log(qr);
      if (ref.current && number) {
        qr.append(ref.current);
      }
    }
  }, [url]);

  return (
    <AppModal
      title="Payment Request for @brimigs"
      hide={hide}
      show={show}
      submit={handleSubmit}
      submitLabel="Create QR"
      submitDisabled={!memo || !amount}
    >
      <View style={{ padding: 20 }}>
        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <TextInput
          label="Memo"
          value={memo}
          onChangeText={setMemo}
          mode="outlined"
        />
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 30,
  },
  box: {
    backgroundColor: "white",
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 30,
  },
});
