import React, { Component } from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import ReactMarkdown from 'react-markdown/with-html';
import Helmet from '~components/helmet/helmet';
import FilterCompanyList from '~components/filtercompanylist/filtercompanylist';

const CityListTemplate = ({ data, pageContext }) => {
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return (
        <>
            <Helmet childTitle={capitalizeFirstLetter(pageContext.string)} />
            <h1 css={css`text-align: center;`}>
                Företag i
                {' '}
                {`${capitalizeFirstLetter(pageContext.string)}`}
            </h1>
            <FilterCompanyList
                data={data}
                city={capitalizeFirstLetter(pageContext.string)}
            />
        </>
	);
};

export default CityListTemplate;

export const citylistQuery = graphql`
    query citylistQuery($string: String!) {
        company: allStrapiCompany(filter: {city: {eq: $string}, published: {eq: true}, mainimage: {id: {ne: null}}}) {
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
                    mainimage {
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
