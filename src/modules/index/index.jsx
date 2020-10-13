import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import NewBraftEditor from './newBraftEditor'
// import Excel from './excel';
// import VsAgainst from './vsAgainst'
// import Text from './text'
import 'antd/dist/antd.css';

const root = document.getElementById('app');
const load = () => render((
  <AppContainer>
    <NewBraftEditor />
  </AppContainer>
), root);

load();