import React from 'react'
import ReactDOM from 'react-dom'
import './style.less'

function MyButton(){
    return (
        <button className="ripple-button">foo</button>
    )
}

ReactDOM.render(
    <MyButton/>,
    document.getElementById('root')
)

