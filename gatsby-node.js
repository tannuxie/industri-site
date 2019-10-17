const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`)

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


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
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
  }

}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  
  const getArticles = makeRequest(graphql, `
    {
      article: allStrapiArticle {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
      company: allStrapiCompany {
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
  });
  
  // Query for articles nodes to use in creating pages.
  return getArticles;
};