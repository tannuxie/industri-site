/* eslint-disable quotes */
const lost = require('lost');

module.exports = {
	siteMetadata: {
		title: 'Sävsjö Industrihistoria',
		author: 'J.C. Henriksson',
		description: 'Ett projekt för att sammanställa berättelser om lokala företag, deras ursprung och historia.',
		keywords: 'Sävsjö, Industri, Industrihistoria, Historia',
		siteUrl: 'https://www.example.com',
		menuLinks: [
			{
				name: 'Hem',
				link: '/',
			},
			{
				name: 'Sävsjö',
				link: '/savsjo',
			},
			{
				name: 'Vrigstad',
				link: '/vrigstad',
			},
			{
				name: 'Stockaryd',
				link: '/stockaryd',
			},
			{
				name: 'Rörvik',
				link: '/rorvik',
            },
            {
				name: 'Hultagård',
				link: '/hultagard',
			},
			{
				name: 'Hylletofta',
				link: '/hylletofta',
			},
			{
				name: 'Vandra',
				link: '/vandra',
			},
			{
				name: 'Om oss',
				link: '/omoss',
			},
		],
	},
	plugins: [
        'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-react-helmet-canonical-urls',
			options: {
				siteUrl: 'https://www.example.com',
			},
		},
		{
			resolve: 'gatsby-plugin-mdx',
			options: {
				extensions: ['.mdx', '.md'],
				gatsbyRemarkPlugins: [
					{
						resolve: 'gatsby-remark-autolink-headers',
						options: {
							className: 'subHeading',
							icon: false,
						},
					},
					'gatsby-remark-smartypants',
					{
						resolve: 'gatsby-remark-external-links',
						options: {
							target: '_blank',
							rel: 'noopener',
						},
					},
				],
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: 'gatsby-plugin-alias-imports',
			options: {
				alias: {
					'~components': 'src/components',
					'~style': 'src/style',
				},
				extensions: [],
			},
		},
		{
			resolve: 'gatsby-source-strapi',
			options: {
				apiURL: 'http://localhost:1337',
				contentTypes: [
					'user',
					'article',
					'company',
					'street',
                    'tag',
                    'static-content',
                    'media',
				],
				queryLimit: 2000,
				loginData: {
					identifier: '',
					password: '',
				},
			},
		},
		{
			resolve: 'gatsby-plugin-sharp',
			options: {
				useMozJpeg: false,
				stripMetadata: true,
				defaultQuality: 75,
			},
		},
        'gatsby-transformer-sharp',
        {
            resolve: `gatsby-plugin-layout`,
            options: {
                component: require.resolve(`./src/components/layout/layout`),
            },
        },
		{
			resolve: 'gatsby-plugin-typography',
			options: {
				pathToConfigModule: 'src/style/typography',
			},
		},
		// `gatsby-plugin-theme-ui`,
		'gatsby-plugin-emotion',
		{
			resolve: 'gatsby-plugin-sass',
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
				linkStyles: true, // (default: true) Enable/disable loading stylesheets via CDN
			},
		},
		{
			resolve: 'gatsby-plugin-google-analytics',
			options: {
				trackingId: 'UA-XXXXXXXX-X',
				// Setting this parameter is optional (requried for some countries such as Germany)
				anonymize: true,
			},
		},
        'gatsby-plugin-sitemap',
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		// `gatsby-plugin-offline`
	],
};
