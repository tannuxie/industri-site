import React from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown/with-html"  

const CompanyTemplate = ({ data }) => (
    <Layout>
        <div>
            <h1 className="title is-1"
                css={css`
                text-align: center;
                `}
            >
                {data.strapiCompany.name}
            </h1>
            <div 
                className="articleImageBox"
                css={css`
                width: 100%;
                margin: 2rem 0;
                `}
            >
                <div
                    css={css`
                    display: flex;
                    justify-content: center;
                    `}
                >
                   <Img 
                    fluid={data.strapiImage.imagecontent.childImageSharp.fluid} 
                    alt={data.strapiImage.title} 
                   />
                </div>
            </div>
        </div>

        <div 
            className="articleContent"
            css={css`
            @media (min-width: 768px) {
                margin: 0 15%;
            }
            @media (min-width: 1024px) {
                margin: 0 30%;                
              }
              clear: both;
            `}
        >
            <ReactMarkdown 
                source={data.strapiCompany.longtext} 
                escapeHtml={false}  
            />
        </div>

    </Layout>
)

export default CompanyTemplate

export const companyQuery = graphql`
    query CompanyTemplate($id: Int!) {
        strapiCompany(strapiId: {eq: $id}) {
            strapiId
            id
            coverimage {
                id
                title
            }
            fields {
                slug
            }
            longtext
            name
            summary
            type
            updated_at
            created_at
        }
        strapiImage(companycoverimage: {id: {eq: $id}}) {
            title
            id
            companycoverimage {
                id
                name
              }
            imagecontent {
                childImageSharp {
                    fluid(maxWidth: 1920) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
`