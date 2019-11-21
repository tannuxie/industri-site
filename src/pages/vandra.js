import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown/with-html" 
import TableList from '~components/tablelist/tablelist'

const Vandra = ({ data }) => {
    console.log(data);
    
    return (
        <Layout childTitle={"Vandra"}>
            test
        </Layout>
    );
}

export default Vandra

export const vandraQuery = graphql`
query vandraQuery {
    streets: allStrapiStreet {
        edges {
            node {
                id
            }
        }
    }
}
`