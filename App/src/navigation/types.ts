import { Asset } from "../models/Asset";

export  type RootStackList = {
  Dashboard: undefined;
  AssetList: undefined;
  AssetDetails: {
    asset_id: number;
  };
  AssetForm: {
    mode: 'create' | 'edit';
    assetId? : number
  };
  InspectionForm: {
    assetId: number;
  };
};



