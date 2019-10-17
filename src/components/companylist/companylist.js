import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import TableList from '~components/tablelist/tablelist'

const CompanyList = ({ data , CITYCONST}) => {
    console.log('CITYCONST is' + CITYCONST);
    
    console.log(data)
    let thisCity = {};
    data.city.edges.forEach(element => {
        if (element.node.name == CITYCONST) {
            thisCity = element.node
            console.log('correct: ' + thisCity.name + ' ' + thisCity.id);
            
        }
    });
    console.log('company array length: ' + data.company.edges.length);
    
    for (let index = data.company.edges.length -1; index >= 0; index--) {
        let current = data.company.edges[index].node;
        console.log('current: ' + index + ' ' + JSON.stringify(current));
        console.log('current typeof: ' + typeof current.usedaddresses);
        
        let lastAddress = {};
        if(typeof current.usedaddresses[0] !== "undefined") {
            lastAddress = current.usedaddresses[0];
            console.log('currently in if: ' + index + ' ' + current);
            
            if(typeof lastAddress !== "undefined") {
                console.log('date parse: ' + lastAddress.enddate + ' into: ' + Date.parse(lastAddress.enddate));
            }
            console.log('used length: ' + current.usedaddresses.length);
            
            for (let index2 = 0; index2 < current.usedaddresses.length; index2++) {
                let current2 = current.usedaddresses[index2];
                if (current2.enddate == null) {
                    lastAddress = current2;
                    console.log(JSON.stringify(lastAddress) + ' is the latest');
                    
                    break;
                } else if (Date.parse(lastAddress.enddate) < Date.parse(current2.enddate)) {
                    lastAddress = current2;
                    console.log(Date.parse(lastAddress.enddate) + ' is older than ' + Date.parse(current2.enddate));
                    
                }            
            }
        }
        console.log('latest address: ' + JSON.stringify(lastAddress))
        //nu har jag senaste used, hitta nu address, 
        //för att därifrån hitta cityID
        let found = false;
        for (let index3 = 0; index3 < data.address.edges.length; index3++) {
            console.log('testing if address id matches lastAddress id: ' + data.address.edges[index3].node.strapiId + ' + ' + lastAddress.address);
            console.log(data.address.edges[index3].node.strapiId === lastAddress.address);
            
            //const element = data.address.edges[index2].node;
            if(data.address.edges[index3].node.strapiId === lastAddress.address) {
                console.log(data.address.edges[index3].node.city.name + ', ' + data.address.edges[index3].node.city.id + '+' + thisCity.strapiId);
                console.log(data.address.edges[index3].node.city.id !== thisCity.strapiId);
                if (data.address.edges[index3].node.city.name !== CITYCONST) {
                    //ta bort, splicea bort detta företaget
                    found = true;
                    console.log('inte i sävsjö, tar bort');
                    
                    data.company.edges.splice(index, 1);
                    break;
                } else if (data.address.edges[index3].node.city.name == CITYCONST) {
                    found = true;
                    console.log('är i sävsjö, tar inte bort');
                    break;
                }
            }
        }
        if (found == false) {
            console.log('hittades ingen matchande city, tar bort');
            data.company.edges.splice(index, 1);
        }
        console.log('finished array length: ' + data.company.edges.length);
    }
    return (
        <TableList data={data} />
    )
};

export default CompanyList;