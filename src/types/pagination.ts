export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    total: number;
    current: number;
  };
};
