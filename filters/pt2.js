class Pt2 {
    constructor (cutoff, dt) {
        this._dt = dt;
        this._k = 0;
        this._state = 0;
        this._state1 = 0;

        this.RecalculateK(cutoff);
    }

    RecalculateK(cutoff) {
        const order = 2.0;
        const orderCutoffCorrection = 1 / Math.sqrt(Math.pow(2, 1.0 / order) - 1);
        const RC = 1 / (2 * orderCutoffCorrection * Math.PI * cutoff);
        this._k = this._dt / (RC + this._dt);

    }

    Apply(input) {
        this._state1 = this._state1 + this._k * (input - this._state1);
        this._state = this._state + this._k * (this._state1 - this._state);
        return this._state;
    }

    get state() {
        return this._state;
    }
}
