export interface Asset {
    asset_id: number;
    project_id: number;
    building_name: string;
    building_code: string;
    floor_number: number;
    zone: string;
    gps_latitude: number;
    gps_longitude: number;
    construction_stage: string;
    inspection_status: string;
    notes: string;
    is_deleted: number;
    created_at: string;
    updated_at: string;
}

