import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'

const ArticleTemplate = ({ data }) => (
    <Layout>
        <h1>{data.strapiArticle.title}</h1>
        {/* <Img fluid={data.strapiImage.imagecontent.childImageSharp.fluid}/> */}
        {/* {data.allStrapiImage.edges.forEach(({ node }) => {
            <p>{node.id} {node.title}</p>
            if(node.title == data.strapiArticle.coverimage.title) {
                <Img fluid={node.imagecontent.childImageSharp.fluid}/>
            }
        })} */}
        {console.log(data.allStrapiImage.edges.node)}

        <p>{data.strapiArticle.content}</p>
    </Layout>
)

export default ArticleTemplate

export const query = graphql`
    query ArticleTemplate($id: String!) {
        strapiArticle(id: {eq: $id}) {
            title
            content
            strapiId
            id
            coverimage {
                id
                title
            }
        }
        allStrapiImage {
            edges {
              node {
                title
                id
                imagecontent {
                  childImageSharp {
                    fluid(maxWidth: 960) {
                        ...GatsbyImageSharpFluid
                      }
                  }
                }
              }
            }
        }
    }  
`