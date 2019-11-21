const lost = require('lost')

module.exports = {
	siteMetadata: {
		title: `Sävsjö Industrihistoria`,
		author: `J.C. Henriksson`,
		description: `Ett projekt för att sammanställa berättelser om lokala företag, deras ursprung och historia.`,
		keywords: `Sävsjö, Industri, Industrihistoria, Historia`,
		siteUrl: `https://www.example.com`,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
		  resolve: `gatsby-plugin-react-helmet-canonical-urls`,
		  options: {
			siteUrl: `https://www.example.com`,
		  },
		},
		{
			resolve: `gatsby-plugin-mdx`,
			options: {
				extensions: [`.mdx`, `.md`],
				gatsbyRemarkPlugins: [
					{
					resolve: `gatsby-remark-autolink-headers`,
						options: {
								offsetY: `100`,
								className: `subHeading`,
								removeAccents: true,
							},
					},
				],
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			},
		},
		{
			resolve: `gatsby-plugin-alias-imports`,
			options: {
				alias: {
					'~components': 'src/components',
					'~style': 'src/style',
				},
				extensions: [],
			},
		},
		{
			resolve: `gatsby-source-strapi`,
			options: {
				apiURL: 'http://localhost:1337',
				contentTypes: [
					'user',
					'article',
					'image',
					'address',
					'company',
					'street',
					'tag',
				],
				queryLimit: 2000,
				loginData: {
					identifier: "industrisite",
					password: "_GGkq.RU@CG9!_i",
				},
			},
		},
		`gatsby-transformer-sharp`,		
		{
			resolve: `gatsby-plugin-sharp`,
			options: {
				useMozJpeg: false,
				stripMetadata: true,
				defaultQuality: 75,
			},
		},
		`gatsby-plugin-emotion`,
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `src/style/typography`,
			},
		},
		{
			resolve: `gatsby-plugin-sass`,
			options: {
				postCssPlugins: [
				  lost(),
				],
				precision: 8,
			},
		},
		{
			resolve: 'gatsby-plugin-react-leaflet',
			options: {
			  linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
			}
		},
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: 'UA-XXXXXXXX-X',
				// Setting this parameter is optional (requried for some countries such as Germany)
				anonymize: true,
			},
		},
		`gatsby-plugin-sitemap`
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		//`gatsby-plugin-offline`
	],
};
