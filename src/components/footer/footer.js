import React from 'react';
import { css } from '@emotion/core';
import { StaticQuery, graphql } from 'gatsby';
// import '~style/style.scss';
import { compareValues } from '~components/functions';
import ZoneParser from '~components/zoneparser/zoneparser';

const Footer = ({ data }) => {
    console.log('footer data', data);
    const footerData = data.allStrapiStaticContent.edges.filter((item) => {
        return item.node.role.startsWith('footer') === true;
    }).map((item) => item.node);
    console.log('filtered footer data', footerData);
    const sortedFooterData = React.useMemo(() => footerData.sort(compareValues('role', 'asc')), []);
    console.log('sorted footer data', sortedFooterData);

    return (
        <footer
            className="footer gradientBg"
            css={css`
                display: flex;
                justify-content: space-around;
            `}
        >
            {sortedFooterData.map((item) => {
                return (
                    <div
                        className="content has-text-centered"
                        key={item.role}
                    >
                        <ZoneParser
                            content={item.content}
                            childMdx={item.children}
                            source="footer"
                        />
                    </div>
                );
            })}
        </footer>
    );
};

export default (props) => (
    <StaticQuery
		query={graphql`
            query FooterQuery {
                allStrapiStaticContent {
                    edges {
                        node {
                            id
                            role
                            strapiId
                            content {
                                width
                                undertext_bildbox
                                undertext
                                textfield
                                layout
                                id
                                filtrering
                                bredd_bildbox
                                text_vanster {
                                    textfield
                                    id
                                }
                                text_hoger {
                                    textfield
                                    id
                                }
                                text {
                                    textfield
                                    id
                                }
                                imgbox {
                                    id
                                    beskrivning
                                    bildfil {
                                        childImageSharp {
                                            fluid {
                                                ...GatsbyImageSharpFluid
                                                aspectRatio
                                            }
                                        }
                                    }
                                }
                                bild {
                                    id
                                    beskrivning
                                    bildfil {
                                        childImageSharp {
                                            fluid {
                                                ...GatsbyImageSharpFluid
                                                aspectRatio
                                            }
                                        }
                                    }
                                }
                            }
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
                }
            }
		`}
		render={(data) => (
            <Footer data={data} />
        )}
    />
);
