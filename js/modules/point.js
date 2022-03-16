export default class MultidemensionPoint {
    constructor(...coordinats) {
        this.set(...coordinats);
    }

    get x() {
        return this.coordinats[0];
    }

    set x(value) {
        this.coordinats[0] = value;
    }

    get y() {
        return this.coordinats[1];
    }

    set y(value) {
        this.coordinats[1] = value;
    }

    set(...coordinats) {
        this.demensions = coordinats.length;
        this.coordinats = coordinats;
    }

    change(...coordinats) {
        if (coordinats.length == this.demensions) {
            this.coordinats = coordinats.map((coord, i) => this.coordinats[i] + coord);
        }
    }

    copy() {
        return new MultidemensionPoint(...this.coordinats);
    }

    compare(otherPoint) {
        if (this.demensions != otherPoint.demensions) { return false; }
        return otherPoint.coordinats.every((coord, i) => coord === this.coordinats[i]);
    }
}