export interface Asset {
    assetId: number;
    projectId: number;
    buildingName: string;
    buildingCode: string;
    floorNo: number;
    zone: string;
    gpsLatitude: number;
    gpsLongitude: number;
    constructionStage: string;
    inspectionStatus: string;
    notes: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

