import { POST_TYPE } from "src/common/enums";
import { postData } from "../interface/metaData.interface";

export class PostDto {
    id: string;
    title: string;
    body: string;
    postType: POST_TYPE;
    metaData: postData;
    group_id: string;
    originalPoster: string;
    tags: string[];
    created_at: Date;
    updated_at: Date;
    approval: boolean;
    banned: boolean;
}

