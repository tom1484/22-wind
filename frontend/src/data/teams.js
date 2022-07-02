import axios from 'axios';


class Team {

    constructor() {
        this.teams = null;
    }

    async update() {
        let post_data = {
            url: "http://140.112.174.222:9487/wind/fetch", 
            method: "post", 
            data: {}, 
        };
        let query = await axios(post_data);
        
        let data = query.data.result;
        data.sort((A, B) => (A.score < B.score) ? 1 : ((A.score > B.score) ? -1 : 0));

        let teams = new Array(data.length).fill({});

        let curRank = 1;
        let changed = false;
        for (let i = 0; i < data.length; i++) {
            if (i > 0 && data[i].score != data[i - 1].score){
                curRank++;
            }
            teams[data[i].ID] = {
                "rank": curRank, 
                "ID": data[i].ID, 
                "name": data[i].name, 
                "score": data[i].score, 
                "history": data[i].history, 
                "changed": (!this.teams || this.teams[data[i].ID].score != data[i].score), 
            };

            changed = changed || teams[data[i].ID].changed;
        }

        this.teams = teams;
        let res = [...teams];
        res.sort((A, B) => (A.rank > B.rank) ? 1 : ((A.rank < B.rank) ? -1 : 0));

        return res;
    }
}

export default new Team;