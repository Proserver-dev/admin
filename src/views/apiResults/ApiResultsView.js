import React, {useEffect, useMemo, useState} from 'react';
import {
    Container,
    TextField,
    Stack,
    Typography,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import {useTable, useSortBy, useFilters, useGlobalFilter} from 'react-table';
import {setSnackBar} from '../../redux/actions';
import {useDispatch} from 'react-redux';
import {reqGetApiResults} from '../../helpers/AppConfig';
import {
    faChevronUp,
    faChevronDown,
} from '@fortawesome/fontawesome-free-solid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTranslation} from "react-i18next";

const ApiResultsView = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetApiResults()
            .then((res) => {
                setData(Object.values(res));
            })
            .catch((err) => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            });
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "APP_TABLE_COL_CODE",
                accessor: 'code',
            },
            {
                Header: "APP_TABLE_COL_DESCRIPTION",
                accessor: 'description',
            },
            {
                Header: "APP_TABLE_COL_STATUS_CODE",
                accessor: 'status_code',
                Cell: ({value}) => <div style={{textAlign: 'left'}}>{value}</div>,
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
            initialState: {sortBy: [{id: 'code'}]},
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
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={5}
                marginTop={5}
            >
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_API_RESULTS")}
                </Typography>
            </Stack>
            <TextField
                label={t("APP_SEARCH_TXT")}
                variant="outlined"
                fullWidth
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{marginBottom: 2}}
            />
            <Paper>
                <Table {...getTableProps()} style={{width: '100%'}}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={{
                                            background: '#f2f2f2',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            textAlign: column.id === 'status_code' ? 'left' : 'left',
                                        }}
                                    >
                                        {t(column.render('Header'))}
                                        <span>
                      {column.isSorted ? (
                          column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faChevronDown}/>
                          ) : (
                              <FontAwesomeIcon icon={faChevronUp}/>
                          )
                      ) : (
                          ''
                      )}
                    </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {Object.values(rows).map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {Object.values(row.cells).map((cell) => (
                                        <TableCell {...cell.getCellProps()} style={{padding: '8px'}}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default ApiResultsView;
