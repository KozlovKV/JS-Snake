export default class RecordTableDB {
    constructor(url) {
        this.url = url + '?_sort=score&_order=desc';
        this.recordsArray = [];
        this.loadRecordsObject();
    }

    async loadRecordsObject(debug=false) {
        this.recordsArray = await fetch(this.url)
        .then(response => response.json());
        if (debug) { console.log(this.recordsArray); }
    }
    
    getNewId() {
        return this.recordsArray.sort((a, b) => b.id - a.id)[0].id + 1;
    }

    async addRecord(newRecordObject, debug=false) {
        newRecordObject.id = this.getNewId();
        this.recordsArray = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecordObject)
        })
        .then(response => response.json());
        if (debug) { console.log(this.recordsArray); }
    }

    getRecords(count=10) {
        this.loadRecordsObject();
        return this.recordsArray.slice(0, count);
    }
}