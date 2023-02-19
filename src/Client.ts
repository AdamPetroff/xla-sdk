import { ethers } from "ethers";
import BaseClient from "./BaseClient";
import { Blockchain, SUPPORTED_CONTRACT_VERSIONS } from "./constants";
import { ValveFactoryV002Client } from "./FactoryClient";
import { ValveV002Client } from "./ValveClient";

export default class XLAClient extends BaseClient {
  constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
    super(provider, signer);
  }

  static supportedBlockchains = Blockchain;

  getValveClient(
    valveAddress: string,
    blockchain: Blockchain,
    version?: SUPPORTED_CONTRACT_VERSIONS
  ) {
    if (version) {
      return this._getVersionSpecificValveClient(
        valveAddress,
        blockchain,
        version
      );
    }

    return new ValveV002Client(
      valveAddress,
      this._provider,
      this._signer,
      blockchain
    );
  }

  private _getVersionSpecificValveClient(
    valveAddress: string,
    blockchain: Blockchain,
    version: SUPPORTED_CONTRACT_VERSIONS
  ) {
    if (version === SUPPORTED_CONTRACT_VERSIONS.V002) {
      return new ValveV002Client(
        valveAddress,
        this._provider,
        this._signer,
        blockchain
      );
    } else {
      throw new Error("Unsupported contract version");
    }
  }

  getValveFactoryClient(
    blockchain: Blockchain,
    version?: SUPPORTED_CONTRACT_VERSIONS
  ) {
    if (version) {
      return this._getVersionSpecificFactoryClient(version, blockchain);
    }

    return new ValveFactoryV002Client(this._provider, this._signer, blockchain);
  }

  private _getVersionSpecificFactoryClient(
    version: SUPPORTED_CONTRACT_VERSIONS,
    blockchain: Blockchain
  ) {
    if (version === SUPPORTED_CONTRACT_VERSIONS.V002) {
      return new ValveFactoryV002Client(
        this._provider,
        this._signer,
        blockchain
      );
    } else {
      throw new Error("Unsupported contract version");
    }
  }
}
