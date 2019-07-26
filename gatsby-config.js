module.exports = {
	siteMetadata: {
		title: `Sävsjö Industrihistoria`,
		author: `Folk i Sävsjö`,
		description: `Ett projekt för att sammanställa berättelser om lokala företag, deras ursprung och historia.`,
		keywords: `Sävsjö, Industri, Industrihistoria, Historia`,
		siteUrl: `https://www.example.com`,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		{
			resolve: `gatsby-source-strapi`,
			options: {
				apiURL: 'http://localhost:1337',
				contentTypes: [
					'user',
					'article',
					'image'
				],
				queryLimit: 1000,
			}
		},
		`gatsby-transformer-sharp`,		
		{
			resolve: `gatsby-plugin-sharp`,
			options: {
				useMozJpeg: false,
				stripMetadata: true,
				defaultQuality: 75,
			}
		},
		`gatsby-plugin-sass`,
		`gatsby-plugin-emotion`,
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `src/style/typography`
			}
		},
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: 'UA-XXXXXXXX-X',
				// Setting this parameter is optional (requried for some countries such as Germany)
				anonymize: true
			}
		},
		`gatsby-plugin-sitemap`
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		//`gatsby-plugin-offline`
	],
};
