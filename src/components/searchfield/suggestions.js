import React from 'react'
import { css } from "@emotion/core"
import { Link } from 'gatsby'

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li 
        key={r.id}
        css={css`
            padding: 5px 7px;
        `}
    ><Link
        to={`/industri/${r.slug}`}
    >
      {r.name}
    </Link>
    </li>
  ))
  return <ul
            css={css`
                margin-bottom: 0;
                position: absolute;
                background-color: white;
                list-style-position: inside;
                list-style-image: none;
                list-style-type: none;
                margin: 0px;
                border-radius: 0px 0px 5px 5px;
                margin-right: 0.75rem;
                box-shadow: 0 0 6px 0px rgba(0,0,0,0.1);
            `}
        >
            {options}
        </ul>
}

export default Suggestions