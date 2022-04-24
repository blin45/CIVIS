import React from "react";
import { Card } from "@material-ui/core";
import { CardContent } from "@material-ui/core";
import "./sideBar.css";



export default class SideBar extends React.Component {
    constructor () {
        super();
        this.state = {
            searchResult: '',
            infdata:[],
          };
          this.onSearchChange = this.onSearchChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);
    }
    onSearchChange(event) {
        this.setState({ searchResult: event.target.value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmitSearch(this.state.searchResult);
    }
    onCenterChange(event){
        this.props.changeCenter(event.target.value);
    }
    render() {
        const { infdata } = this.props;
        return (
        /*TODO: 
        1. pass the json data to this component and 
        generate all cards using each infrastructure

        2. add some sort of outline or padding between card
        
        3. Implement the search functionality at the top of the sidebar

        4. Figure out a way to communicate between the map and the sidebar when highlighting the card
        */
        <div>
           
            <h2>Search infrastructure By id</h2>

            <input type="text" onChange={this.onSearchChange} />
            
            <h2 colSpan="2">
            <button onClick={this.onSubmit}>Submit</button>
            </h2>
            {infdata.map((data) => {
                return (
                    <Card className="card">
                        <CardContent>
                            <div className="card-content">
                                <div className="card-title">
                                    <h3>{data.properties.id}</h3>
                                </div>
                                <div className="card-description">
                                    <p>Type: {data.properties.type}</p>
                                    <p>Risks: {data.properties.fields.risk_score}</p>
                                    <button>Center</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            }
            )}
        </div>
       
        );
    }
}