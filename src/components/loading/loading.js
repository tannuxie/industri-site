import React from 'react';
import { css } from '@emotion/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => (
    <div css={css`
        width: 100%
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `}
    >
        <h1
            css={css`text-align: center;`}
        >
            Laddar karta...
        </h1>
        <CircularProgress />
    </div>
);

export default Loading;
