import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="shortcut-icon" rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />,
    <link key="icon" rel="icon" href="/favicon.ico" type="image/x-icon" />,
    <title key="title">He's a good boy</title>,
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
  ]);
};
