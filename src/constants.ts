export type BlockchainData = {
  chainId: number;
  valveFactoryAddress: string;
  currencyName: string;
};

export enum Blockchain {
  POLYGON = "POLYGON",
  ETH = "ETH",
}

const FACTORY_VALVE_POLYGON_V002 = "0xEe8a5F867695E2f336b9dB449DD14ac3eAECcfa7";
export enum SUPPORTED_CONTRACT_VERSIONS {
  V002 = 2,
}

export const FACTORIES = {
  POLYGON: {
    LATEST: FACTORY_VALVE_POLYGON_V002,
    [SUPPORTED_CONTRACT_VERSIONS.V002]: FACTORY_VALVE_POLYGON_V002,
  },
  ETH: {
    LATEST: "",
    [SUPPORTED_CONTRACT_VERSIONS.V002]: "",
  },
} as const;

export const BLOCKCHAIN_DATA: Record<Blockchain, BlockchainData> = {
  [Blockchain.POLYGON]: {
    chainId: 137,
    valveFactoryAddress: FACTORIES.POLYGON.LATEST,
    currencyName: "MATIC",
  },
  [Blockchain.ETH]: {
    chainId: 1,
    valveFactoryAddress: FACTORIES.ETH.LATEST,
    currencyName: "ETH",
  },
};
