import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CustomPagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" marginTop={2}>
      <Pagination 
        count={totalPages} 
        page={currentPage} 
        onChange={(event, value) => handlePageChange(value)} 
        size='large'
        color="primary" 
        variant="outlined"
      />
    </Stack>
  );
};

export default CustomPagination;