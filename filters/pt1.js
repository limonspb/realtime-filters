class Pt1 {
    constructor (cutoff, dt) {
        this._dt = dt;
        this._k = 0;
        this._state = 0;

        this.RecalculateK(cutoff);
    }

    RecalculateK(cutoff) {
        const RC = 1 / (2 * Math.PI * cutoff);
        this._k = this._dt / (RC + this._dt);
    }

    Apply(input) {
        this._state = this._state + this._k * (input - this._state);
        return this._state;
    }

    get state() {
        return this._state;
    }
}
