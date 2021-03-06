import React from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '~components/layout/layout';
import Helmet from '~components/helmet/helmet';
import TableList from '~components/tablelist/tablelist';

const ListAll = ({ data }) => {
    const companies = data.company.edges.map((item) => item.node);

    return (
        <>
            <Helmet childTitle="Alla företag" />
            <h1 css={css`text-align: center;`}>Alla företag</h1>
            <TableList
                companyData={companies}
            />
        </>
    );
};

export default ListAll;

export const listAllQuery = graphql`
query listallQuery {
    company: allStrapiCompany(filter: {published: {eq: true}, companyimage: {id: {ne: null}}}) {
        edges {
            node {
                id
                strapiId
                name
                type
                quality
                summary
                city
                fields {
                    slug
                }
                address {
                    id
                    addresstext1
                    addresstext2
                    startdate(formatString: "YYYY")
                    latitude
                    longitude
                }
                companyimage {
                    id
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid
                            aspectRatio
                        }
                    }
                }
            }
        }
    }
}
`;
