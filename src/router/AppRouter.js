import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ErrorBoundary from "../ErrorBoundary";

const Home = React.lazy(() => import('../components/pages/Home'));
const Section = React.lazy(() => import('../components/pages/Section'));

const AppRouter = _ => {
    return (
        <Switch>
            <ErrorBoundary>
                <Route path="/" component={Home} exact={true} />
                <Route path="/section/:slug" component={Section} />
            </ErrorBoundary>
        </Switch>
    );
}

export default AppRouter;