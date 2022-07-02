import React from "react";
import { Breadcrumb, Button, ButtonGroup, Row, Col, InputGroup, Form, Dropdown, Table, Card, DropdownButton } from "@themesberg/react-bootstrap";
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css'

import Teams from '../../data/teams';

class Ranking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: [false], 
            teams: [], 
            animating: false, 
            animationTimeout: null, 
        };
        for (var i = 1; i <= 8; i++) {
            this.state.clicked.push(false);
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.updateTeams = this.updateTeams.bind(this);
        this.animationStopped = this.animationStopped.bind(this);
    }

    componentDidMount() {
        setInterval(this.updateTeams, 1000);
    }

    updateTeams() {
        if (!this.state.animating) {
            Teams.update().then((teams) => {
                this.setState({ 
                    ...this.state.clicked, 
                    teams: teams, 
                });
            } );
        }
    }

    animationStopped() {
        this.setState({ 
            ...this.state.teams, 
            animating: false, 
        });
    }

    handleClick(e, ID) {
        if (this.state.animating) {
            return;
        }

        let clickedArray = new Array(this.state.teams.length).fill(false);
        clickedArray[ID] = !this.state.clicked[ID];

        this.setState({ 
            ...this.state.teams, 
            clicked: clickedArray, 
            animating: true, 
        });

        setTimeout(this.animationStopped, 550);
    }

    handleBlur(e) {
        if (this.state.animating) {
            return;
        }

        let clickedArray = new Array(this.state.teams.length).fill(false);

        this.setState({ 
            clicked: clickedArray, 
            teams: this.state.teams, 
            animating: true, 
        });

        setTimeout(this.animationStopped, 550);
    }

    render() {
        return (
            <Table borderless className="align-items-center">
                <thead>
                    <tr onClick={ (e) => { this.updateTeams() } }>
                        <th className="border-bottom" style={{ "fontSize": "1.7rem" }}>Rank</th>
                        <th className="border-bottom" style={{ "fontSize": "1.7rem" }}>Team</th>
                        <th className="border-bottom" style={{ "fontSize": "1.7rem" }}>Score</th>
                    </tr>
                </thead>
                <tbody tabIndex={ 0 } onBlur={ this.handleBlur }>
                    <tr>
                        <th colSpan={ 3 }></th>
                    </tr>
                    { this.state.teams.map((team) => (
                        <>
                            <tr onClick={ (e) => this.handleClick(e, team.ID) } className="rank" onAnimationEnd={ () => {console.log("end")} }>
                                <th className="border-bottom" style={{ "fontSize": "1.5rem", "fontWeight": "bold"}}>#{ team.rank }</th>
                                <th className="border-bottom" style={{ "fontSize": "1.3rem" }}>{ team.name }</th>
                                <th className="border-bottom" style={{ "fontSize": "1.3rem", "fontStyle": "italic" }}>{ team.score }</th>
                            </tr>
                            <tr>
                                <th colSpan={ 3 }>
                                    <SlideDown closed={ !this.state.clicked[team.ID] } className="history-slider">
                                    <Card border="light" className="table-wrapper table-responsive shadow-sm history">
                                        <Card.Body>
                                            <Table borderless className="user-table align-items-center">
                                                <thead>
                                                    <tr>
                                                        <th className="border-bottom" style={{ "fontSize": "1.1rem" }}>RFID</th>
                                                        <th className="border-bottom" style={{ "fontSize": "1.1rem" }}>Score</th>
                                                        <th className="border-bottom" style={{ "fontSize": "1.1rem" }}>Timestamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { team.history.map((record) => (
                                                        <tr>
                                                            <th className="border-bottom" style={{ "fontSize": "1.0rem", "fontWeight": "bold" }}>{ record.RFID }</th>
                                                            <th className="border-bottom" style={{ "fontSize": "0.9rem", "fontStyle": "italic" }}>{ record.score }</th>
                                                            <th className="border-bottom" style={{ "fontSize": "0.9rem" }}>{ record.timestamp }</th>
                                                        </tr>
                                                    )) }
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                    </SlideDown>
                                </th>
                            </tr>
                        </>
                    )) }
                </tbody>
            </Table>
        );
    }
}

export default Ranking;
