import React from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                <h1>Something went wrong !</h1>
                <Link to="/">Home</Link>
                </div>
            )
        }

        return this.props.children
    }
}
