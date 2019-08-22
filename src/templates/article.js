import React from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown"  

const ArticleTemplate = ({ data }) => (
    <Layout>
        <div>
            <h1 className="title is-1"
                css={css`
                text-align: center;
                `}
            >
                {data.strapiArticle.title}
            </h1>
            <div
                css={css`
                width: 100%;
                margin: 2rem 0;
                `}
            >
                <div>
                   <Img 
                    fluid={data.strapiImage.imagecontent.childImageSharp.fluid} 
                    alt={data.strapiImage.articlecoverimage.title} 
                   />
                </div>
            </div>
        </div>

        <div
            css={css`
            @media (min-width: 1024px) {
                margin: 0 30%;                
              }
              clear: both;
            `}
        >
            <ReactMarkdown source={data.strapiArticle.content} />
        </div>

    </Layout>
)

export default ArticleTemplate

export const query = graphql`
    query ArticleTemplate($id: Int!) {
        strapiArticle(strapiId: {eq: $id}) {
            title
            content
            strapiId
            id
            coverimage {
                id
                title
            }
        }
        strapiImage(articlecoverimage: {id: {eq: $id}}) {
            articlecoverimage {
              title
              id
            }
            imagecontent {
              childImageSharp {
                fluid(maxWidth: 960) {
                    ...GatsbyImageSharpFluid
                }
              }
            }
        }
    }  
`