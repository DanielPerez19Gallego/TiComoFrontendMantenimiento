import React, { Component } from 'react';

class PageNotFound extends Component {

    render() {
        return (
            <div className="center-log">
                <div className="card-log2">
                    <h1 class="error404">404 Error</h1>
                    <h1>Page Not Found</h1>
                    <div class="columns-rid">
                        <input type="submit" value="Ir a inicio de sesión" onClick={() => this.goToLogin()} />
                    </div>
                </div>
            </div>
        )
    }

    goToLogin() {
        this.props.history.push({
            pathname: '/'
        });
    }
}

export default PageNotFound;