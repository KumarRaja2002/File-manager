export const sortHelper = {

    dynamicSort(sort_by: string, sort_type: string) {
      let sortString = 'created_at desc';
      if (sort_by && sort_type) {
          sortString = `${sort_by} ${sort_type}`;
      }

      return sortString;
  },


    userWiseSort: (query: any) => {
      const sortBy = query.sort_by || 'created_at';
      const sortType = query.sort_type || 'desc';
      const columnMapping: { [key: string]: string } = {
        file_id: 'files.id',
        name: 'files.name',
        mime_type: 'files.mime_type',
        size: 'files.size',
        path: 'files.path',
        uploaded_at: 'files.uploaded_at',
        uploaded_by: 'files.uploaded_by',
        status: 'files.status',
        category_id:'categories.id',
        category_name: 'categories.name',
        type: 'files.type',
        tags: 'files.tags',
        created_at:'files.created_at',
        updated_at:'files.updated_at'
         
          
      };
      const sortColumn = columnMapping[sortBy] || columnMapping['created_at'];

      return `${sortColumn} ${sortType}`;
  },

  sort: (query: any) => {
    const sortBy = query.sort_by || 'name';
    const sortType = query.sort_type || 'asc';
    return `${sortBy} ${sortType}`;
  }
  };

 
