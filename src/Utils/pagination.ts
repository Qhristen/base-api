export function paginate(data: any, page: any, limit: any) {
  const [result, total] = data;
  const lastPage: any = Math.ceil(total / limit);
  const nextPage: any = page + 1 > lastPage ? 0 : page + 1;
  const prevPage: any = page - 1 < 1 ? 0 : page - 1;
  return {
    data: [...result],
    totalCount: total,
    currentPage: parseInt(page),
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}
