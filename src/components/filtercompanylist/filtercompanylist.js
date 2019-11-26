import React from 'react';
//import '~style/style.scss';
import { css } from "@emotion/core"
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import TableList from '~components/tablelist/tablelist'

const FilterCompanyList = ({ data , city }) => {
    //console.log('city is ' + city);    
    //console.log(data)
    //console.log('company array length: ' + data.company.edges.length);
    
    for (let index = data.company.edges.length -1; index >= 0; index--) {
        let current = data.company.edges[index].node;
        //console.log('current: ' + index + ' ' + JSON.stringify(current));
        //console.log('current typeof: ' + typeof current.addresses);
        //console.log(current.city.toUpperCase());
        //console.log(city.toUpperCase());     
        
        if (current.city.toUpperCase() !== city.toUpperCase()) {
            //ta bort, splicea bort detta företaget
            //console.log('inte i staden, tar bort');
            
            data.company.edges.splice(index, 1);
        }
    }
    //console.log('finished array length: ' + data.company.edges.length);
    return (
        <TableList data={data} />
    )
};

export default FilterCompanyList;