import { Response } from "express";

type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
};

type TReponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: TMeta;
    data?: T;
};

const sendResponse = <T>(res: Response, data: TReponse<T>) => {
    const { statusCode, success, message, meta, data: DataReponse } = data;

    res.status(statusCode).json({
        success,
        message,
        meta,
        data: DataReponse,
    });
};

export default sendResponse;
