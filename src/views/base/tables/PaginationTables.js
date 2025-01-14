import React, { useState } from 'react';
import { styled } from '@mui/system';
import DataTable from 'react-data-table-component';
import { TablePagination, tablePaginationClasses as classes } from '@mui/base/TablePagination';
import { TextField } from '@mui/material';

const columns = [
  {
    name: 'Dessert',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Calories',
    selector: row => row.calories,
    sortable: true,
    right: true,
  },
  {
    name: 'Fat',
    selector: row => row.fat,
    sortable: true,
    right: true,
  },
];

const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#fff',
      border: '1px solid #DAE2ED',
    },
  },
  cells: {
    style: {
      border: '1px solid #DAE2ED',
    },
  },
};

export default function TableWithReactDataTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter rows berdasarkan teks pencarian
  const filteredRows = rows.filter(item => 
    item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Root sx={{ maxWidth: '100%', width: 500 }}>
      {/* Input Pencarian */}
      <TextField
        label="Search"
        variant="outlined"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        style={{ marginBottom: '10px' }}
      />

      <DataTable
        columns={columns}
        data={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        customStyles={customStyles}
        pagination={false}
      />

      <CustomTablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        colSpan={3}
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        slotProps={{
          select: {
            'aria-label': 'rows per page',
          },
          actions: {
            showFirstButton: true,
            showLastButton: true,
          },
        }}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Root>
  );
}

const rows = [
  { name: 'Cupcake', calories: 305, fat: 3.7 },
  { name: 'Donut', calories: 452, fat: 25.0 },
  { name: 'Eclair', calories: 262, fat: 16.0 },
  { name: 'Frozen yoghurt', calories: 159, fat: 6.0 },
  { name: 'Gingerbread', calories: 356, fat: 16.0 },
  { name: 'Honeycomb', calories: 408, fat: 3.2 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9.0 },
  { name: 'Jelly Bean', calories: 375, fat: 0.0 },
  { name: 'KitKat', calories: 518, fat: 26.0 },
  { name: 'Lollipop', calories: 392, fat: 0.2 },
  { name: 'Marshmallow', calories: 318, fat: 0 },
  { name: 'Nougat', calories: 360, fat: 19.0 },
  { name: 'Oreo', calories: 437, fat: 18.0 },
];

const Root = styled('div')`
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }
`;

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;
