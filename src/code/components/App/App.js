import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import menu from '../../assets/openMenu.png';
import AnnotatedLineChart from '../AnnotatedLineChart/AnnotatedLineChart';
import AnimatedBubbleChart from '../AnimatedBubbleChart/AnimatedBubbleChart';
import TransitionBubbleChart from '../TransitionBubbleChart/TransitionBubbleChart';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPage: "Transition Scatterplot",
            page: <TransitionBubbleChart/>,
            menuOpen: false
        }
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    
    render() {
        return <div className="app">
            {this.renderMenuButton()}
            {this.renderMenu()}
            {this.renderContent()}
        </div>
    }

    renderMenuButton() {
        const className = this.state.menuOpen ? "menu-btn menu-btn-expanded" : "menu-btn";
        return <img src={menu} alt="Menu Icon" width="30" height="30" className={className} onClick={() => this.setState({menuOpen: !this.state.menuOpen})}/>
    }

    renderMenu() {
        const list = ["Annotated Line Chart", "Animated Scatterplot", "Transition Scatterplot"];
        const className = this.state.menuOpen ? "menu full" : "menu none";
        return <div className={className}>
            <div className="menu-content">
                <ul className="menu-list">
                    {list.map(item => {
                        const selected = item === this.state.selectedPage ? "selected-menu-item menu-item" : "menu-item";
                        return <li key={item} className={selected} id={item} onClick={this.handleItemClick}>{item}</li>
                    })}
                </ul>
            </div>
        </div>
    }

    renderContent() {
        const className = this.state.menuOpen ? "content partial" : "content expanded";
        return <div className={className}>
            {this.state.page}
        </div>
    }

    handleItemClick(e) {
        switch(e.target.id) {
            case "Annotated Line Chart":
                this.setState({page: <AnnotatedLineChart/>, selectedPage: e.target.id});
                break;
            case "Animated Scatterplot":
                this.setState({page: <AnimatedBubbleChart/>, selectedPage: e.target.id});
                break;
            case "Transition Scatterplot":
                this.setState({page: <TransitionBubbleChart/>, selectedPage: e.target.id});
                break;
            default :
                this.setState({page: <AnnotatedLineChart/>, selectedPage: e.target.id});
        }
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
