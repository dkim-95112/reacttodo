import * as React from "react";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";
import * as ReactDOM from "react-dom";
import "./style.less";

class MyButton extends React.Component<{}, {oneShot: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {oneShot: false};
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        const rippleEffect = this.state.oneShot ? <div className="ripple-effect">foo</div> : null;
        return (
            <div>
                <button className="ripple-button"
                        onClick={() => this.handleClick()}>
                    foo
                </button>
                {<ReactCSSTransitionGroup transitionName="ripple">
                    {rippleEffect}
                </ReactCSSTransitionGroup>}
            </div>
        );
    }
    private handleClick() {
        this.setState({oneShot: true}, () => {
            this.setState({oneShot: false});
        });
    }
}

ReactDOM.render(
    <MyButton/>,
    document.getElementById("root")
);
