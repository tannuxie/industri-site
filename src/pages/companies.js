import React from 'react';
import ReactTable from 'react-table'
import { Link, graphql } from 'gatsby'
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

// const columns = [{
//     Header: 'Name',
//     accessor: 'name' // String-based value accessors!
//     }, {
//     Header: 'Age',
//     accessor: 'age',
//     Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
// }] 


const CompanyPage = ({ data }) => { 
    {let array = new Map();
        
        array = data.company.edges.map((items, i, data) => {
        let cObj = {
            id: 'id',
            companyquality: 'companyquality',
            bransch: 'bransch',
            name: 'name',
            strapiId: 'strapiId',
            summary: 'summary',
            used: [{
                id: 'id',
                address: 'address',
                startdate: 'startdate',
                enddate: 'enddate'
                }]
        };
        cObj.id = items.node.id;
        cObj.companyquality = items.node.companyquality;
        cObj.bransch = items.node.bransch;
        cObj.name = items.node.name;
    
        console.log(cObj);
        return {
            value: cObj,
            index: i
        };
    })
    console.log(array[0]);
    console.log(array[1]);
    console.log(array.size);
    return (
        <Layout>
        {/* <ReactTable
            data={data}
            columns={columns}
        /> */}
        {/* {console.log(array)} */}
        <h1>{array[1].value.name} test</h1>
    </Layout>
    )
    }
};

export default CompanyPage;

export const query = graphql`
    query CompanyQuery {
        company: allStrapiCompany {
            edges {
                node {
                    id
                    companyquality
                    bransch
                    name
                    strapiId
                    summary
                    usedaddresses {
                        address
                        startdate
                        id
                        enddate
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
                        company
                        address
                        startdate
                        enddate
                    }
                }
            }
        }
    }
` 