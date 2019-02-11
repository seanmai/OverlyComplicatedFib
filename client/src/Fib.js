import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndices: [],
        values: {},
        index: ""
    };

    componentDidMount(){
        this.fetchValues();
        this.fetchIndices();
    }

    async fetchValues(){
        const values = await axios.get("/api/values/current");
        this.setState({
            values: values.data
        });
    }

    async fetchIndices(){
        const seenIndices = await axios.get("/api/values/all");
        this.setState({
            seenIndices: seenIndices.data
        });
    }
}
