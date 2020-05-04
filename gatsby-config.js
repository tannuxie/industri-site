/* eslint-disable quotes */
module.exports = {
	siteMetadata: {
		title: 'Sävsjö Industrihistoria',
		author: 'J.C. Henriksson',
		description: 'Ett projekt för att sammanställa berättelser om lokala företag, deras ursprung och historia.',
		keywords: 'Sävsjö, Industri, Industrihistoria, Historia',
		siteUrl: 'https://www.savsjoindustrihistoria.se',
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
				name: 'Om oss',
				link: '/omoss',
			},
        ],
        companyTypes: [
            {
                name: 'Trä',
                color: '#bf7754',
            },
            {
                name: 'Metall',
                color: '#7b7b7b',
            },
            {
                name: 'Möbler / Träförädling',
                color: '#ff6846',
            },
            {
                name: 'Livsmedel',
                color: '#ff89aa',
            },
            {
                name: 'Skor & Kläder',
                color: '#ec2929',
            },
            {
                name: 'Plast / Gummi',
                color: '#e8e8e8',
            },
            {
                name: 'Övrigt / Diverse',
                color: '#3bc7ce',
            },
        ],
	},
	plugins: [
        'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-react-helmet-canonical-urls',
			options: {
				siteUrl: 'https://www.savsjoindustrihistoria.se',
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
		'gatsby-plugin-emotion',
		{
			resolve: 'gatsby-plugin-sass',
			options: {
				postCssPlugins: [],
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
            resolve: 'gatsby-source-strapi',
            options: {
                apiURL: 'http://localhost:1337',
                contentTypes: [
                    'user',
                    'article',
                    'company',
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
			resolve: 'gatsby-plugin-google-analytics',
			options: {
				trackingId: 'UA-164874945-1',
				// Setting this parameter is optional (requried for some countries such as Germany)
				anonymize: true,
			},
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
              name: `Sävsjö Industrihistoria`,
              short_name: `savsjoindustrihistoria`,
              start_url: `/`,
              background_color: `#6b37bf`,
              theme_color: `#6b37bf`,
              // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
              // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
              display: `standalone`,
              icon: `src/images/icon_file.png`, // This path is relative to the root of the site.
            },
          },
        'gatsby-plugin-sitemap',
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		'gatsby-plugin-offline',
	],
};
