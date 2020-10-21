
export interface metaData
{
    size: number;
    ext: string;
    filename: string;
}


export interface postData
{
    width: number;
    height: number;
    watermark: {
        width: number,
        height: number,
        porcentage: number,
    }
}
