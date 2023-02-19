import ethers from "ethers";
import { Ownable } from "./generated/Ownable";
import { Ownable__factory } from "./generated/factories";

export default class BaseClient {
  _provider: ethers.providers.Provider;
  _signer: ethers.Signer;

  constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
    this._provider = provider;
    this._signer = signer;
  }
}

export class OwnableContract extends BaseClient {
  //@ts-ignore
  contract: Ownable;

  async transferOwnership(newOwner: string) {
    return (await this.contract.transferOwnership(newOwner)).wait();
  }

  async renounceOwnership() {
    return (await this.contract.renounceOwnership()).wait();
  }

  async owner() {
    return await this.contract.owner();
  }
}
