import * as React from "react";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";

import "./style.less";
import {CSSProperties, HTMLAttributes, ReactNode} from "react";


const todo = (state: any, action: any) => {
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
    id: 1, text: "foo"
}], action: any) => {
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
                          action: any) => {
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

let nextTodoId = 0;
const addTodo = (text: string) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

const toggleTodo = (id: number) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

const setVisibilityFilter = (filter: any) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const {Component} = React;
const {Provider, connect} = ReactRedux;

const Link = ({
                  active,
                  children,
                  onClick,
              }: {
    active: boolean;
    children: Element | Element[];
    onClick: any;
}) => {
    if (active) {
        return <span>{children}</span>;
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

const mapStateToLinkProps = (state: any,
                             ownProps: any) => {
    return {
        active:
        ownProps.filter ===
        state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (dispatch: any,
                                ownProps: any) => {
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
              }: {
    onClick: any;
    completed: boolean;
    text: string;
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
                  }: {
    todos: any[];
    onTodoClick: any;
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

let AddTodo = ({dispatch}: {dispatch?: (action: any) => void}) => {
    let input: HTMLInputElement;

    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button onClick={() => {
                dispatch(addTodo(input.value));
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    );
};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos: any,
                         filter: string) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                (t: any) => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                (t: any) => !t.completed
            );
    }
}

const mapStateToTodoListProps = (state: any) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    };
};
const mapDispatchToTodoListProps = (dispatch: any) => {
    return {
        onTodoClick: (id: number) => {
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
    const sectionStyle: CSSProperties = {
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
                <AddTodo/>
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
    const style: CSSProperties = {
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

declare global {
    interface Window {
        myScrollY: HTMLElement;
        myHeader: HTMLElement;
    }
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
*/
