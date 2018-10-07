import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';
import './App.css';

import logo from './logo.svg';

const Introduction = styled.p`
    font-weight: 900;
    font-size: large;
`;

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Introduction>
                    { injectGlobal`` }
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </Introduction>
            </div>
        );
    }
}

export default App;
