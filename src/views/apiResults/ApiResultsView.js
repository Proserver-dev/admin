import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';
import {
    Container,
    TextField,
    Stack,
    Typography,
    Paper,
} from '@mui/material';
import {setSnackBar} from "../../redux/actions";
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";
import {useDispatch} from "react-redux";
import {reqGetApiResults} from "../../helpers/AppConfig";
import { faChevronUp, faChevronDown } from '@fortawesome/fontawesome-free-solid';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ApiResultsView = () => {
    const dispatch = useDispatch();
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetApiResults()
            .then(res => {
                setData(Object.values(res))
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)))
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    },[]);

    const columns = useMemo(
        () => [
            {
                Header: 'Code',
                accessor: 'code',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Status Code',
                accessor: 'status_code',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { sortBy: [{ id: 'code' }] },
        },
        useFilters,
        useGlobalFilter,
        useSortBy
    );

    useEffect(() => {
        setGlobalFilter(filterText || undefined);
    }, [filterText, setGlobalFilter]);

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    API Results
                </Typography>
            </Stack>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <Paper>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} style={{ borderBottom: '1px solid #ddd' }}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    style={{
                                        background: '#f2f2f2',
                                        padding: '8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {column.render('Header')}
                                    <span>
                      {column.isSorted ? (column.isSortedDesc ? (<FontAwesomeIcon icon={faChevronDown} />) : (<FontAwesomeIcon icon={faChevronUp} />)) : ''}
                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {Object.values(rows).map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} style={{ borderBottom: '1px solid #ddd' }}>
                                {Object.values(row.cells).map((cell) => (
                                    <td {...cell.getCellProps()} style={{ padding: '8px' }}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Paper>
        </Container>
    );
};

export default ApiResultsView;