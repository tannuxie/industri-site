import React from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Layout from '~components/layout/layout';
import MyMap from '~components/map/map';
import ReactMarkdown from 'react-markdown/with-html';
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const CompanyTemplate = ({ data }) => {
	const pos = [];
	console.log('data:');
	console.log(data);

	data.strapiCompany.addresses.forEach((element) => {
		console.log('element: ');
		console.log(element);

		const address = {
			name: data.strapiCompany.name,
			addressstring1: element.addressstring1,
			addressstring2: element.addressstring2,
			position: [],
			startdate: element.startdate,
			enddate: element.enddate !== null
				? element.enddate : 'Nutid',
		};
		address.position.push(Number(element.latitude), Number(element.longitude));
		pos.push(address);
	});
	// console.log(pos);
	// console.log(pos[0]);
	// console.log(typeof(pos));
	// console.log(typeof(pos[0]));
	return (
		<Layout childTitle={`${data.strapiCompany.name}`}>
			<div>
				<h1
					className="title is-1"
					css={css`
					text-align: center;
					`}
				>
					{data.strapiCompany.name}
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
			{pos[0] !== undefined
				? (
				<div>
				<MyMap
					addresses={pos}
				/>
				</div>
				)
				: (null)
			}
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
				<ReactMarkdown
					source={data.strapiCompany.longtext}
					escapeHtml={false}
				/>
			</div>

		</Layout>
	);
};

export default CompanyTemplate;

export const companyQuery = graphql`
query CompanyTemplate($id: Int!) {
	strapiCompany(strapiId: {eq: $id}) {
	  strapiId
	  id
	  mainimage {
		id
		title
	  }
	  fields {
		slug
	  }
	  longtext
	  name
	  summary
	  type
	  updated_at
	  created_at
	  addresses {
		addressstring1
		addressstring2
		company
		enddate(formatString: "YYYY")
		id
		latitude
		longitude
		startdate(formatString: "YYYY")
	  }
	}
	strapiImage(companyimage: {id: {eq: $id}}) {
	  title
	  id
	  companyimage {
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
