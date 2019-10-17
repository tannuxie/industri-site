import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import 'react-table/react-table.css'
import Layout from '~components/layout/layout';

const TableList = ({ data }) => { 
    {const array = data.company.edges.map((items, i, data) => {
        let cObj = {
            id: 'id',
            companyquality: 'companyquality',
            type: 'type',
            name: 'name',
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
        Header: '',
        style: {
            flexGrow: '50'
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
                <div css={css`max-height:500px;overflow:hidden;`}>
                    <Img 
                        fluid={foundObject.imagecontent.childImageSharp.fluid} 
                        alt={foundObject.title} 
                        title={foundObject.companycoverimage.name}
                    />
                </div>
            );                        
        }
    }, {
        id: 'compMain',
        Header: '',
        style: {
            flexGrow: '200'
        },
        sortable: false,
        filterable: false,
        accessor: 'value',
        Cell: row => {
            return (
                <div>
                    <h3>{row.value.name}</h3>
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
        Header: 'type',
        accessor: 'value.type',
        show: false,
    }, 
    {
        id: 'compSummary',
        Header: 'summary',
        accessor: 'value.summary',
        show: false,

    }] 


    return (
        <Layout>
            <ReactTable
                data={array}
                columns={columns}
                defaultPageSize={10}
                className={'table'}
                sorted={[{ // the sorting model for the table
                    id: 'compQual',
                    desc: true
                  }, {
                    id: 'compName',
                    desc: true
                }]}
                filterable={true}
                defaultFilterMethod={(filter, row, column) => {
                    //console.log(row); 
                    //console.log(filter);                                       
                    const id = filter.pivotId || filter.id
                    if(String(row.compName.toLowerCase()).startsWith(filter.value.toLowerCase())) {
                        return row;
                    } else {
                        return undefined;
                    }
                }}
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