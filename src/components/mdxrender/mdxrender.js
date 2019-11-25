import React from 'react'
import { MDXProvider, mdx } from '@mdx-js/react'
import { MDXRenderer } from "gatsby-plugin-mdx"
import MyMap from '~components/map/map'
import ImgBox from '~components/image/image'

const shortcodes = {
    MyMap, 
    ImgBox
}

const MdxRender = ({ mdxBody }) => {
    return (
        <MDXProvider components={shortcodes}>
            <MDXRenderer>
                {mdxBody}
            </MDXRenderer>
        </MDXProvider>
    )
}

export default MdxRender