export type TSortOrder = "ASC" | "DESC";

export interface IListSearchParams<TStatus extends string = string> {
  keyword?: string;
  page?: string;
  sort?: TSortOrder;
  status?: TStatus;
}
