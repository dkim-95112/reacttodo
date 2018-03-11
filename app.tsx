import * as React from "react";
const Component = React.Component;
import * as ReactDOM from "react-dom";
//import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import "./style.less";

class MyButton extends Component {
    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        debugger
    }
    render() {
        return (
            <div>
                <button className="ripple-button"
                        onClick={() => this.handleClick()}>
                    foo
                </button>
                {/* <ReactCSSTransitionGroup
                    transitionName="ripple"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.oneShot ? <div>bar</div> : null}
                </ReactCSSTransitionGroup>*/}
            </div>
        );
    }
}

ReactDOM.render(
    <MyButton/>,
    document.getElementById("root")
);
