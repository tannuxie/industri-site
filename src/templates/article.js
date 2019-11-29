import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Layout from '~components/layout/layout';
// import ReactMarkdown from "react-markdown/with-html"
// import { MDXProvider, mdx } from '@mdx-js/react'
// import { MDXRenderer } from "gatsby-plugin-mdx"
// import MyMap from '~components/map/map'
// import ImgBox from '~components/imgbox/imgbox'
import MdxRender from '~components/mdxrender/mdxrender';

const ArticleTemplate = ({ data }) => (
    <Layout childTitle={`${data.strapiArticle.title}`}>
        <div>
            <h1
				className="title is-1"
				css={css`
                    text-align: center;
                    `}
            >
                    {data.strapiArticle.title}
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
                        imgStyle={{ objectFit: 'contain' }}
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
			<MdxRender mdxBody={data.strapiArticle.childMdx.body} />
		</div>
    </Layout>
);

ArticleTemplate.propTypes = {
	data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ArticleTemplate;

export const articleQuery = graphql`
    query ArticleTemplate($id: Int!) {
        strapiArticle(strapiId: {eq: $id}) {
            title
            content
            strapiId
            id
            fields {
                slug
            }
            coverimage {
                id
                title
            }
            childMdx {
                body
              }
        }
        strapiImage(articlecoverimage: {id: {eq: $id}}) {
            title
            id
            articlecoverimage {
              title
              id
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
`;
