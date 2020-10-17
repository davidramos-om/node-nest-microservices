import { POST_TYPE } from "src/common/enums";
import { metaData } from "./metaData.interface";

export interface post {
    id: string;
    title: string;
    body: string;
    postType: POST_TYPE;
    metaData: metaData;
    group_id: string;
    originalPoster: string;
    tags: string[];
    created_at: Date;
    updated_at: Date;
    approval: boolean;
    banned: boolean;
}

