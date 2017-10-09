import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PurshaseComponent } from './components/Purshase';
import { EditViewPurshase } from './components/EditViewPurshase';

export const routes = <Layout>
    <Route exact path='/' component={ PurshaseComponent } />
    <Route path='/editViewPurshase' component={ EditViewPurshase } />
</Layout>;
