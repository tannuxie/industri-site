import React from 'react';
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { css } from "@emotion/core"
import 'react-table/react-table.css'
import Layout from '~components/layout/layout';

// const cObject = {
//     id: 'id',
//     companyquality: 'companyquality',
//     bransch: 'bransch',
//     name: 'name',
//     strapiId: 'strapiId',
//     summary: 'summary',
//     used: [{
//         id: 'id',
//         address: 'address',
//         startdate: 'startdate',
//         enddate: 'enddate'
//         }]
// }




// const array = ({ data }) => {



//     data.company.edges.map((items, i) => array.push({
//         id = item.
//     }) 
    
//     );

// };

// const data = ({ data }) => [{

//     name: 'Tanner Linsley',
//     age: 26,
//     friend: {
//         name: 'Jason Maurer',
//         age: 23,
//     }
// }]

// class TableImage extends Component {



//     render() {
//       return (
//         <Fragment>
//             {this.props.render()}
//         </Fragment>
//       )
//     }
// }


const CompanyPage = ({ data }) => { 
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
    
        // console.log(cObj);
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

    console.log(array);
    // console.log(array[1]);
    // console.log(array.size);

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
                // console.log(item.node);
                // console.log(item.node.strapiId)
                // console.log(row.value)
                if(item.node.strapiId === row.value) {
                    //console.log("YES!");
                    //console.log(item.node);
                    foundObject = item.node;
                };
            })}
            return (
                <div>
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
            let usedObj = new Array();
            row.value.used.forEach(element => {
                if(typeof element !== "undefined") {
                    console.log('map: ' + element.addressstring1)
                    var obj = {
                        addressstring1:element.addressstring1, 
                        addressstring2:element.addressstring2, 
                        startdate:element.startdate, 
                        enddate:element.enddate,
                        cityId: element.cityId
                    };
                    usedObj.push(obj);
/*                     const address = element.address
                    const addressstring1 = element.addressstring1
                    const addressstring2 = element.addressstring2
                    const cityId = element.cityId
                    const enddate = element.enddate
                    const usedId = element.id
                    const startdate = element.startdate */
                }
            })
            return (
                <div>
                    <h3>{row.value.name}</h3>
                    <p style={{textTransform: 'capitalize'}}>{row.value.type}</p>
                    {usedObj.map(element => {
                        let end = 'Nutid';
                        console.log('ele: ' + JSON.stringify(element.addressstring1));
                        if(typeof element.enddate == "string") {
                            console.log(typeof element.enddate)
                            console.log(JSON.stringify(element.enddate) + ' är inte null')

                            end = element.enddate;
                        } 
                        return (
                            <div className='aUsed'>
                                <span css={css`display: flex;`} className='aUsedAdd1'>{element.addressstring1}</span>
                                <span css={css`display: flex;`} className='aUsedAdd2'>{element.addressstring2}</span>
                                <span css={css`display: flex;`} className='aUsedStart'>{element.startdate}</span>
                                <span css={css`display: flex;`} className='aUsedEnd'>{end}</span>
                            </div>
                        )
                    })}
                    <p css={css`white-space: pre-wrap;`}>{row.value.summary}</p>
                </div>
            )
        }
    }, 
    // {
    //     Header: 'ID',
    //     accessor: 'value.id'
    // }, 
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
        /* show: false, */
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
    // {
    //     Header: 'strapiId',
    //     accessor: 'value.strapiId',
    // }, 
    {
        id: 'compSummary',
        Header: 'summary',
        accessor: 'value.summary',
        show: false,
    // }, {
    //     Header: 'Used',
    //     accessor: 'value.used'
        // used: [{
        //     id: 'id',
        //     address: 'address',
        //     startdate: 'startdate',
        //     enddate: 'enddate',
        //     addressstring1: 'addressstring1',
        //     addressstring1: 'addressstring1',
        //     cityId: 'cityId'
        //     }]

    }] 


    return (
        <Layout>
            <ReactTable
                data={array}
                columns={columns}
                defaultPageSize={10}
                className={'table'}
                /* column={colDefaults} */
                /* defaultSorted={[]} */
                sorted={[{ // the sorting model for the table
                    id: 'compQual',
                    desc: true
                  }, {
                    id: 'compName',
                    desc: true
                }]}
                filterable={true}
                previousText={'Föregående'}
                nextText={'Nästa'}
                loadingText={'Laddar...'}
                noDataText={'Här fanns det inget!'}
                pageText={'Sida'}
                ofText={'av'}
                rowsText={'rader'}
            />
        </Layout>
    )}
};

/* const colDefaults = (
    {...ReactTableDefaults.column, 
        className:'td', 
        headerClassName:'thead',
        previousText: 'Föregående',
        nextText: 'Nästa',
        loadingText: 'Laddar...',
        noDataText: 'Här fanns det inget!',
        pageText: 'Sida',
        ofText: 'av',
        rowsText: 'rader'
    }
); */

export default CompanyPage;

export const query = graphql`
    query CompanyQuery {
        company: allStrapiCompany {
            edges {
                node {
                    id
                    companyquality
                    type
                    name
                    strapiId
                    summary
                    usedaddresses {
                        id
                        address
                        startdate
                        enddate
                    }
                    coverimage {
                        imagecontent {
                            id
                        }
                        
                    }
                }
            }
        }
        address: allStrapiAddress {
            edges {
                node {
                    id
                    strapiId
                    longitude
                    latitude
                    addressstring1
                    addressstring2
                    city {
                        id
                        name
                    }
                    usedaddresses {
                        id
                        companyaddress
                        address
                        startdate
                        enddate
                    }
                }
            }
        }
        image: allStrapiImage {
            edges {
                node {
                    id
                    title
                    strapiId
                    imagecontent {
                        childImageSharp {
                            fluid(maxWidth: 970) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                    companycoverimage {
                        name
                        id
                        summary
                      }
                }
            }
        }
    }
` 