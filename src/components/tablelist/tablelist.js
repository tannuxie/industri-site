import React, { useState } from 'react';
//import '~style/style.scss';
import { css } from "@emotion/core"
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
//import 'react-table/react-table.css'
import '~style/table.css'
import Layout from '~components/layout/layout';

const TableList = ({ data }) => {
    {const array = data.company.edges.map((items, i, data) => {
        let cObj = {
            id: 'id',
            companyquality: 'companyquality',
            type: 'type',
            name: 'name',
            slug: 'slug',
            strapiId: 'strapiId',
            summary: 'summary',
            imageId: 'imageId',
            city: 'city',
            addresses: [{
                id: 'id',
                startdate: 'startdate',
                enddate: 'enddate',
                addressstring1: 'addressstring1',
                addressstring2: 'addressstring2',
                }]
        };
        cObj.id = items.node.id;
        cObj.companyquality = items.node.companyquality;
        cObj.type = items.node.type;
        cObj.name = items.node.name;
        cObj.slug = items.node.fields.slug;
        cObj.strapiId = items.node.strapiId;
        cObj.summary = items.node.summary;
        cObj.imageId = items.node.mainimage.id;
        cObj.city = items.node.city;
        cObj.addresses = items.node.addresses.map((addrs, i) => {
            let cAddr = {
                id: 'id',
                startdate: 'startdate',
                enddate: 'enddate',
                addressstring1: 'addressstring1',
                addressstring2: 'addressstring2',
            }
            cAddr.id = addrs.id;
            cAddr.startdate = addrs.startdate;
            cAddr.enddate = addrs.enddate;
            cAddr.addressstring1 = addrs.addressstring1;
            cAddr.addressstring2 = addrs.addressstring2;

            return cAddr;
        })
    
        return {
            value: cObj
        };
    })

    const columns = [{
        id: 'compImage',
        Header: header => {
            return null
        },
        headerStyle: {
            display: 'none'
        },
        style: {
            display: 'flex',
            flexGrow: '50',
            flexShrink: '0',
            flexBasis: 'auto'
        },
        sortable: false,
        filterable: false,
        accessor: 'value.imageId',
        Cell: row => {
            let foundObject = {};
            {data.image.edges.forEach(function(item) {                
                if(item.node.strapiId === row.value) {
                    foundObject = item.node;
                };
            })}
            return (

                    <div css={css`
                        max-height:500px;
                        overflow:hidden;
                        display:flex;
                        flex-grow:1;
                    `}>
                        <Img 
                            style={{
                                flex:'1 1 auto',
                                alignSelf:'center'
                            }}
                            fluid={foundObject.imagecontent.childImageSharp.fluid} 
                            alt={foundObject.title} 
                            title={foundObject.companyimage.name}
                        />
                    </div>
            );                        
        }
    }, {
        id: 'compMain',
        Header: header => {
            return null
        },
        headerStyle: {
            display: 'none'
        },
        style: {
            display: 'flex',
            flex: '100 0 auto'
        },
        sortable: false,
        filterable: false,
        accessor: 'value',
        Cell: row => {
            return (
                
                    <div>
                        <Link to={`/industri/${row.original.value.slug}`}>
                            <h3>{row.value.name}</h3>
                        </Link>
                        <p style={{textTransform: 'capitalize', fontStyle: 'italic'}}>{row.value.type}</p>
                        <p css={css`white-space: pre-wrap;`}>{row.value.summary}</p>
                    </div>
                
            )
        }
    }, 
    {
        id: 'compName',
        Header: 'Sök på namn',
        accessor: 'value.name',
        className: 'nameClass',
        style: {
            display: 'none',
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: 0,
            width: '0px'
        },
        filterMethod: (filter, row) => {
            if(String(row.compName.toLowerCase()).startsWith(filter.value.toLowerCase())) {
                return row;
            } else {
                return undefined;
            }
        },
        Filter: ({ filter, onChange }) => {

            return (
                <input
                    type="text"
                    style={{ width: "100%" }}
                    onChange={event => onChange(event.target.value)}
                    value={filter ? filter.value : ''}
                >
                </input>
            )
        },
        Cell: row => {
            return null
        }
    },
    {
        id: 'compQual',
        Header: 'Quality',
        accessor: 'value.companyquality',
        show: false,
    }, {
        id: 'compType',
        Header: 'Filtrera på typ',
        accessor: 'value.type',
        show: true,
        style: {
            display: 'none',
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: 0,
            width: '0px'
        },
        filterMethod: (filter, row) => {
            //console.log(filter);
            //console.log(row);
            if (filter.value === "alla") {
                return true;
            }
            if (filter.value === "tra") {
                return row[filter.id] == 'trä'
            }
            if (filter.value === "metall") {
                return row[filter.id] == 'metall'
            }
            if (filter.value === "mobler") {
                return row[filter.id] == 'möbler / träförädling'
            }
            if (filter.value === "livsmedel") {
                return row[filter.id] == 'livsmedel'
            }
            if (filter.value === "skor") {
                return row[filter.id] == 'skor & kläder'
            }
            if (filter.value === "plast") {
                return row[filter.id] == 'plast / gummi'
            }
            return row[filter.id] == 'övrigt / diverse';            
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "alla"}
          >
            <option value="alla">Visa alla</option>
            <option value="tra">Trä</option>
            <option value="metall">Metall</option>
            <option value="mobler">Möbler / Träförädling</option>
            <option value="livsmedel">Livsmedel</option>
            <option value="skor">Skor & Kläder</option>
            <option value="plast">Plast / Gummi</option>
            <option value="ovrigt">Övrigt / Diverse</option>
          </select>
        ),
        Cell: row => {
            return null
        }
    }, 
    {
        id: 'compSummary',
        Header: 'Filtrera på stad',
        accessor: 'value.city',
        show: true,
        className: 'cityClass',
        style: {
            display: 'none',
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: 0,
            width: '0px'
        },
        filterMethod: (filter, row) => {
            //console.log(filter);
            //console.log(row);
            if (filter.value === "alla") {
                return true;
            }
            if (filter.value === "savsjo") {
                return row[filter.id] == 'sävsjö'
            }
            if (filter.value === "vrigstad") {
                return row[filter.id] == 'vrigstad'
            }
            if (filter.value === "stockaryd") {
                return row[filter.id] == 'stockaryd'
            }
            if (filter.value === "rorvik") {
                return row[filter.id] == 'rörvik'
            }
            if (filter.value === "hylletofta") {
                return row[filter.id] == 'hylletofta'
            }         
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "alla"}
          >
            <option value="alla">Visa alla</option>
            <option value="savsjo">Sävsjo</option>
            <option value="vrigstad">Vrigstad</option>
            <option value="stockaryd">Stockaryd</option>
            <option value="rorvik">Rörvik</option>
            <option value="hylletofta">Hylletofta</option>
          </select>
        ),
        Cell: row => {
            return null
        }
    }] 


    return (
        <>            
            <ReactTable
                data={array}
                columns={columns}
                defaultPageSize={10}
                className={'table'}
                getTdProps={() => ({         
                    style: {
                        flex: '50 0 auto'
                    }
                })}
                sorted={[{ // the sorting model for the table
                    id: 'compQual',
                    desc: true
                }]}
                filterable={true}
                resizable={true}
                // Text
                previousText={'Föregående'}
                nextText={'Nästa'}
                loadingText={'Laddar...'}
                noDataText={'Här fanns det inget!'}
                pageText={'Sida'}
                ofText={'av'}
                rowsText={'rader'}
                  // Accessibility Labels
                pageJumpText= {'hoppa till sida'}
                rowsSelectorText= {'rader per sida'}
            />
        </>
    )}
};

export default TableList;