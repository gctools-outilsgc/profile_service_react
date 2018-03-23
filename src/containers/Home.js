import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

const Home = () => (
  <div>
    {__('This is the home page')}
  </div>
);

export default LocalizedComponent(Home);
