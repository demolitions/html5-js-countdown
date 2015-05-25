function countdown(parentelementid) {
    this.parentid = parentelementid;
    this.size = 150;
    this.font = "Open Sans";
    this.end = "2000-01-01T00:00:00";
    this._endTime = null;
    this.deg2rad = function (degrees) {
        return (Math.PI / 180) * degrees;
    };
    this.rad2deg = function (radians) {
        return (radians * 180) / Math.PI;
    };
    this.polar2x = function (r, q) {
        return r * Math.cos(q);
    };
    this.polar2y = function (r, q) {
        return r * Math.sin(q);
    };
    this.drawGauge = function (canvas, sa, ea, cc) {
        if (canvas.getContext) {
            cw = canvas.width;
            ch = canvas.height;
            ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, cw, ch);
            cx = cw / 2;
            cy = ch / 2;
            r = Math.min(cw, ch) / 2.2;
            lw = r / 15;
            if (ea == sa) {
                ea = sa + 360;
            }
            cc = false;
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.arc(cx, cy, r, this.deg2rad(sa), this.deg2rad(sa + 360));
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.strokeStyle = "#FFFFFF";
            ctx.globalAlpha = 1;
            ctx.arc(cx, cy, r, this.deg2rad(sa), this.deg2rad(ea));
            ctx.stroke();
        }
    };
    this.textGauge = function (canvas, value, text) {
        if (canvas.getContext) {
            cw = canvas.width;
            ch = canvas.height;
            ctx = canvas.getContext('2d');
            cx = cw / 2;
            cy = ch / 2;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = (this.size / 5) + "px " + this.font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(value, cx, cy - (this.size / 10));
            ctx.font = (this.size / 10) + "px " + this.font;
            ctx.fillText(text, cx, cy + (this.size / 10));
        }
    };
    this.drawDays = function (canvas, days) {
        eq = ((360 * days) / 365) - 90;
        sq = -90;
        this.drawGauge(canvas, sq, eq, false);
        this.textGauge(canvas, days, "Days");
    };
    this.drawHours = function (canvas, hrs) {
        eq = ((360 * hrs) / 24) - 90;
        sq = -90;
        this.drawGauge(canvas, sq, eq, false);
        this.textGauge(canvas, hrs, "Hours");
    };
    this.drawMinutes = function (canvas, mins) {
        eq = ((360 * mins) / 60) - 90;
        sq = -90;
        this.drawGauge(canvas, sq, eq, false);
        this.textGauge(canvas, mins, "Minutes");
    };
    this.drawSeconds = function (canvas, sec) {
        eq = ((360 * sec) / 60) - 90;
        sq = -90;
        this.drawGauge(canvas, sq, eq, false);
        this.textGauge(canvas, sec, "Seconds");
    };
    this.calcDistance = function (dist) {
        var distance = {
            days: 0,
            hours: 0,
            mins: 0,
            secs: 0
        };
        muldays = (60 * 60 * 24);
        mulhors = (60 * 60);
        mulmins = 60;
        if (dist > 0) {
            distance.days = Math.floor(dist / muldays);
            tdays = distance.days * muldays;
            distance.hours = Math.floor((dist - tdays) / mulhors);
            thours = distance.hours * mulhors;
            distance.mins = Math.floor((dist - tdays - thours) / mulmins);
            tmins = distance.mins * mulmins;
            distance.secs = Math.floor(dist - tdays - thours - tmins);
        }
        return distance;
    };
    this.redraw = function () {
        now = new Date();
        dist = Math.floor(this._endTime - (now.getTime() / 1000));
        distance = this.calcDistance(dist);
        var cdays = document.getElementById(this.parentid + '_days');
        var chors = document.getElementById(this.parentid + '_hours');
        var cmins = document.getElementById(this.parentid + '_minutes');
        var csecs = document.getElementById(this.parentid + '_seconds');
        this.drawDays(cdays, distance.days);
        this.drawHours(chors, distance.hours);
        this.drawMinutes(cmins, distance.mins);
        this.drawSeconds(csecs, distance.secs);
    };
    this.draw = function () {
        cdstr = '<canvas id="' + this.parentid + '_days" class="countdown_canvas" width="' + this.size + '" height="' + this.size + '"></canvas>';
        cdstr += '<canvas id="' + this.parentid + '_hours" class="countdown_canvas" width="' + this.size + '" height="' + this.size + '"></canvas>';
        cdstr += '<canvas id="' + this.parentid + '_minutes" class="countdown_canvas" width="' + this.size + '" height="' + this.size + '"></canvas>';
        cdstr += '<canvas id="' + this.parentid + '_seconds" class="countdown_canvas" width="' + this.size + '" height="' + this.size + '"></canvas>';
        document.getElementById(this.parentid).innerHTML = cdstr;
        var endDate = new Date(this.end);
        this._endTime = (endDate.getTime() / 1000);
        var ts = setInterval(function (obj) {
            obj.redraw();
        }, 1000, this);
    };
}