import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'

const ArticleTemplate = ({ data }) => (
    <Layout>
        <h1>{data.strapiArticle.title}</h1>

        <Img fluid={data.strapiImage.imagecontent.childImageSharp.fluid}/>

        <p>{data.strapiArticle.content}</p>
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