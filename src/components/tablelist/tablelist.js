/* eslint-disable no-nested-ternary */
import React from 'react';
// import '~style/style.scss';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
    useTable,
    useFlexLayout,
    usePagination,
    useFilters,
    useGlobalFilter,
} from 'react-table';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import Emoji from '~components/emoji';

const Styles = styled.div`
  table {
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
    }

    th,
    td {
      margin: 0;
    }

    td {
        padding: 0;
    }

    tbody {
        tr {
            margin: 1rem 0;

            td {
                border: 0;
            }
        }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const StyleI = styled.i`
    border: solid #397790;
    border-width: 0 5px 5px 0;
    display: inline-block;
    padding: 15px;
`;

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length;

    return (count > 0) ? (
      <span>
        <input
          value={globalFilter || ''}
          onChange={(e) => {
            setGlobalFilter(e.target.value || undefined); // Set undefined to remove filter
          }}
          placeholder={`${count} företag...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </span>
    ) : (
    <span>
        Här var det tomt!
    </span>
    );
}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Sök igenom ${count} företag...`}
        css={css`
            max-width: 100%
        `}
      />
    );
  }

  // This is a custom filter UI for selecting
  // a unique option from a list
  function SelectColumnFilter({
    column: {
        filterValue, setFilter, preFilteredRows, id,
    },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
    console.log('select id', id);
    const someOptions = React.useMemo(() => (
        () => ((id === 'city') ? (
            [
                'Sävsjö',
                'Vrigstad',
                'Stockaryd',
                'Rörvik',
                'Hylletofta',
            ]
        ) : (id === 'type') ? (
            [
                'Trä',
                'Metall',
                'Möbler / träförädling',
                'Livsmedel',
                'Skor & kläder',
                'Plast / gummi',
                'Övrigt / Diverse',
            ]
        ) : null
    ))(), [id]);
    console.log(someOptions);
    console.log(options);

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        css={css`
            max-width: 100%
        `}
      >
        <option value="">Alla</option>
        {someOptions.map((option, i) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
}

function Table({ columns, data }) {
    const filterTypes = React.useMemo(
        () => ({
          // Or, override the default text filter to use
          // "startWith"
        text: (rows, id, filterValue) => {
            return rows.filter((row) => {
              const rowValue = row.values[id];
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true;
            });
          },
        }),
        [],
    );

    const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          minWidth: 30, // minWidth is only used as a limit for resizing
          width: 150, // width is used for both the flex-basis and flex-grow
          maxWidth: 200, // maxWidth is only used as a limit for resizing
          Filter: false,
        }),
        [],
    );

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      state,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page
      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      flatColumns,
      preGlobalFilteredRows,
      setGlobalFilter,
      // setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        defaultColumn, // Be sure to pass the defaultColumn option
        filterTypes,
        initialState: {
            pageIndex: 0,
            hiddenColumns: ['quality'],
         },
      },
      useFlexLayout,
      useFilters, // useFilters!
      useGlobalFilter,
      usePagination,
    );
    console.log('state', state);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {console.log('headersGroup', headerGroup)}
                {headerGroup.headers.map((column) => {
                console.log('column', column);
                return (typeof column.Header === 'string'
                && (column.id !== 'city' || (column.id === 'city' && location.pathname === '/alla'))) && (
                <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {/* Render the columns filter UI */}
                    <div>
                        {column.canFilter ? column.render('Filter') : null}
                    </div>
                </th>
                );
                })}
            </tr>
          ))}
            <tr>
                <th
                    colSpan={flatColumns.length}
                    style={{
                        textAlign: 'left',
                    }}
                >
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </th>
            </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            console.log('row', row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return ((cell.column.id !== 'city' || (cell.column.id === 'city' && location.pathname === '/alla'))
                  && cell.column.id !== 'type') && (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <a
            css={css`
                ${canPreviousPage ? ('cursor: pointer') : ('filter: saturate(0.25);')};
            `}
            role="button"
            tabIndex={0}
            onClick={() => gotoPage(0)}
            onKeyDown={(event) => {
                if (event.keycode === 13) {
                    gotoPage(0);
                }
            }}
            disabled={!canPreviousPage}
        >
            <span>
                <StyleI
                    id="arrow-left"
                    css={css`
                        transform: rotate(135deg);
                        webkit-transform: rotate(135deg);
                    `}
                />
                <StyleI
                    id="arrow-left"
                    css={css`
                        transform: rotate(135deg);
                        webkit-transform: rotate(135deg);
                    `}
                />
            </span>
        </a>
        {' '}
        <a
            css={css`
                ${canPreviousPage ? ('cursor: pointer;') : ('filter: saturate(0.25);')};
            `}
            role="button"
            tabIndex={0}
            onClick={() => previousPage()}
            onKeyDown={(event) => {
                if (event.keycode === 13) {
                    previousPage();
                }
            }}
            disabled={!canPreviousPage}
        >
            <span>
                <StyleI
                    id="arrow-left"
                    css={css`
                        transform: rotate(135deg);
                        webkit-transform: rotate(135deg);
                    `}
                />
            </span>
        </a>
        {' '}
        <span>
          Sida
        {' '}
          <strong>
            {pageIndex + 1}
            {' '}
            av
            {' '}
            {pageOptions.length}
          </strong>
        {' '}
        </span>
        {' '}
        <a
            css={css`
                ${canNextPage ? ('cursor: pointer') : ('filter: saturate(0.25);')};
            `}
            role="button"
            tabIndex={0}
            onClick={() => nextPage()}
            onKeyDown={(event) => {
                if (event.keycode === 13) {
                    nextPage();
                }
            }}
            disabled={!canNextPage}
        >
            <span>
                <StyleI
                    id="arrow-right"
                    css={css`
                        transform: rotate(-45deg);
                        webkit-transform: rotate(-45deg);
                    `}
                />
            </span>
        </a>
        {' '}
        <a
            css={css`
                ${canNextPage ? ('cursor: pointer') : ('filter: saturate(0.25);')};
            `}
            role="button"
            tabIndex={0}
            onClick={() => gotoPage(pageCount - 1)}
            onKeyDown={(event) => {
                if (event.keycode === 13) {
                    gotoPage(pageCount - 1);
                }
            }}
            disabled={!canNextPage}
        >
            <span>
                <StyleI
                    id="arrow-right"
                    css={css`
                        transform: rotate(-45deg);
                        webkit-transform: rotate(-45deg);
                    `}
                />
                <StyleI
                    id="arrow-right"
                    css={css`
                        transform: rotate(-45deg);
                        webkit-transform: rotate(-45deg);
                    `}
                />
            </span>
        </a>
      </div>
    </>
  );
}

const TableList = ({ data }) => {
    console.log('table data', data);


    const array = React.useMemo(() => data.company.edges.map((item) => item.node), []);

    function compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!Object.prototype.hasOwnProperty.call(a, key)
          || !Object.prototype.hasOwnProperty.call(b, key)) {
            return 0;
          }

          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    }
    const sortedData = React.useMemo(() => array.sort(compareValues('name', 'asc')), []);
    console.log(sortedData);

    const columns = React.useMemo(
        () => [
            {
                id: 'image',
                accessor: 'mainimage.id',
                Header: (() => null),
                Cell: ({ row }) => {
                    console.log(row);
                    return (
                        <div css={css`
                            max-height:500px;
                            overflow:hidden;
                            display:flex;
                            flex-grow:1;
                            @media (max-width: 769px) {
                                max-height:300px;
                            }
                        `}
                        >
                            <Img
                                fluid={row.original.mainimage.childImageSharp.fluid}
                                alt={row.original.name}
                                title={row.original.name}
                            />
                        </div>
                    );
                },
            },
            {
                id: 'name',
                accessor: 'name',
                Header: 'Sök på namn',
                Filter: DefaultColumnFilter,
                Cell: ({ row }) => {
                    console.log(row);
                    return (
                        <div
                            css={css`
                                padding-left: 0.75rem;
                            `}
                        >
                            <Link to={`/industri/${row.original.fields.slug}`}>
                                <h3
                                    css={css`
                                        white-space: normal;
                                        margin-top: 0.75rem;
                                        @media (max-width: 769px) {
                                            margin-top:0px;
                                        }
                                    `}
                                >
                                    {row.original.name}
                                </h3>
                            </Link>
                            <p css={css`text-transform: capitalize; font-style: italic;`}>{row.original.type}</p>
                            <p css={css`white-space: pre-wrap;`}>{row.original.summary}</p>
                        </div>
                    );
                },
            },
            {
                id: 'city',
                accessor: 'city',
                Header: 'Filtrera på stad',
                Filter: SelectColumnFilter,
            },
            {
                id: 'quality',
                accessor: 'quality',
                Header: 'Quality',
            },
            {
                id: 'type',
                accessor: 'type',
                Header: 'Filtrera på företagstyp',
                Filter: SelectColumnFilter,
            },
        ],
        [],
    );


	return (
		<Styles>
			<Table
				data={sortedData}
				columns={columns}
			/>
		</Styles>
	);
};

export default TableList;
