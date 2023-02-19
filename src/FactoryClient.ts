import { ContractReceipt, ethers, utils } from "ethers";
import { OwnableContract } from "./BaseClient";
import { BLOCKCHAIN_DATA, Blockchain, BlockchainData } from "./constants";
import { XLAValveFactory_v002__factory } from "./generated/factories";
import { XLARSCValveFactory } from "./generated/XLAValveFactory_v002";
import {
  BigNumberLike,
  ContractCallOptions,
  ValveRecipientType,
  getMessageFromEthersError,
  valveRecipientsToContractFormat,
  toBigNumber,
  toContractPercent,
} from "./utils/common";

class BaseFactoryV002Client extends OwnableContract {
  blockchain: Blockchain;
  blockchainData: BlockchainData;

  constructor(
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    blockchain: Blockchain
  ) {
    super(provider, signer);

    this.blockchain = blockchain;
    this.blockchainData = BLOCKCHAIN_DATA[blockchain];
  }

  async setFeeWallet(
    factoryAddress: string,
    feeWallet: string,
    options?: ContractCallOptions
  ) {
    try {
      const factory = XLAValveFactory_v002__factory.connect(
        factoryAddress,
        this._signer
      );
      options?.eventHandlers?.waitingForConfirmation?.();
      const res = await factory.setPlatformWallet(feeWallet);
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

  async setFactoryFee(
    factoryAddress: string,
    feePercent: BigNumberLike,
    options?: ContractCallOptions
  ) {
    try {
      const factory = XLAValveFactory_v002__factory.connect(
        factoryAddress,
        this._signer
      );

      options?.eventHandlers?.waitingForConfirmation?.();
      const res = await factory.setPlatformWallet(
        toContractPercent(feePercent)
      );
      options?.eventHandlers?.waitingForCompletion?.();

      return await res.wait();
    } catch (e: any) {
      console.log(e);
      const message =
        e.code === "INVALID_ARGUMENT" && e.argument === "name"
          ? "Entered address is invalid"
          : getMessageFromEthersError(e).message;
      throw new Error(e);
    }
  }
}

type CreateValveParams = {
  controller: string | null;
  isImmutable: false;
  immutableController: false;
  autoNativeTokenDistribution: boolean;
  minAutoDistributeAmountEther: BigNumberLike;
  distributors: string[];
  recipients: ValveRecipientType[];
  creationId: Uint8Array;
};

export class ValveFactoryV002Client extends BaseFactoryV002Client {
  async createValveContract(
    {
      controller: _controller,
      isImmutable,
      immutableController,
      autoNativeTokenDistribution,
      minAutoDistributeAmountEther,
      distributors,
      recipients,
      creationId,
    }:
      | CreateValveParams
      | (Omit<CreateValveParams, "controller" | "isImmutable"> & {
          isImmutable: true;
          controller: any;
        }),
    options?: ContractCallOptions
  ): Promise<ContractReceipt> {
    try {
      const factory = XLAValveFactory_v002__factory.connect(
        this.blockchainData.valveFactoryAddress,
        this._signer
      );
      const controller = isImmutable
        ? ethers.constants.AddressZero
        : _controller || ethers.constants.AddressZero;

      const { addresses, percentages } =
        valveRecipientsToContractFormat(recipients);

      const data: XLARSCValveFactory.RSCCreateDataStruct = {
        controller,
        immutableController,
        autoNativeTokenDistribution,
        initialRecipients: addresses,
        percentages,
        minAutoDistributeAmount: toBigNumber(minAutoDistributeAmountEther)
          .times(1e18)
          .toString(),
        distributors,
        creationId,
      };

      options?.eventHandlers?.waitingForConfirmation?.();
      const res = await factory.createRSCValve(data);
      options?.eventHandlers?.waitingForCompletion?.();

      const receipt = await res.wait();

      return receipt;
    } catch (e: any) {
      const message =
        e.code === "INVALID_ARGUMENT" && e.argument === "name"
          ? "Entered address is invalid"
          : getMessageFromEthersError(e).message;

      throw new Error(message);
    }
  }
}
