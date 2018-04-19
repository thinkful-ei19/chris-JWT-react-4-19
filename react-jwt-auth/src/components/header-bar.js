import React from 'react';
import {connect} from 'react-redux';
import {clearAuth, incrementTimer} from '../actions/auth';
import {clearAuthToken} from '../local-storage';
import Idle from 'react-idle';

export class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
    }
    logOut() {
        this.props.dispatch(clearAuth());
        // clearAuthToken();
    }

    render() {
        // Only render the log out button if we are logged in
        let logOutButton;
        if (this.props.loggedIn) {
            // bind this to self to access it in setInterval.
            const self = this;
            //Initiate count at 0, increment each minute and increment count in state.
            let count = 0;
            let interval = setInterval(function() {
                count++
                if (count <= 5) {
                    self.props.dispatch(incrementTimer(count))
                }
                if (count === 5) {
                    self.props.dispatch(incrementTimer(count))
                    // Clear interval before logout so that it doesn't persist next login.
                    clearInterval(interval);
                }
            }, 60 *1000)

            logOutButton = (
                <div>
                    <button onClick={() => this.logOut()}>Log out</button>
                    <Idle
                    //Timeout warning at 4 minutes
                    timeout={4 * 60 * 1000}
                    onChange={({ idle }) => {
                        //Whenever the browser detects user activity, set the count back to 0
                        if (idle === false) {
                            count = 0;
                        }
                    }}
                    render={({ idle }) => {
                        return (
                            <h1>
                                {idle ? "No activity detected: Logout commencing soon." : "" }
                            </h1>
                        )
                    }
                    }
                    />
                </div>
            );
        }
        return (
            <div className="header-bar">
                <h1>Foo App</h1>
                {logOutButton}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return({
        loggedIn: state.auth.currentUser !== null
    });
}

export default connect(mapStateToProps)(HeaderBar);
