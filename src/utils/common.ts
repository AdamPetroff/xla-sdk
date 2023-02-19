import { ethers } from "ethers";
import BigNumber from "bignumber.js";

export function getMessageFromEthersError(e: any): {
  message: string;
  shouldRetry: boolean;
  contractException?: boolean;
} {
  // console.log(JSON.stringify(e));

  console.log(e.code);
  if (e.code === 4001) {
    return { message: "Transaction canceled", shouldRetry: false };
  } else if (e.code === "ACTION_REJECTED") {
    return { message: "Transaction canceled", shouldRetry: false };
  } else if (e.code === -32002) {
    return {
      message: "Connect request already pending. Check your wallet",
      shouldRetry: false,
    };
  } else if (e.code === "CALL_EXCEPTION") {
    return { message: "Something went wrong", shouldRetry: true };
  } else if (e.code === "INSUFFICIENT_FUNDS") {
    return { message: "Insufficient funds", shouldRetry: false };
  } else if (e.code === "UNPREDICTABLE_GAS_LIMIT") {
    if (e.error?.data?.message) {
      return {
        message: e.error.data.message,
        shouldRetry: true,
        contractException: true,
      };
    } else if (e.error?.message) {
      return {
        message: e.error.message,
        shouldRetry: true,
        contractException: true,
      };
    } else if (e.message) {
      return { message: e.message, shouldRetry: true, contractException: true };
    }
  } else if (e.code === "REPLACEMENT_UNDERPRICED") {
    return {
      message: "Replacement transaction was underpriced. Please try again",
      shouldRetry: false,
    };
  } else if (e.code === "TRANSACTION_REPLACED") {
    return {
      message: "Transaction was replaced. Please try again",
      shouldRetry: false,
    };
  }
  if (e?.data?.message) {
    return {
      message:
        (e as { data: { message: string } })?.data?.message ||
        "Something went wrong",
      shouldRetry: true,
    };
  }
  return {
    message: (e as { message: string })?.message || "Something went wrong",
    shouldRetry: true,
  };
}

export type BigNumberLike = ethers.BigNumberish | number | string | BigNumber;

export function toBigNumber(value: BigNumberLike): BigNumber {
  return new BigNumber(value.toString());
}

export function toContractPercent(value: BigNumberLike): string {
  return toBigNumber(value).times(100000).decimalPlaces(0).toString();
}

export type ValveRecipientType = { percentage: BigNumberLike; address: string };

export function valveRecipientsToContractFormat(
  recipients: ValveRecipientType[]
) {
  const [addresses, percentages] = recipients.reduce<[string[], string[]]>(
    ([addresses, percentages], item) => {
      const percentage = toBigNumber(item.percentage);
      if (percentage.lte(0)) {
        return [addresses, percentages];
      }

      return [
        [...addresses, item.address],
        [...percentages, toContractPercent(percentage)],
      ];
    },
    [[], []]
  );

  return { addresses, percentages };
}

export type TransactionEventHandlers = {
  waitingForConfirmation?: () => void;
  waitingForCompletion?: () => void;
};

export type ContractCallOptions = {
  eventHandlers?: TransactionEventHandlers;
};
