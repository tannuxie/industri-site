import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
import ZoneParser from '~components/zoneparser/zoneparser';

const ArticleTemplate = ({ data }) => {
    console.log(data);
    const article = data.strapiArticle;

    return (
        <div>
            <Helmet childTitle={`${article.title}`} />
            <div id="article-top">
                <h1
                    className="title is-1"
                    css={css`
                        text-align: center;
                        `}
                >
                        {article.title}
                </h1>
                <div>
                    <div>
                        <Img
                            fluid={article.articleimage.childImageSharp.fluid}
                            alt={article.title}
                            imgStyle={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            </div>

            <div id="article-content">
                <ZoneParser
                    content={article.content}
                    childMdx={article.children}
                />
            </div>
        </div>
    );
};

ArticleTemplate.propTypes = {
	data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ArticleTemplate;

export const articleQuery = graphql`
    query ArticleTemplate($id: Int!) {
        strapiArticle(strapiId: {eq: $id}) {
            title
            layout
            content {
                undertext
                bild {
                    beskrivning
                    bildfil {
                        childImageSharp {
                            fluid(maxWidth: 1920) {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                }
                zoom
                longitude
                layout
                latitude
                text {
                    textfield
                }
                text_vanster {
                    textfield
                }
                text_hoger {
                    textfield
                }
                map_pins {
                    longitude
                    latitude
                    beskrivning
                }
                imgbox {
                    beskrivning
                    bildfil {
                        childImageSharp {
                            fluid(maxWidth: 1920) {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                }
                bredd_bildbox
                size
                undertext_bildbox
                bredd_karta
                id
                karta {
                    latitude
                    longitude
                    undertext
                    zoom
                    map_pins {
                        beskrivning
                        latitude
                        longitude
                    }
                }
                size
            }
            id
            fields {
                slug
            }
            articleimage {
                childImageSharp {
                    fluid(maxWidth: 1920) {
                        ...GatsbyImageSharpFluid
                        aspectRatio
                    }
                }
            }
            strapiId
            children {
                ... on Mdx {
                    id
                    body
                    frontmatter {
                        title
                    }
                    headings {
                        value
                        depth
                    }
                    tableOfContents
                    timeToRead
                    wordCount {
                        words
                        sentences
                        paragraphs
                    }
                }
            }
        }
    }
`;

