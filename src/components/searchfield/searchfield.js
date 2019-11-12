import React, { Component } from 'react'
import Suggestions from '~components/searchfield/suggestions'
import { StaticQuery, graphql } from "gatsby"
import { css } from "@emotion/core"
import { Link, navigate } from 'gatsby'

class Search extends Component { 
    state = {
        data: {} = this.props.data,
        query: '',
        results: []
    }
    
    getInfo = () => {
        console.log(this.state.query);
        this.state.results = [];
       
        // this.state.data.company.edges.forEach(function (element, index) {
        //     if (element.node.name.startsWith(this.state.query)) {
        //         const newObj = {
        //             id: index,
        //             name: element.node.name,
        //             slug: element.node.fields.slug
        //         }
        //         this.state.results.push(newObj)
        //     }
        //     console.log(element.node);            
        // });

        for (let index = 0; index < this.state.data.company.edges.length; index++) {
            const element = this.state.data.company.edges[index];
            if (element.node.name.toUpperCase().startsWith(this.state.query.toUpperCase())) {
                const newObj = {
                    id: index,
                    name: element.node.name,
                    slug: element.node.fields.slug
                }
                this.state.results.push(newObj)
            }
        }
        console.log(this.state.results);
    }
    
    handleInputChange = () => {
        this.setState({
          query: this.search.value
        }, () => {
          if (this.state.query && this.state.query.length > 1) {
            if (this.state.query.length % 2 === 0) {
            console.log('query: ' + this.search.value);
                
            this.getInfo()
            }
          } else {
              this.state.results = []
          }
        })
    }

    handleSubmit = (event) => {
            event.preventDefault();
            console.log('handleSubmit: '+ this.state.query);
            
            this.willNavigate(this.state.query);
    }

    willNavigate = (query) => {
        console.log('willNavigate: ' + query);
        if(location.pathname !== "/alla") {
            navigate(
                "/alla/",
                {
                    state:  {
                        search: query
                    },
                }
            )
        } else {
            location.search = query;
        }
                
    }

    render() {
        return (
            <form
                css={css`
                    margin-bottom: 0;
                `}
                onSubmit={this.handleSubmit}
            >
                <input
                placeholder="Sök efter något..."
                ref={input => this.search = input}
                onChange={this.handleInputChange}
                css={css`
                border: 1px solid rgba(0, 0, 0, 0.1);
                background: #fff;
                padding: 5px 7px;
                font-size: inherit;
                border-radius: 3px;
                font-weight: normal;
                outline: none;
                display: flex;
                flex-direction: column;
                margin-bottom: 0;
                `}
                />
                <Suggestions results={this.state.results} />
            </form>
        )
    }
}

export default () => (
    <StaticQuery
      query={graphql`
        query searchQuery {
            company: allStrapiCompany(filter: {published: {eq: true}, mainimage: {id: {ne: null}}}) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        name
                        city
                    }
                }
            }
        }
      `}
      render={data => (
        <Search data={data} />
      )}
    />
)
