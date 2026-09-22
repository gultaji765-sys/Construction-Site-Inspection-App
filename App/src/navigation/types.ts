import { Asset } from "../models/Asset";

export  type RootStackList = {
  Dashboard: undefined;
  AssetList: undefined;
  AssetDetails: {
    asset: Asset;
  };
};