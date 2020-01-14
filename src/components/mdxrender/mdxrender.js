import React from 'react';
import { MDXProvider, mdx } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import MyMap from '~components/map/map';
import ImgBox from '~components/imgbox/imgbox';
import Linky from '~components/linky/linky';

const shortcodes = {
    Linky,
};

const MdxRender = ({ mdxBody }) => (
        <MDXProvider components={shortcodes}>
            <MDXRenderer>
                {mdxBody}
            </MDXRenderer>
        </MDXProvider>
);

export default MdxRender;
