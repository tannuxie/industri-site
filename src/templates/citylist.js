import React from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
import FilterCompanyList from '~components/filtercompanylist/filtercompanylist';
import { capitalizeFirstLetter } from '~components/functions';

const CityListTemplate = ({ data, pageContext }) => {
    const city = capitalizeFirstLetter(pageContext.string);
	return (
        <>
            <Helmet childTitle={city} />
            <h1
                css={css`
                    text-align: center;
                `}
            >
                Företag i
                {' '}
                {`${city}`}
            </h1>
            <FilterCompanyList
                city={city}
            />
        </>
	);
};

export default CityListTemplate;

export const citylistQuery = graphql`
    query citylistQuery($string: String!) {
        company: allStrapiCompany(filter: {city: {eq: $string}, published: {eq: true}, companyimage: {id: {ne: null}}}) {
            edges {
                node {
                    id
                    strapiId
                    type
                    name
                    summary
                    city
                    quality
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
                        enddate
                    }
                    companyimage {
                        id
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                            id
                        }
                    }
                }
            }
        }
    }
`;
