import XLAClient from "./Client";
import BaseClient from "./BaseClient";

export default XLAClient;

export { ValveFactoryV002Client } from "./FactoryClient";
export { ValveV002Client } from "./ValveClient";
export { OwnableContract } from "./BaseClient";
export { BaseClient };
export {
  BlockchainData,
  SUPPORTED_CONTRACT_VERSIONS,
  FACTORIES,
  BLOCKCHAIN_DATA,
} from "./constants";

export { toBigNumber } from "./utils/common";
export type {
  BigNumberLike,
  ContractCallOptions,
  TransactionEventHandlers,
  ValveRecipientType,
} from "./utils/common";
