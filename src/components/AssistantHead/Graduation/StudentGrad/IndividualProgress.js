import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const ThisStyle={
    width:"300px",
    float:"left"
}

export default class IndividualProgress extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            completed: 0,
        };
    }

    componentDidMount(){
        this.timer = setTimeout(() => this.progress(2), 100);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    progress(completed) {
        if (completed > this.props.grad) {
            this.setState({completed: this.props.grad});
        } else {
            this.setState({completed});
            const diff = 1 * 10;
            this.timer = setTimeout(() => this.progress(completed + diff), 200);
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <LinearProgress
                    color="#00AEAE"
                    mode="determinate"
                    style={ThisStyle}
                    value={this.state.completed}
                    thickness={7}/>
            </MuiThemeProvider>
        );
    }
}