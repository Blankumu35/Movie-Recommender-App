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
        variant="outlined"
        sx={{
          '.MuiPaginationItem-root': {
            color: 'white',        // Text color
            borderColor: 'white',  // Border color for outlined variant
          },
          '.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'white',  // Background color for selected page
            color: 'black',            // Text color for selected page
          },
          '.MuiPaginationItem-root: hover:not(.MuiPaginationItem-root.Mui-selected)': {
            color: 'black',       
            backgroundColor: 'rgba(255,255,255,0.5)', 
            borderColor: 'white',  
          },
          '.MuiPaginationItem-ellipsis': {
            color: 'white',  
          }
        }}
      />
    </Stack>
  );
};

export default CustomPagination;