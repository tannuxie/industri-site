const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`)
const createMDXNode = require("gatsby-plugin-mdx/utils/create-mdx-node");
const crypto = require(`crypto`)

const CITYCONST = [
  "sävsjö", 
  "vrigstad", 
  "stockaryd", 
  "rörvik", 
  "hultagård", 
  "hylletofta"
]

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
  // Query for nodes to use in creating pages.
  resolve(
    graphql(request).then(result => {
      if (result.errors) {
        reject(result.errors)
      }      
      return result;
    })
  )
});

function convertToSlug(Text) {
    return Text
        .toLowerCase()
        .replace(/å/g,'a')
        .replace(/ä/g,'a')
        .replace(/ö/g,'o')
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
};

exports.onCreateNode = async ({ 
  node, 
  getNode, 
  actions,
  createNodeId
}) => {
  const { 
    createNodeField, 
    createNode, 
    createParentChildLink } = actions

  if (node.internal.type === `StrapiCompany`) {
    //console.log(`\n`, node.name)
    //console.log(`\n`, convertToSlug(node.name))
      const slug = convertToSlug(node.name)
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
  }
  if (node.internal.type === `StrapiArticle`) {
    //console.log(`\n`, node.title)
    //console.log(`\n`, convertToSlug(node.title))
      const slug = convertToSlug(node.title)
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
    //const content = await loadNodeContent(node);
    
    const content = `${node.content}`;

    // createNodeField({
    //     node,
    //     name: `mdx`,
    //     value: content,
    //  })
    // createNode({
    //   // Data for the node.
    //   content: content,
    
    //   // Required fields.
    //   id: createNodeId(`${node.id} >>> Mdx`),
    //   parent: node.id, // or null if it's a source node without a parent
    //   children: [],
    //   internal: {
    //     type: `Mdx`,
    //     contentDigest: crypto
    //       .createHash(`md5`)
    //       .update(JSON.stringify(content))
    //       .digest(`hex`),
    //     mediaType: `text/markdown`, // optional
    //     content: content, // optional
    //   }
    // })

    const mdxNode = await createMDXNode({
      id: createNodeId(`${node.id} >>> Mdx`),
      node,
      content
    });
    createNode(mdxNode);
    createParentChildLink({ parent: node, child: mdxNode });
  }

}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  
  const getEntities = makeRequest(graphql, `
    {
      article: allStrapiArticle(filter: {published: {eq: true}, coverimage: {id: {ne: null}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
      company: allStrapiCompany(filter: {published: {eq: true}, mainimage: {id: {ne: null}}}) {
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
    `).then(result => {
    // Create pages for each article.
    result.data.article.edges.forEach(({ node }) => {
      const tempvar = Number(node.id.match(/\d+/)[0])
      createPage({
        path: `/artikel/${node.fields.slug}`,
        component: path.resolve(`src/templates/article.js`),
        context: {
          id: tempvar,
        },
      })
    })
    result.data.company.edges.forEach(({ node }) => {
      const tempvar = Number(node.id.match(/\d+/)[0])
      createPage({
        path: `/industri/${node.fields.slug}`,
        component: path.resolve(`src/templates/company.js`),
        context: {
          id: tempvar,
        },
      })
    })
    CITYCONST.forEach(element => {
      createPage({
        path: `${convertToSlug(element)}`,
        component: path.resolve(`src/templates/citylist.js`),
        context: {
          string: element,
        },
      })
    })
  });
  
  // Query for articles nodes to use in creating pages.
  return getEntities;
};