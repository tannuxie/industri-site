import React from 'react';
import ReactTable from 'react-table'
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
        Header: 'Image',
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
        Header: 'name',
        accessor: 'value.name',
    }, 
    // {
    //     Header: 'ID',
    //     accessor: 'value.id'
    // }, 
    {
        Header: 'Quality',
        accessor: 'value.companyquality',
    }, {
        Header: 'type',
        accessor: 'value.type',
    }, 
    // {
    //     Header: 'strapiId',
    //     accessor: 'value.strapiId',
    // }, 
    {
        Header: 'summary',
        accessor: 'value.summary',
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
            />
        </Layout>
    )}
};

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