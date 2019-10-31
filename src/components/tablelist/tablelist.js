import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
//import 'react-table/react-table.css'
import '~style/table.css'
import Layout from '~components/layout/layout';

const TableList = ({ data, city }) => { 
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
            used: [{
                id: 'id',
                address: 'address',
                startdate: 'startdate',
                enddate: 'enddate',
                addressstring1: 'addressstring1',
                addressstring1: 'addressstring1',
                cityId: 'cityId'
                }]
        };
        cObj.id = items.node.id;
        cObj.companyquality = items.node.companyquality;
        cObj.type = items.node.type;
        cObj.name = items.node.name;
        cObj.slug = items.node.fields.slug;
        cObj.strapiId = items.node.strapiId;
        cObj.summary = items.node.summary;
        cObj.imageId = items.node.coverimage.imagecontent.id;
        cObj.used = items.node.usedaddresses.map((items, i) => {
            let cUsed = {
                id: 'id',
                address: 'address',
                startdate: 'startdate',
                enddate: 'enddate',
                addressstring1: 'addressstring1',
                addressstring1: 'addressstring1',
                cityId: 'cityId'
            }
            cUsed.id = items.id;
            cUsed.address = items.address;
            cUsed.startdate = items.startdate;
            cUsed.enddate = items.enddate;

            return cUsed;
        })
    
        return {
            value: cObj
        };
    })

    data.address.edges.forEach(function(item) {
        array.forEach(function(arrayitem) {
            arrayitem.value.used.forEach(function(useditem) {
                if(item.node.strapiId === useditem.address) {
                    useditem.addressstring1 = item.node.addressstring1;
                    useditem.addressstring2 = item.node.addressstring2;
                    useditem.cityId = item.node.city.id;
                }
            })
        })
    });

    const columns = [{
        id: 'compImage',
        Header: header => {
            return null
        },
        headerStyle: {
            display: 'none'
        },
        sortable: false,
        filterable: false,
        accessor: 'value.imageId',
        Cell: row => {
            let foundObject = {};
            {data.image.edges.forEach(function(item) {
                //console.log(row);                
                if(item.node.strapiId === row.value) {
                    foundObject = item.node;
                };
            })}
            return (

                    <div css={css`max-height:500px;overflow:hidden;display:flex;`}>
                        <Img 
                            style={{
                                flex:'1 1 auto',
                                alignSelf:'flex-end'
                            }}
                            fluid={foundObject.imagecontent.childImageSharp.fluid} 
                            alt={foundObject.title} 
                            title={foundObject.companycoverimage.name}
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
            flexGrow: '200',
            flex: '200 0 auto'
        },
        width: 800,
        sortable: false,
        filterable: false,
        accessor: 'value',
        Cell: row => {
            return (
                
                    <div>
                        <Link to={`/industri/${row.original.value.slug}`}>
                            <h3>{row.value.name}</h3>
                        </Link>
                        <p style={{textTransform: 'capitalize'}}>{row.value.type}</p>
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
            display: 'none'
        },
        filterMethod: (filter, row) => {
            if(String(row.compName.toLowerCase()).startsWith(filter.value.toLowerCase())) {
                return row;
            } else {
                return undefined;
            }
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
            value={filter ? filter.value : "all"}
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
        style: {
            display: 'none'
        },
        Cell: row => {
            return null
        }
    }, 
    {
        id: 'compSummary',
        Header: 'summary',
        accessor: 'value.summary',
        show: false,

    }] 


    return (
        <Layout childTitle={city}>
            <h1 css={css`text-align: center;`}>Företag i {`${city}`}</h1>
            <ReactTable
                data={array}
                columns={columns}
                defaultPageSize={10}
                className={'table'}
                sorted={[{ // the sorting model for the table
                    id: 'compQual',
                    desc: true
                }]}
                filterable={true}
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
        </Layout>
    )}
};

export default TableList;