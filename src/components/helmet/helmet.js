import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

const HelmComponent = ({ data, childTitle }) => {
    const thisTitle = childTitle !== undefined
    ? `${childTitle} — Sävsjö Industrihistoria`
    : 'Sävsjö Industrihistoria';

    return (
        <Helmet>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
            <meta name="description" content={data.site.siteMetadata.description} />
            <meta name="keywords" content={data.site.siteMetadata.keywords} />
            <meta charSet="utf-8" />
            <title>{thisTitle}</title>
            <html lang="sv" />
            {/* Google / Search Engine Meta Tags */}
            <meta itemProp="name" content={data.site.siteMetadata.author} />
            {' '}
            <meta
                itemProp="description"
                content={data.site.siteMetadata.description}
            />
        </Helmet>
    );
};

export default (props) => (
    <StaticQuery
        query={graphql`
            query helmetQuery {
                site {
                    siteMetadata {
                        title
                        author
                        description
                        keywords
                    }
                }
            }
        `}
        render={(data) => (
            <HelmComponent data={data} childTitle={props.childTitle} />
        )}
    />
);
