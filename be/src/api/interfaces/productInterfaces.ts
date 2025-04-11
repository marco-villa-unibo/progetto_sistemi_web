interface ListFilters {
  isDeleted?: boolean;
  includeDeleted?: boolean;
}

// interfacce per la ricerca con filtri
export interface GetAllProductFilters extends ListFilters {}
