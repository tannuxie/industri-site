import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown/with-html" 
import TableList from '~components/tablelist/tablelist'

const ListAll = ({ data }) => {

    return (
        <Layout childTitle={"Alla företag"}>
            <h1 css={css`text-align: center;`}>Alla företag</h1>
            <TableList 
                data={data}
            />
        </Layout>
    );
}

export default ListAll

export const listAllQuery = graphql`
    query listallQuery {
        company: allStrapiCompany(filter: {published: {eq: true}, mainimage: {id: {ne: null}}}) {
        edges {
            node {
            id
            companyquality
            type
            name
            strapiId
            summary
            fields {
                slug
            }
            addresses {
                id
                addressstring1
                addressstring2
                startdate(formatString: "YYYY")
                enddate(formatString: "YYYY")
                company
                latitude
                longitude
            }
            mainimage {
                imagecontent {
                id
                }
                id
                title
            }
            city
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
            companyimage {
                name
                id
                summary
            }
            }
        }
        }
    }  
`