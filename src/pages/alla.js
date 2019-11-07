import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown/with-html" 
import TableList from '~components/tablelist/tablelist'

const ListAllTemplate = ({ data }) => {
    return (
        <Layout childTitle={"Alla företag"}>
            <h1 css={css`text-align: center;`}>Alla företag</h1>
            <TableList 
                data={data} 
            />
        </Layout>
    );
};

export default ListAllTemplate

export const allCompsQuery = graphql`
    query listallQuery {
        company: allStrapiCompany {
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