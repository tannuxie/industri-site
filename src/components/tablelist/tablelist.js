import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
    useTable,
    useFlexLayout,
    usePagination,
    useFilters,
    useGlobalFilter,
} from 'react-table';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import queryString from 'query-string';
import { rhythm, scale } from '../../style/typography';
import { compareValues } from '~components/functions';

const Styles = styled.div`
    display: block;
    max-width: 100%;

    .tableWrap {
        display: block;
        max-width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        border-bottom: 1px solid black;
    }

    table {
        width: 100%;
        min-width: 100%!important;
        border-spacing: 0;

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        tr:first-of-type {
            th {
                padding-bottom: 1rem;
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
`;

const ArrowBase = styled.span`
    display: flex;
    i {
        border: solid #4e4e4e;
        border-width: 0 5px 5px 0;
        display: inline-block;
        padding: 15px;

    }
`;

const ArrowLeftStyles = css`
    transform: rotate(135deg);
    webkit-transform: rotate(135deg);
`;

const ArrowRightStyles = css`
    transform: rotate(-45deg);
    webkit-transform: rotate(-45deg);
`;

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length;

    return (count > 0) ? (
        <span id="table-results-number">
            {`${count} företag...`}
        </span>
    ) : (
        <span
            id="table-results-none"
            css={css`
                padding: 2rem 0;
            `}
        >
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
        placeholder={`Bland ${count} företag`}
        css={css`
            max-width: 100%;
        `}
        className='input'
        type="text"
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
    // const options = React.useMemo(() => {
    //   const options = new Set();
    //   preFilteredRows.forEach((row) => {
    //     options.add(row.values[id]);
    //   });
    //   return [...options.values()];
    // }, [id, preFilteredRows]);
    // console.log('select id', id);
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
                'Möbler / Träförädling',
                'Livsmedel',
                'Skor & Kläder',
                'Plast / Gummi',
                'Övrigt / Diverse',
            ]
        ) : null
    ))(), [id]);
    // console.log(someOptions);
    // console.log(options);
    const defaultAllOption = React.useMemo(() => (
        () => ((id === 'city')
        ? 'En stad'
        : (id === 'type')
        ? 'En bransch'
        : 'Alla'
    ))(), [id]);
    // Render a multi-select box
    return (
        <div className="select">
            <select
                value={filterValue}
                onChange={(e) => {
                setFilter(e.target.value || undefined);
                }}
                css={css`
                    max-width: 100%;
                `}
            >
                <option value="">{defaultAllOption}</option>
                {someOptions.map((option, i) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
        </div>
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

    // console.log(location);
    // console.log('location.search', location.search);
    const parsed = (typeof window !== 'undefined') ? queryString.parse(location.search) : '';
    // console.log('queryString parsed', parsed);

    const citySearchString = React.useMemo(() => (
        () => {
            if (typeof window !== 'undefined') {
                if (!location.pathname.startsWith('/industri')) {
                    return '';
                }
                if (parsed.stad) {
                    switch (parsed.stad) {
                        case 'savsjo':
                            return 'Sävsjö';
                        case 'vrigstad':
                            return 'Vrigstad';
                        case 'stockaryd':
                            return 'Stockaryd';
                        case 'rorvik':
                            return 'Rörvik';
                        case 'hylletofta':
                            return 'Hylletofta';
                        default:
                            return '';
                    }
                } else {
                    return '';
                }
            } else {
                return null;
            }
        }
    )(), [parsed]);
    // console.log('citySearchString', citySearchString);

    const typeSearchString = React.useMemo(() => (
        () => {
            if (parsed.bransch) {
                switch (parsed.bransch) {
                    case 'tra':
                        return 'Trä';
                    case 'metall':
                        return 'Metall';
                    case 'mobler':
                        return 'Möbler / Träförädling';
                    case 'livsmedel':
                        return 'Livsmedel';
                    case 'skor':
                        return 'Skor & Kläder';
                    case 'plast':
                        return 'Plast / Gummi';
                    case 'ovrigt':
                        return 'Övrigt / Diverse';
                    default:
                        return '';
                }
            } else {
                return '';
            }
        }
    )(), [parsed]);
    // console.log('typeSearchString', typeSearchString);

    const scrollToTable = (() => {
            const element = document.getElementsByClassName('table-headline')[0];
            if (element) {
                element.scrollIntoView();
                const scrolledY = window.scrollY;

                if (scrolledY) {
                    window.scroll(0, scrolledY - 100);
                }
            }
    });


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

    const autoResetFilters = false;

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
            filters: [
                {
                    id: 'city',
                    value: citySearchString,
                },
                {
                    id: 'type',
                    value: typeSearchString,
                },
            ],
         },
      },
      autoResetFilters,
      useFilters, // useFilters!
      useFlexLayout,
      useGlobalFilter,
      usePagination,
    );
    // console.log('state', state);

  // Render the UI for your table
  return (
    <>
    <div className="tableWrap">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                // console.log('column', column);
                return (typeof column.Header === 'string'
                && (column.id !== 'city' || (column.id === 'city' && typeof window !== 'undefined' && location.pathname === '/industri'))) && (
                <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {/* Render the columns filter UI */}
                    <div css={css`max-width:100%;`}>
                        {column.canFilter ? column.render('Filter') : null}
                    </div>
                </th>
                );
                })}
            </tr>
          ))}
            <tr>
                <th
                    id="table-results"
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
            // console.log('row', row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return ((cell.column.id !== 'city')
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
        Pagination
      */}
      <div
        id="table-pagination"
        role="navigation"
        css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;

            > a {
                padding: 10px 5px;
                @media (max-width: 769px) {
                    padding: 10px 0px;
                }
            }

        `}
      >
        <a
            css={css`
                ${canPreviousPage ? ('cursor: pointer') : ('opacity: 0.3;')};
            `}
            role="button"
            aria-label="Gå till sida 1"
            tabIndex={0}
            onClick={() => {
                if (canPreviousPage) {
                    gotoPage(0);
                    scrollToTable();
                }
            }}
            onKeyDown={(event) => {
                if (event.keycode === 13 && canPreviousPage) {
                    gotoPage(0);
                    scrollToTable();
                }
            }}
            disabled={!canPreviousPage}
        >
            <ArrowBase>
                <i
                    className="arrow-left"
                    css={ArrowLeftStyles}
                />
                <i
                    className="arrow-left"
                    css={ArrowLeftStyles}
                />
            </ArrowBase>
        </a>
        {' '}
        <a
            css={css`
                margin: 0 ${rhythm};
                @media (max-width: 769px) {
                    margin: 0 calc(${rhythm}/2);
                }
                ${canPreviousPage ? ('cursor: pointer;') : ('opacity: 0.3;')};
            `}
            role="button"
            aria-label="Gå till föregående sida"
            tabIndex={0}
            onClick={() => {
                if (canPreviousPage) {
                    previousPage();
                    scrollToTable();
                }
            }}
            onKeyDown={(event) => {
                if (event.keycode === 13 && canPreviousPage) {
                    previousPage();
                    scrollToTable();
                }
            }}
            disabled={!canPreviousPage}
        >
            <ArrowBase>
                <i
                    className="arrow-left"
                    css={ArrowLeftStyles}
                />
            </ArrowBase>
        </a>
        <span
            css={css`
                text-align: center;
                min-width: 15%;
            `}
        >
            Sida
            {' '}
            <strong>
                {pageIndex + 1}
                {' '}
                av
                {' '}
                {pageOptions.length}
            </strong>
        </span>
        <a
            css={css`
                margin: 0 ${rhythm};
                @media (max-width: 769px) {
                    margin: 0 calc(${rhythm}/2);
                }
                ${canNextPage ? ('cursor: pointer') : ('opacity: 0.3;')};
            `}
            role="button"
            aria-label="Gå till nästa sida"
            tabIndex={0}
            onClick={() => {
                if (canNextPage) {
                nextPage();
                scrollToTable();
                }
            }}
            onKeyDown={(event) => {
                if (event.keycode === 13 && canNextPage) {
                    nextPage();
                    scrollToTable();
                }
            }}
            disabled={!canNextPage}
        >
            <ArrowBase>
                <i
                    className="arrow-right"
                    css={ArrowRightStyles}
                />
            </ArrowBase>
        </a>
        {' '}
        <a
            css={css`
                ${canNextPage ? ('cursor: pointer') : ('opacity: 0.3;')};
            `}
            role="button"
            aria-label="Gå till sista sidan"
            tabIndex={0}
            onClick={() => {
                if (canNextPage) {
                    gotoPage(pageCount - 1);
                    scrollToTable();
                }
            }}
            onKeyDown={(event) => {
                if (event.keycode === 13 && canNextPage) {
                    gotoPage(pageCount - 1);
                    scrollToTable();
                }
            }}
            disabled={!canNextPage}
        >
            <ArrowBase>
                <i
                    className="arrow-right"
                    css={ArrowRightStyles}
                />
                <i
                    className="arrow-right"
                    css={ArrowRightStyles}
                />
            </ArrowBase>
        </a>
      </div>
    </div>
    </>
  );
}

const TableList = ({ companyData }) => {
    // console.log('table data', companyData);
    // console.log('typography', rhythm, scale);
    const fixedNameData = React.useMemo(() => companyData.map((item) => {
        const current = item;

        switch (item.type) {
            case 'tra':
                current.type = 'Trä';
                break;
            case 'metall':
                current.type = 'Metall';
                break;
            case 'moblertraforadling':
                current.type = 'Möbler / Träförädling';
                break;
            case 'livsmedel':
                current.type = 'Livsmedel';
                break;
            case 'skorklader':
                current.type = 'Skor & Kläder';
                break;
            case 'plastgummi':
                current.type = 'Plast / Gummi';
                break;
            case 'ovrigtdiverse':
                current.type = 'Övrigt / Diverse';
                break;
            default:
                current.type = item.type;
                break;
        }

        switch (item.city) {
            case 'savsjo':
                current.city = 'Sävsjö';
                break;
            case 'vrigstad':
                current.city = 'Vrigstad';
                break;
            case 'stockaryd':
                current.city = 'Stockaryd';
                break;
            case 'rorvik':
                current.city = 'Rörvik';
                break;
            case 'hultagard':
                current.city = 'Hultagård';
                break;
            case 'hylletofta':
                current.city = 'Hylletofta';
                break;
            default:
                current.city = item.city;
                break;
        }

        return current;
    }), [companyData]);

    const sortedData = React.useMemo(() => fixedNameData.sort(compareValues('name', 'asc')), [fixedNameData]);
    // console.log(sortedData);

    const columns = React.useMemo(
        () => [
            {
                id: 'image',
                accessor: 'companyimage.id',
                Header: (() => null),
                Cell: ({ row }) => {
                    // console.log(row);
                    return (
                        <div css={css`
                            max-height: 40vh;
                            height: 100%;
                            overflow: hidden;
                            @media (max-width: 1480px) {
                                max-height: 35vh;
                            }
                            @media (max-width: 1023px) {
                                max-height: 30vh;
                            }
                            @media (max-width: 769px) {
                                max-height: 320px;
                            }
                        `}
                        >
                            <Link to={`/industri/${row.original.fields.slug}`}>
                                <Img
                                    fluid={row.original.companyimage.childImageSharp.fluid}
                                    alt={row.original.name}
                                    title={row.original.name}
                                    style={{
                                        maxHeight: '100%',
                                    }}
                                    imgStyle={{
                                        objectFit: 'cover',
                                        objectPosition: 'top center',
                                    }}
                                />
                            </Link>
                        </div>
                    );
                },
            },
            {
                id: 'name',
                accessor: 'name',
                Header: 'Sök på namn...',
                Filter: DefaultColumnFilter,
                Cell: ({ row }) => {
                    // console.log(row);
                    return (
                        <div
                            css={css`
                                padding-left: calc(${rhythm} / 2);
                            `}
                        >
                            <Link to={`/industri/${row.original.fields.slug}`}>
                                <h3
                                    css={css`
                                        white-space: normal;
                                        margin-top: calc(${rhythm} / 2);
                                        padding-right: calc(${rhythm} / 2);
                                        @media (max-width: 769px) {
                                            margin-top: 0px;
                                        }
                                    `}
                                >
                                    {row.original.name}
                                </h3>
                            </Link>
                            <p
                                css={css`
                                    text-transform: capitalize;
                                    font-style: italic;
                                    margin-bottom: 0.125rem;
                                `}
                            >
                                {row.original.type}
                            </p>
                            <p
                                css={css`
                                    white-space: normal;
                                    margin-bottom: 0;
                                    position: relative;
                                    padding-right: calc(${rhythm} / 2);
                                    max-height: calc(${rhythm} * 8);
                                    overflow: hidden;

                                    :before {
                                        content: "...";
                                        position: absolute;
                                        bottom: 3px;
                                        right: -1px;
                                        width: 1rem;
                                    }
                                    :after {
                                        content: "";
                                        position: absolute;
                                        right: -1px;
                                        width: 1rem;
                                        height: ${rhythm};
                                        background: white;
                                    }
                                `}
                            >
                                {row.original.summary}
                            </p>
                        </div>
                    );
                },
            },
            {
                id: 'city',
                accessor: 'city',
                Header: 'Filtrera på...',
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
                Header: 'Eller på...',
                Filter: SelectColumnFilter,
                filter: 'text',
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
