import React from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Layout from '~components/layout/layout';
import ReactMarkdown from 'react-markdown/with-html';
import { MDXProvider, mdx } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import MyMap from '~components/map/map';
import ImgBox from '~components/imgbox/imgbox';

const shortcodes = {
	MyMap,
	ImgBox,
	Layout,
};

const StreetTemplate = ({ data }) => {
	console.log(data);

	return (
        <>
            <Helmet childTitle={`${data.strapiStreet.name}`} />
            <div>
                <h1
                    className="title is-1"
                    css={css`
                    text-align: center;
                    `}
                >
                    {data.strapiStreet.name}
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
                <MDXProvider components={shortcodes}>
                    <MDXRenderer>
                        {data.strapiStreet.childMdx.body}
                    </MDXRenderer>
                </MDXProvider>
            </div>
        </>
	);
};

export default StreetTemplate;

export const StreetQuery = graphql`
    query StreetTemplate($id: Int!) {
        strapiStreet(strapiId: {eq: $id}) {
            id
            fields {
                slug
            }
            city
            content {
                id
            }
            name
            strapiId
            summary
            streetimage {
                id
                name
                childImageSharp {
                    fluid {
                        src
                    }
                }
            }
            children {
                ... on Mdx {
                    id
                    body
                }
            }
        }
    }
`;
