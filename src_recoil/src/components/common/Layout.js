import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Loading from '../../components/common/Loading'
import AppRouter from '../../router/AppRouter'

const Layout = _ => {
    return (
        <Router>
            <div className="container">
                <Header />
            </div>
            <main role="main" className="container">
                <Suspense fallback={<Loading />}>
                    <AppRouter />
                </Suspense>
            </main>
            <Footer />
        </Router>
    );
}

export default Layout