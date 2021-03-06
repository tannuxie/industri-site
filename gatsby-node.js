const path = require('path');
const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem');
const createMDXNode = require('gatsby-plugin-mdx/utils/create-mdx-node');
const fs = require('fs');
const text = require('./src/components/text.json');

const CITYCONST = text.cities;

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
	// Query for nodes to use in creating pages.
	resolve(graphql(request).then((result) => {
		if (result.errors) {
			reject(result.errors);
		}
		return result;
	}));
});

function convertToSlug(Text) {
	return Text
		.toLowerCase()
		.replace(/å/g, 'a')
		.replace(/ä/g, 'a')
		.replace(/ö/g, 'o')
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-');
}

exports.createResolvers = ({
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
}) => {
    const { createNode } = actions;
    createResolvers({
        StrapiArticleContentBild: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
        StrapiArticleContentImgbox: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
        StrapiCompanyContentBild: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
        StrapiCompanyContentImgbox: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
        StrapiStaticContentContentBild: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
        StrapiStaticContentContentImgbox: {
            bildfil: {
                type: 'File',
                resolve(source, args, context, info) {
                    return createRemoteFileNode({
                        url: `http://localhost:1337${source.bildfil.url}`,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
    });
};

exports.onCreateNode = async ({
	node,
	getNode,
	actions,
	createNodeId,
}) => {
	const {
		createNodeField,
		createNode,
		createParentChildLink,
	} = actions;

	if (node.internal.type === 'StrapiCompany') {
		// console.log(`\n`, node.name)
		// console.log(`\n`, convertToSlug(node.name))
		const slug = convertToSlug(node.name);
		createNodeField({
			node,
			name: 'slug',
			value: slug,
        });
    }

	if (node.internal.type === 'StrapiArticle') {
		const slug = convertToSlug(node.title);
		createNodeField({
			node,
			name: 'slug',
			value: slug,
		});
	}

    if (node.internal.type === 'StrapiCompany'
    || node.internal.type === 'StrapiArticle'
    || node.internal.type === 'StrapiStaticContent') {
        const textObjects = [];

        // fs.writeFile(`${node.internal.type} - ${node.id}.txt`, JSON.stringify(node.content, undefined, 2), (err) => {
        //     // Deal with possible error here.
        //     console.log(`error, type: ${node.internal.type} id ${node.id}: `, err);
        // });

        Object.keys(node.content).forEach((item) => {
            // console.log('item: ', item);
            // console.log('item.content[item]: ', node.content[item]);
            Object.keys(node.content[item]).forEach((item2) => {
                // console.log('item2: ', item2);
                // console.log('node.content[item][item2]: ', node.content[item][item2]);

                // borde inte behövas mer med nya strukturen?
                // if (item2 === 'textfield') {
                //     textObjects.push(node.content[item][item2]);
                // }
                if (item2 === 'text' || item2 === 'text_vanster' || item2 === 'text_hoger') {
                    // console.log('textobject: ', node.content[item][item2][textfield]);
                    Object.keys(node.content[item][item2]).forEach((item3) => {
                        // console.log('item3: ', item3);
                        // console.log('node.content[item][item2][item3]: ', node.content[item][item2][item3]);

                        if (item3 === 'textfield') {
                            textObjects.push(node.content[item][item2][item3]);
                        }
                    });
                }
            });
        });

        if (textObjects.length > 0) {
            // console.log('textObjects: ', textObjects);
            textObjects.forEach(async (item) => {
                const content = `${item}`;
                const mdxNode = await createMDXNode({
                id: createNodeId(`${node.id}${item} >>> Mdx`),
                node,
                content,
                });
                // console.log('const mdxNode', mdxNode);
                createNode(mdxNode);
                createParentChildLink({ parent: node, child: mdxNode });
            });
        }
    }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;

	const getEntities = makeRequest(graphql, `
  {
    article: allStrapiArticle(filter: {published: {eq: true}}) {
      edges {
        node {
          id
          fields {
            slug
          }
        }
      }
    }
    company: allStrapiCompany(filter: {published: {eq: true}}) {
      edges {
        node {
          id
          fields {
            slug
          }
        }
      }
    }
  }
    `).then((result) => {
		// Create pages for each article.
		result.data.article.edges.forEach(({ node }) => {
			const tempvar = Number(node.id.match(/\d+/)[0]);
			createPage({
				path: `/artikel/${node.fields.slug}`,
				component: path.resolve('src/templates/article.js'),
				context: {
					id: tempvar,
				},
			});
		});
		result.data.company.edges.forEach(({ node }) => {
			const tempvar = Number(node.id.match(/\d+/)[0]);
			createPage({
				path: `/industri/${node.fields.slug}`,
				component: path.resolve('src/templates/company.js'),
				context: {
					id: tempvar,
				},
			});
		});
		CITYCONST.forEach((element) => {
			createPage({
				path: `${convertToSlug(element)}`,
				component: path.resolve('src/templates/citylist.js'),
				context: {
					string: element,
				},
			});
		});
	});

	// Query for articles nodes to use in creating pages.
	return getEntities;
};
