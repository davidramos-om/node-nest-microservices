export interface comment
{
    id: string;
    body: string;
    user_id: string;
    post_id: string;
    parent_id: string;
    created_at: Date;
    updated_at: Date;
    banned: boolean;
}
