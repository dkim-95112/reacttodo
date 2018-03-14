import React, {SyntheticEvent} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ReactDOM from "react-dom";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";
import isEmpty from "lodash/isEmpty";

import "./style.less";
import {CSSProperties, HTMLAttributes, ReactNode} from "react";

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [{
    id: 0, text: "foo"
}], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            );
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL',
                          action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const {combineReducers} = Redux;
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

let nextTodoId = 1;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const {Component} = React;
const {Provider, connect} = ReactRedux;

const Link = ({active, children, onClick}) => {
    if (active) {
        return <span>{children}</span>
    }

    return (
        <a href='#'
           onClick={e => {
               e.preventDefault();
               onClick();
           }}
        >
            {children}
        </a>
    );
};

const mapStateToLinkProps = (state,
                             ownProps) => {
    return {
        active:
        ownProps.filter ===
        state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (dispatch,
                                ownProps) => {
    return {
        onClick: () => {
            dispatch(
                setVisibilityFilter(ownProps.filter)
            );
        }
    };
}
const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink filter='SHOW_ALL'>
            All
        </FilterLink>
        {', '}
        <FilterLink filter='SHOW_ACTIVE'>
            Active
        </FilterLink>
        {', '}
        <FilterLink filter='SHOW_COMPLETED'>
            Completed
        </FilterLink>
    </p>
);

const Todo = ({
                  onClick,
                  completed,
                  text
              }) => (
    <li
        onClick={onClick}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>
);

const TodoList = ({
                      todos,
                      onTodoClick
                  }) => {
    return (
        <ul>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                />
            )
            }
        </ul>
    )
};

class AddTodo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        }
        this.onChange = this.onChange.bind(this)
        this.add = this.add.bind(this)
    }
    add(){
        this.props.dispatch(addTodo(this.state.value))
        this.setState({value: ""})
    }

    onChange(e) {
        return this.setState({value: e.target.value});
    }
    render() {
        return (
            <div>
                <input onChange={this.onChange} value={this.state.value}/>
                <button
                    className="btn-primary"
                    // disabled={isEmpty(this.state.value)}
                    onClick={this.add}>
                    Add Todo
                </button>
            </div>
        );
    }
};
const AddTodoConnected = connect()(AddTodo);

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                (t) => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                (t) => !t.completed
            );
    }
}

const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    };
};
const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }
    };
};
const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

const myHead = {
    maxHeight: 200,
    minHeight: 50
}

const TodoApp = () => {
    const sectionStyle = {
        backgroundColor: 'skyblue',
        left: 0,
        minHeight: 1000,
        padding: 15,
        position: 'absolute',
        top: myHead.maxHeight,
        width: '100%',
    }
    return (
        <div>
            <CollapsingHeader/>
            <section style={sectionStyle}>
                <AddTodoConnected/>
                <VisibleTodoList/>
                <Footer/>
            </section>
        </div>
    )
}

const {createStore} = Redux;

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp/>
    </Provider>,
    document.getElementById('root')
);

function CollapsingHeader() {
    const style = {
        backgroundColor: 'salmon',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: myHead.maxHeight,
        margin: 0
    }
    return (
        <h1 id="myHeader" style={style}>
            Collapsing header <span id="myScrollY"></span>
        </h1>
    )
}

window.addEventListener('scroll', function(){
    const headerScrollLimit = myHead.maxHeight - myHead.minHeight
    if (window.scrollY <= headerScrollLimit) {
        const top = window.scrollY,
            height = myHead.maxHeight - top;
        window.myScrollY.textContent = String(window.scrollY)
        window.myHeader.style.top = top + 'px'
        window.myHeader.style.height = height + 'px'
    }
});

/*
class MyButton extends React.Component<{}, {oneShot: boolean}> {
    constructor(props) {
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
*/
