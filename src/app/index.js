import "core-js/modules/es6.number.is-finite";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.object.assign";

import React from 'react';
import { render } from 'react-dom';
import Main from './containers/Main';
import configureStore from './store/configureStore';

const store = configureStore();
render(<Main store={store} />, document.getElementById('main'));