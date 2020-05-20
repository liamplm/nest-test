export interface GetBySizeResponseDTO<T> {
    result: T[];
    meta: [{ total: number }];
}
