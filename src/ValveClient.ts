import { ethers } from "ethers";
import BaseClient, { OwnableContract } from "./BaseClient";
import { BLOCKCHAIN_DATA, Blockchain } from "./constants";
import { XLAValve_v002__factory } from "./generated/factories";
import { XLAValve_v002 } from "./generated/XLAValve_v002";
import {
  ContractCallOptions,
  ValveRecipientType,
  getMessageFromEthersError,
  valveRecipientsToContractFormat,
} from "./utils/common";

class BaseContractV002Client extends OwnableContract {
  blockchain: string;
  blockchainData: any;
  contract: XLAValve_v002;

  constructor(
    constractAddress: string,
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    blockchain: Blockchain
  ) {
    super(provider, signer);

    this.blockchain = blockchain;
    this.blockchainData = BLOCKCHAIN_DATA[blockchain];
    this.contract = XLAValve_v002__factory.connect(
      constractAddress,
      this._signer
    );
  }

  async distributeNativeCurrency(options?: ContractCallOptions) {
    try {
      if (!(await this.contract.distributors(this._signer.getAddress()))) {
        throw new Error(
          `Connected wallet doesn't have permission to distribute ${this.blockchainData.currencyName}}`
        );
      }
      options?.eventHandlers?.waitingForConfirmation?.();
      const tx = await this.contract.functions.redistributeNativeToken();
      options?.eventHandlers?.waitingForCompletion?.();
      const receipt = await tx.wait();
      return receipt;
    } catch (e: any) {
      console.log(e);
      const message =
        e.code === "INVALID_ARGUMENT" && e.argument === "name"
          ? "Entered address is invalid"
          : getMessageFromEthersError(e).message;
      throw new Error(message);
    }
  }

  async distribute(tokenAddress: string, options?: ContractCallOptions) {
    try {
      if (!(await this.contract.distributors(this._signer.getAddress()))) {
        throw new Error(
          "Connected wallet doesn't have permission to distribute tokens"
        );
      }
      options?.eventHandlers?.waitingForConfirmation?.();
      const tx = await this.contract.functions.redistributeToken(tokenAddress);
      options?.eventHandlers?.waitingForCompletion?.();
      const receipt = await tx.wait();
      return receipt;
    } catch (e: any) {
      console.log(e);
      const message =
        e.code === "INVALID_ARGUMENT" && e.argument === "name"
          ? "Entered address is invalid"
          : getMessageFromEthersError(e).message;
      throw new Error(message);
    }
  }

  async setController(
    controller: string | null,
    options?: ContractCallOptions
  ) {
    const _controller = controller || ethers.constants.AddressZero;

    options?.eventHandlers?.waitingForConfirmation?.();
    const res = await this.contract.setController(_controller);
    options?.eventHandlers?.waitingForCompletion?.();

    const receipt = await res.wait();

    return receipt;
  }

  async removeDistributor(distributor: string, options?: ContractCallOptions) {
    return await this._setDistributor(distributor, false, options);
  }

  async addDistributor(distributor: string, options?: ContractCallOptions) {
    return await this._setDistributor(distributor, true, options);
  }

  async _setDistributor(
    distributor: string,
    add: boolean,
    options?: ContractCallOptions
  ) {
    options?.eventHandlers?.waitingForConfirmation?.();
    const res = await this.contract.setDistributor(distributor, add);
    options?.eventHandlers?.waitingForCompletion?.();

    return await res.wait();
  }
}

export class ValveV002Client extends BaseContractV002Client {
  // constructor(contractAddress: string, provider: ethers.providers.Provider, signer: ethers.Signer) {
  //   super(provider, signer);
  // }

  async setRecipients(
    _recipients: ValveRecipientType[],
    options?: ContractCallOptions
  ) {
    const { addresses, percentages } =
      valveRecipientsToContractFormat(_recipients);
    try {
      options?.eventHandlers?.waitingForConfirmation?.();
      const res = await this.contract.setRecipients(addresses, percentages);
      options?.eventHandlers?.waitingForCompletion?.();

      return await res.wait();
    } catch (e: any) {
      console.log(e);
      const message =
        e.code === "INVALID_ARGUMENT" && e.argument === "name"
          ? "Entered address is invalid"
          : getMessageFromEthersError(e).message;

      throw new Error(message);
    }
  }
}
