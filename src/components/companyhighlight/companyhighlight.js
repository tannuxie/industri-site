import React from 'react';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { rhythm, scale } from '../../style/typography';

const CompanyHighlight = ({ data, filtering = 1 }) => {
    console.log('CompanyHighlight data', data);
    const filterValue = (filtering !== 1 && filtering !== 2 && filtering !== 3) ? 1 : filtering;

    console.log('CompanyHighlight filtering', filterValue);
    const companies = data.allStrapiCompany.edges.map((item) => item.node);
    console.log('CompanyHighlight companies', companies);

    const filteredCompanies = React.useMemo(() => (
        () => {
            const filtered = companies.filter((item) => item.quality >= filterValue);
            if (filtered.length === 0) {
                return companies;
            }
                return filtered;
        }
    )(), [filterValue]);
    console.log(filteredCompanies);

    const randomCompany = React.useMemo(() => (
        () => {
            const pickone = filteredCompanies[Math.floor(Math.random() * filteredCompanies.length)]
            return pickone;
        }
    )(), [filterValue]);

    console.log('randomCompany', randomCompany);

    return (
        <>
            <div
                className='column'
                css={css`
                max-height:500px;
                overflow:hidden;
                display:flex;
                flex-grow:1;
                @media (max-width: 769px) {
                    max-height:300px;
                }
                `}
            >
                <Img
                    fluid={randomCompany.mainimage.childImageSharp.fluid}
                    alt={randomCompany.name}
                    title={randomCompany.name}
                />
            </div>

            <div
                className='column'
                css={css`
                    @media (max-width: 769px) {
                        padding: 0 1.25rem;
                    }
                `}
            >
                <Link to={`/industri/${randomCompany.fields.slug}`}>
                    <h3
                        css={css`
                            white-space: normal;
                            margin-top: calc(${rhythm} / 2);
                            padding-right: calc(${rhythm} / 2);
                            text-align: center;
                            @media (max-width: 769px) {
                                margin-top:0px;
                            }
                        `}
                    >
                        {randomCompany.name}
                    </h3>
                </Link>
                <p
                    css={css`
                        text-transform: capitalize;
                        font-style: italic;
                        margin-bottom: 0.125rem;
                    `}
                >
                    {randomCompany.city}
                    {' - '}
                    {randomCompany.type}
                </p>
                <p
                    css={css`
                        white-space: pre-wrap;
                        margin-bottom: 0;
                        position: relative;
                        padding-right: calc(${rhythm} / 2);
                        max-height: calc(${rhythm} * 8);
                        overflow: hidden;

                        :before {
                            content: "...";
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 1rem;
                        }
                        :after {
                            content: "";
                            position: absolute;
                            right: 0;
                            width: 1rem;
                            height: ${rhythm};
                            background: white;
                        }
                    `}
                >
                    {randomCompany.summary}
                </p>
            </div>
        </>
    );
};

export default (props) => (
	<StaticQuery
		query={graphql`
            query HighlightQuery {
                allStrapiCompany(filter: {published: {eq: true}}) {
                    edges {
                        node {
                            id
                            strapiId
                            name
                            published
                            quality
                            summary
                            type
                            fields {
                                slug
                            }
                            city
                            address {
                                addresstext1
                                addresstext2
                                enddate
                                id
                                latitude
                                longitude
                                startdate
                            }
                            mainimage {
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
		`}
		render={(data) => (
			<CompanyHighlight data={data} {...props} />
		)}
	/>
);
