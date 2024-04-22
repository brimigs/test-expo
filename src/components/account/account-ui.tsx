import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  useGetBalance,
  useGetTokenAccountBalance,
  useGetTokenAccounts,
  useRequestAirdrop,
  useTransferSol,
} from "./account-data-access";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  useTheme,
  Button,
  ActivityIndicator,
  DataTable,
  TextInput,
} from "react-native-paper";
import { useState, useMemo } from "react";
import { ellipsify } from "../../utils/ellipsify";
import { AppModal } from "../ui/app-modal";

function lamportsToSol(balance: number) {
  return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000;
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address });
  return (
    <>
      <View style={styles.accountBalance}>
        <Text variant="displayMedium">
          ${query.data ? lamportsToSol(query.data) : "..."}
        </Text>
      </View>
    </>
  );
}

export function AccountButtonGroup({ address }: { address: PublicKey }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <View style={styles.accountButtonGroup}>
        <DepositModal
          hide={() => setShowDepositModal(false)}
          show={showDepositModal}
          address={address}
        />
        <WithdrawModal
          hide={() => setShowWithdrawModal(false)}
          show={showWithdrawModal}
          address={address}
        />
        <Button
          mode="contained"
          onPress={() => setShowDepositModal(true)}
          style={{ marginLeft: 6 }}
        >
          Add Cash
        </Button>
        <Button
          mode="contained"
          onPress={() => setShowWithdrawModal(true)}
          style={{ marginLeft: 6 }}
        >
          Cash Out
        </Button>
      </View>
    </>
  );
}

export function DepositModal({
  hide,
  show,
  address,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
}) {
  const transferSol = useTransferSol({ address });
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <AppModal
      title="Deposit into Cash Account"
      hide={hide}
      show={show}
      submit={() => {
        transferSol
          .mutateAsync({
            destination: new PublicKey(destinationAddress),
            amount: parseFloat(amount),
          })
          .then(() => hide());
      }}
      submitLabel="Deposit"
      submitDisabled={!destinationAddress || !amount}
    >
      <View style={{ padding: 20 }}>
        <TextInput
          label="Amount (SOL)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
      </View>
    </AppModal>
  );
}

export function WithdrawModal({
  hide,
  show,
  address,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
}) {
  const transferSol = useTransferSol({ address });
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <AppModal
      title="Withdraw from Cash Account"
      hide={hide}
      show={show}
      submit={() => {
        transferSol
          .mutateAsync({
            destination: new PublicKey(destinationAddress),
            amount: parseFloat(amount),
          })
          .then(() => hide());
      }}
      submitLabel="Withdraw"
      submitDisabled={!destinationAddress || !amount}
    >
      <View style={{ padding: 20 }}>
        <TextInput
          label="Amount (SOL)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
      </View>
    </AppModal>
  );
}

export function PendingTransactions({ address }: { address: PublicKey }) {
  let query = useGetTokenAccounts({ address });
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 3; // Items per page
  const theme = useTheme();

  const items = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return query.data?.slice(start, end) ?? [];
  }, [query.data, currentPage, itemsPerPage]);

  // Calculate the total number of pages
  const numberOfPages = useMemo(() => {
    return Math.ceil((query.data?.length ?? 0) / itemsPerPage);
  }, [query.data, itemsPerPage]);

  return (
    <>
      {/* Active Escrows Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Pending Payments
        </Text>
        <Modal
          hide={() => setShowModal(false)}
          show={showModal}
          address={address}
        />
      </View>
      <ScrollView>
        {query.isLoading && <ActivityIndicator animating={true} />}
        {query.isError && (
          <Text
            style={{
              padding: 8,
              backgroundColor: theme.colors.errorContainer,
              color: theme.colors.error,
            }}
          >
            Error: {query.error?.message.toString()}
          </Text>
        )}
        {query.isSuccess && (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>To</DataTable.Title>
                <DataTable.Title>Memo</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>

              {query.data.length === 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text variant="bodyMedium">No pending payments.</Text>
                </View>
              )}

              {query.data.map(({ account, pubkey }) => (
                <DataTable.Row key={pubkey.toString()}>
                  <DataTable.Cell>
                    {ellipsify(pubkey.toString())}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {ellipsify(account.data.parsed.info.mint)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <AccountTokenBalance address={pubkey} />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              {query.data.length > 3 && (
                <DataTable.Pagination
                  page={currentPage}
                  numberOfPages={numberOfPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  label={`${currentPage + 1} of ${numberOfPages}`}
                  numberOfItemsPerPage={itemsPerPage}
                  selectPageDropdownLabel={"Rows per page"}
                />
              )}
            </DataTable>
          </>
        )}
      </ScrollView>

      <View style={{ height: 50 }} />

      {/* Pending Requests Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Pending Requests
        </Text>
      </View>
      <ScrollView>
        {query.isLoading && <ActivityIndicator animating={true} />}
        {query.isError && (
          <Text
            style={{
              padding: 8,
              backgroundColor: theme.colors.errorContainer,
              color: theme.colors.error,
            }}
          >
            Error: {query.error?.message.toString()}
          </Text>
        )}
        {query.isSuccess && (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>From</DataTable.Title>
                <DataTable.Title>Memo</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>

              {query.data.length === 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text variant="bodyMedium">No pending requests.</Text>
                </View>
              )}

              {query.data.map(({ account, pubkey }) => (
                <DataTable.Row key={pubkey.toString()}>
                  <DataTable.Cell>
                    {ellipsify(pubkey.toString())}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {ellipsify(account.data.parsed.info.mint)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <AccountTokenBalance address={pubkey} />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </>
        )}
      </ScrollView>
    </>
  );
}

export function AccountTokenBalance({ address }: { address: PublicKey }) {
  const query = useGetTokenAccountBalance({ address });
  return query.isLoading ? (
    <ActivityIndicator animating={true} />
  ) : query.data ? (
    <Text>{query.data?.value.uiAmount}</Text>
  ) : (
    <Text>Error</Text>
  );
}

export function Modal({
  hide,
  show,
  address,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
}) {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <AppModal
      title="Create New Escrow"
      hide={hide}
      show={show}
      submit={() => {}}
      submitLabel="Submit"
      submitDisabled={!destinationAddress || !amount}
    >
      <View style={{ padding: 20 }}>
        <TextInput
          label="Amount (SOL)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <TextInput
          label="Recipient"
          value={destinationAddress}
          onChangeText={setDestinationAddress}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <TextInput
          label="Duration"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  accountBalance: {
    marginTop: 12,
  },
  accountButtonGroup: {
    paddingVertical: 4,
    flexDirection: "row",
  },
  error: {
    color: "red",
    padding: 8,
  },
});
