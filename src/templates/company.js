import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import ReactMarkdown from 'react-markdown/with-html';
import Helmet from '~components/helmet/helmet';
import MyMap from '~components/map/map';
import MdxRender from '~components/mdxrender/mdxrender';
import ZoneParser from '~components/zoneparser/zoneparser';

const CompanyTemplate = ({ data }) => {
	console.log('data', data);
    const company = data.strapiCompany;
    console.log('company', company);
    console.log(company.address[0]);

    // pins ska ha formen name(string), position[number,number], subtitle(string)
	const pins = company.address.map((element) => {
		console.log('element', element);

		return {
			name: company.name,
			position: [element.latitude, element.longitude],
            subtitle: `${element.addresstext1}\n${element.addresstext2}`
            + `\n${element.startdate}${element.enddate ? (` - ${element.enddate}`) : (' - Nutid')}`,
		};
    });
    console.log('company pins', pins);

	return (
		<>
            <Helmet childTitle={`${company.name}`} />
			<div id="company-top">
				<h1
					className="title is-1"
					css={css`
					text-align: center;
					`}
				>
					{company.name}
				</h1>
				<div>
					<div>
                        <Img
                            fluid={company.mainimage.childImageSharp.fluid}
                            alt={company.name}
                            css={css`
                                margin: 1.5rem 0;
                                img {
                                    object-fit: cover!important;
                                }
                            `}
                        />
					</div>
				</div>
			</div>

            <div id="company-map">
                <MyMap
                    address={[company.address[0].latitude, company.address[0].longitude]}
                    pins={pins}
                />
            </div>

            <div id="company-content">
                <ZoneParser
                    content={company.content}
                    childMdx={company.children}
                />
            </div>

		</>
	);
};

CompanyTemplate.propTypes = {
	data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default CompanyTemplate;

export const companyQuery = graphql`
    query CompanyTemplate($id: Int!) {
        strapiCompany(strapiId: {eq: $id}) {
            strapiId
            id
            name
            mainimage {
                id
                childImageSharp {
                    fluid(maxWidth: 1920) {
                        ...GatsbyImageSharpFluid
                        aspectRatio
                    }
                }
            }
            fields {
                slug
            }
            summary
            type
            updated_at
            created_at
            address {
                addresstext1
                addresstext2
                id
                latitude
                longitude
                startdate
                enddate
            }
            content {
                undertext
                textfield
                id
                bild {
                    id
                    beskrivning
                    bildfil {
                        childImageSharp {
                            fluid(maxWidth: 1360) {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                }
                bredd_bildbox
                imgbox {
                    beskrivning
                    id
                    bildfil {
                        childImageSharp {
                            fluid(maxWidth: 1360) {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                }
                latitude
                layout
                longitude
                map_pin {
                    beskrivning
                    id
                    latitude
                    longitude
                }
                text {
                    id
                    textfield
                }
                text_hoger {
                    id
                    textfield
                }
                text_vanster {
                    id
                    textfield
                }
                undertext_bildbox
                width
                zoom
            }
            children {
                ... on Mdx {
                    id
                    body
                }
            }
            quality
        }
    }
`;
