const file = [];
let api = "",
    leaderboardEnable = "1",
    leaderboardTab = "0",
    uname = "",
    pwd = "",
    countryToggle = 0;
async function getAPI() {
    try {
        const jsonData = await $.getJSON("config.json");
        jsonData.map((num) => {
            file.push(num);
        });
        api = file[0].api;
        leaderboardEnable = file[1].leaderboardEnable;
        leaderboardTab = file[1].leaderboardTab;
        document.getElementById("recorderName").innerHTML = file[2].recorder;
        document.getElementById("resultRecorder").innerHTML = `Recorder: ${file[2].recorder}`;
        countryToggle = file[3].countryToggle;
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
}
getAPI();
// START
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/websocket/v2");
let legacysocket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let keypress = new ReconnectingWebSocket("ws://127.0.0.1:24050/websocket/v2/precise");
let mapid = document.getElementById("mapid");
let mapBG = document.getElementById("mapBG");
let rankingPanelBG = document.getElementById("rankingPanelBG");
let recorder = document.getElementById("recorder");
let recorderName = document.getElementById("recorderName");
let resultRecorder = document.getElementById("resultRecorder");

// NOW PLAYING
let mapContainer = document.getElementById("nowPlayingContainer");
let mapTitle = document.getElementById("mapTitle");
let mapDesc = document.getElementById("mapDesc");
let stars = document.getElementById("stars");
let starsCurrent = document.getElementById("starsCurrent");
let BPM = document.getElementById("BPM");
let overlay = document.getElementById("overlay");
let keys = document.getElementById('keys');
let Key1Cont = document.getElementById('Key1Cont');
let Key2Cont = document.getElementById('Key2Cont');
let Mouse1Cont = document.getElementById('Mouse1Cont');
let Mouse2Cont = document.getElementById('Mouse2Cont');
let k1 = new KeyOverlay('k1', 'k1Tiles', { speed: 0.2, keyTextId: "k1Text", keyNameId: "key1" }),
    k2 = new KeyOverlay('k2', 'k2Tiles', { speed: 0.2, keyTextId: "k2Text", keyNameId: "key2" }),
    m1 = new KeyOverlay('m1', 'm1Tiles', { speed: 0.2, keyTextId: "m1Text", keyNameId: "key3" }),
    m2 = new KeyOverlay('m2', 'm2Tiles', { speed: 0.2, keyTextId: "m2Text", keyNameId: "key4" });

// PLAYING SCORE
let upperPart = document.getElementById("top");
let score = document.getElementById("score");
let acc = document.getElementById("acc");
let combo = document.getElementById("combo");
let CMCombo = document.getElementById("CMCombo");
let combo_x = document.getElementById("combo_x");

// ACCURACY INFO
let bottom = document.getElementById("bottom");
let lowerPart = document.getElementById("lowerPart");
let accInfo = document.getElementById("accInfo");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let h0 = document.getElementById("h0");
let hsliderBreaks = document.getElementById("hsb");

// PERFORMANCE POINTS
let pp = document.getElementById("pp");
let ppFC = document.getElementById("ppFC");
let pp_textbox = document.getElementById('pp_text');

// PLAYER INFO
let username = document.getElementById("username");
let country = document.getElementById("country");
let ranks = document.getElementById("ranks");
let countryRank = document.getElementById("countryRank");
let playerPP = document.getElementById("playerPP");

let BarLeft = document.getElementById("BarLeft");
let BarRight = document.getElementById("BarRight");

// HP BAR
let hp = document.getElementById("hp");

let progressChart = document.getElementById("progress");
let strainGraph = document.getElementById("strainGraph");
let sMods = document.getElementById("sMods");

// UR

let URbar = document.getElementById("URbar");
let URtick = document.getElementById("URtick");
let avgHitError = document.getElementById("avgHitError");

let l300 = document.getElementById("l300");
let l100 = document.getElementById("l100");
let l50 = document.getElementById("l50");
let URIndex = document.getElementById("URIndex");

let leaderboard = document.getElementById("leaderboard");

// Ranking Result
let rankingPanel = document.getElementById("rankingPanel");

let mapContainerR = document.getElementById("mapContainer");
let rankedStatus = document.getElementById("rankedStatus");
let mapArtistTitle = document.getElementById("mapArtistTitle");
let mapDifficulty = document.getElementById("mapDifficulty");
let mapCreator = document.getElementById("mapCreator");

let statSection = document.getElementById("statSection");
let rCS = document.getElementById("CS");
let rAR = document.getElementById("AR");
let rOD = document.getElementById("OD");
let rHP = document.getElementById("HD");
let rSR = document.getElementById("SR");
let sBPM = document.getElementById("sBPM");

let player = document.getElementById("player");
let playerAva = document.getElementById("playerAva");
let playerCountry = document.getElementById("playerCountry");
let playerName = document.getElementById("playerName");
let playerPerformance = document.getElementById("playerPerformance");
let playerRank = document.getElementById("playerRank");
let playerCRank = document.getElementById("playerCRank");

let rankingResult = document.getElementById("rankingResult");

let result = document.getElementById("result");
let scoreResult = document.getElementById("scoreResult");
let comboResult = document.getElementById("comboResult");
let accResult = document.getElementById("accResult");
let URResult = document.getElementById("URResult");

let r300 = document.getElementById("r300");
let r100 = document.getElementById("r100");
let r50 = document.getElementById("r50");
let r0 = document.getElementById("r0");
let rsliderBreaks = document.getElementById("rsb");

let ppResult = document.getElementById("ppResult");

socket.onopen = () => {
    console.log("api v2 connected");
};
legacysocket.onopen = () => {
    console.log("some api v1 stuff connected")
}
keypress.onopen = () => {
    console.log("api v2 keypress connected");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

let animation = {
    acc: new CountUp("acc", 0, 0, 2, 0.2, {
        useEasing: true,
        useGrouping: false,
        separator: " ",
        decimal: ".",
        suffix: "%",
    }),
    score: new CountUp("score", 0, 0, 0, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
    }),
    combo: new CountUp("combo", 0, 0, 0, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "x",
    }),
    starsCurrent: new CountUp("starsCurrent", 0, 0, 2, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: " ",
    }),
    stars: new CountUp("stars", 0, 0, 2, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        prefix: "Full: ",
        suffix: "*",
    }),
}
socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};
socket.onerror = (error) => {
    console.log("Socket Error: ", error);
};
keypress.onerror = (error) => {
    console.log("Socket Error: ", error);
};
legacysocket.onerror = (error) => {
    console.log("Socket Error: ", error);
}
let tick = [];
for (var t = 0; t < 30; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}
let avatarColor1 = '102, 102, 102',
    avatarColor2 = '185, 185, 185';

let tempScore;
let tempAcc;

let tempUID;
let tempCountry;
let tempRanks;
let tempcountryRank;
let tempPlayerPP;
let tempUsername;

let tempHP;
let tempMods;
let isHidden;

let rankingPanelSet;
let apiGetSet = false;

let tempStrainBase;
let tempLink
let smoothOffset = 2;
let seek;
let fullTime;
let tempPP;
let tempPPfc;

let tempCombo;
let tempMaxCombo;

let OD = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempTotalAvg = 0;
let tempTotalWeighted = 0;
let tempBool;

let colorSet = 0;
let colorGet = get_bg_color('#nowPlayingContainer');

let tempSmooth;

let tempSlotLength, tempCurrentPosition;
let leaderboardSet = 0;
let leaderboardFetch;
let ourplayerSet = 0;
let ourplayerContainer;

let minimodsContainerOP, tempMinimodsOP, minimodsCountOP;

let tempMapScores = [];
let playerPosition;

let currentErrorValue;
let tempHitErrorArrayLength;

let error_h300 = 80;
let error_h100 = 140;
let error_h50 = 0;

let cache_beatmap = '';

function calculate_od(temp) {
    error_h300 = 80 - (6 * temp);
    error_h100 = 140 - (8 * temp);
}

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);

    var ctxSecond = document.getElementById("canvasSecond").getContext("2d");
    window.myLineSecond = new Chart(ctxSecond, configSecond);
};

keypress.onmessage = (event) => {
    let data = JSON.parse(event.data);

    if (data.keys.k1.count > 0) {
        Key1Cont.style.opacity = 1
        Key1Cont.style.transform = 'translateY(0)';
    }
    else {
        Key1Cont.style.opacity = 0
        Key1Cont.style.transform = 'translateY(-10px)';
    }
    if (data.keys.k2.count > 0) {
        Key2Cont.style.opacity = 1
        Key2Cont.style.transform = 'translateY(0)';
    }
    else {
        Key2Cont.style.opacity = 0
        Key2Cont.style.transform = 'translateY(-10px)';
    }
    if (data.keys.m1.count > 0) {
        Mouse1Cont.style.opacity = 1
        Mouse1Cont.style.transform = 'translateY(0)';
    }
    else {
        Mouse1Cont.style.opacity = 0
        Mouse1Cont.style.transform = 'translateY(-10px)';
    }
    if (data.keys.m2.count > 0) {
        Mouse2Cont.style.opacity = 1
        Mouse2Cont.style.transform = 'translateY(0)';
    }
    else {
        Mouse2Cont.style.opacity = 0
        Mouse2Cont.style.transform = 'translateY(-10px)';
    }

    k1.update(data.keys.k1, `rgb(${avatarColor1})`, `rgb(${KeyTapColor})`)
    k2.update(data.keys.k2, `rgb(${avatarColor1})`, `rgb(${KeyTapColor})`)
    m1.update(data.keys.m1, `rgb(${avatarColor1})`, `rgb(${KeyTapColor})`)
    m2.update(data.keys.m2, `rgb(${avatarColor1})`, `rgb(${KeyTapColor})`)

    if (data.hitErrors !== null) {
        tempSmooth = smooth(data.hitErrors, 4);
        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.9 + tempSmooth[a] * 0.1;
            }
            fullPos = (-11 * OD + 225);
            tickPos = data.hitErrors[tempHitErrorArrayLength - 1] / 450 * 510;
            currentErrorValue = data.hitErrors[tempHitErrorArrayLength - 1];
            avgHitError.style.transform = `translateX(${(tempAvg / 450) * 450}px)`;

            for (var c = 0; c < 30; c++) {
                if ((tempHitErrorArrayLength % 30) == ((c + 1) % 30)) {
                    let tick = document.createElement("div");
                    tick.id = `tick${tempHitErrorArrayLength}`;
                    tick.setAttribute("class", "tick");
                    tick.style.opacity = 1;
                    tick.style.transform = `translateX(${tickPos}px)`;
                    document.getElementById("URbar").appendChild(tick);


                    if (currentErrorValue >= -(error_h300) && currentErrorValue <= error_h300) {
                        tick.style.backgroundColor = 'rgba(134, 211, 255, 0.5)';
                    }
                    else if (currentErrorValue >= -(error_h100) && currentErrorValue <= error_h100) {
                        tick.style.backgroundColor = 'rgba(136, 255, 134, 0.5)';
                    }
                    else {
                        tick.style.backgroundColor = 'rgba(255, 213, 134, 0.5)';
                    }
                    function fade() {
                        tick.style.opacity = 0;
                    }

                    function remove() {
                        document.getElementById("URbar").removeChild(tick);
                    }
                    setTimeout(fade, 500);
                    setTimeout(remove, 3500);
                }
            }
        }
    }
}

legacysocket.onmessage = (event) => {
    let data = JSON.parse(event.data);

    if (tempStrainBase !== JSON.stringify(data.menu.pp.strains)) {
        tempLink = JSON.stringify(data.menu.pp.strains);
        if (data.menu.pp.strains) smoothed = smooth(data.menu.pp.strains, smoothOffset);
        config.data.datasets[0].data = smoothed;
        config.data.labels = smoothed;
        configSecond.data.datasets[0].data = smoothed;
        configSecond.data.labels = smoothed;
        if (window.myLine && window.myLineSecond) {
            window.myLine.update();
            window.myLineSecond.update();
        }
    }

}

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);

    switch (leaderboardEnable) {
        case "1":
            document.getElementById("leaderboardx").style.opacity = 1;
            break;
        case "0":
            document.getElementById("leaderboardx").style.opacity = 0;
            break;
    }

    if (data.play.playerName && tempUsername !== data.play.playerName) {
        tempUsername = data.play.playerName;
        username.innerHTML = tempUsername;
        setupUser(tempUsername);
    }
    if (data.play.score == 0) { }

    if (tempScore !== data.play.score) {
        tempTotalAvg = 0;
        tempTotalWeighted = 0;
        tempAvg = 0;
        tempScore = data.play.score;
        score.innerHTML = tempScore;
        animation.score.update(score.innerHTML);
    }

    if (tempAcc !== data.play.accuracy) {
        tempAcc = data.play.accuracy;
        acc.innerHTML = tempAcc;
        animation.acc.update(acc.innerHTML);
        accIffc(data.play.accuracy.toFixed(2), data.play.mods.number)
    }

    data.folders.beatmap = data.folders.beatmap.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27").replace(/ /g, "%20")
    mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/files/beatmap/${data.folders.beatmap}/${data.files.background}')`;
    rankingPanelBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/files/beatmap/${data.folders.beatmap}/${data.files.background}')`;
    mapContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/files/beatmap/${data.folders.beatmap}/${data.files.background}')`;
    mapContainer.style.backgroundPosition = "50% 50%";

    if (data.state.number !== 2) {
        if (data.state.number !== 7) { deRankingPanel(); }

        keys.style.opacity = 0;

        upperPart.style.transform = "translateY(-200px)";
        smallStats.style.transform = "translateX(-400px)";
        lowerPart.style.transform = "translateX(-400px)";

        tickPos = 0;
        tempAvg = 0;

        URCont.style.transform = "translateY(200px)";
        avgHitError.style.transform = "translateX(0)";

        bottom.style.transform = "translateY(300px)";
        URIndex.style.transform = "none";

        document.getElementById("leaderboardx").style.transform = "translateX(-400px)";

        URIndex.innerHTML = "";

        // setTimeout(() => {
        leaderboard.innerHTML = "";
        leaderboardFetch = false;
        leaderboardSet = 0;
        ourplayerSet = 0;
        $("#ourplayer").remove();
        // }, 1000);
    } else {
        deRankingPanel();
        upperPart.style.transform = "none";
        bottom.style.transform = "none";
        lowerPart.style.transform = "none";
        smallStats.style.transform = "none";
        URCont.style.transform = "none";
        keys.style.opacity = 1;
    }

    if (fullTime !== data.beatmap.time.mp3Length) {
        fullTime = data.beatmap.time.mp3Length;
        onepart = 490 / fullTime;
    }
	if(fullTime !== data.beatmap.time.mp3Length){
		fullTime = data.beatmap.time.mp3Length;
		onepart = 1400/fullTime;
	}
    if (seek !== data.beatmap.time.live && fullTime !== undefined && fullTime !== 0) {
        seek = data.beatmap.time.live;
        progressChart.style.width = onepart * seek / 1.57 +'px';
    }

    mapName.innerHTML = data.beatmap.artist + " - " + data.beatmap.title;

    mapInfo.innerHTML = data.beatmap.version;

    stats.innerHTML =
        "CS: " +
        data.beatmap.stats.cs.converted +
        "&emsp;" +
        "AR: " +
        data.beatmap.stats.ar.converted +
        "&emsp;" +
        "OD: " +
        data.beatmap.stats.od.converted +
        "&emsp;" +
        "HP: " +
        data.beatmap.stats.hp.converted +
        "&emsp;" +
        "Star Rating: " +
        data.beatmap.stats.stars.total +
        "*";

    if (tempMods !== data.play.mods.name) {
        document.getElementById("modContainer").innerHTML = "";

        tempMods = data.play.mods.name;

        if (tempMods.search("HD") !== -1)
            isHidden = true;
        else if (tempMods.search("FL") !== -1)
            isHidden = true;
        else
            isHidden = false;

        let modsCount = tempMods.length;

        for (var i = 0; i < modsCount; i++) {
            if (tempMods.substr(i, 2) !== "NM" || tempMods.substr(i, 2) !== "TD") {
                let mods = document.createElement("div");
                mods.id = tempMods.substr(i, 2);
                mods.setAttribute("class", "mods");
                mods.style.backgroundImage = `url('./static/mods/${tempMods.substr(i, 2)}.png')`;
                mods.style.transform = `none`;
                document.getElementById("modContainer").appendChild(mods);
            }
            i++;
        }

        if (OD !== data.beatmap.stats.od.converted) {
            if (data.play.mods.name.indexOf("DT") == -1 || data.play.mods.name.indexOf("NC") == -1) {
                OD = data.beatmap.stats.od.converted;
            } else {
                OD = (500 / 333) * data.beatmap.stats.od.converted + -2210 / 333;
            }
            if (data.play.mods.name.indexOf("HT") == -1) {
                OD = data.beatmap.stats.od.converted;
            } else {
                OD = (500 / 667) * data.beatmap.stats.od.converted + -2210 / 667;
            }
        }

        if (data.beatmap.status.number == 4 || data.beatmap.status.number == 7 || data.beatmap.status.number == 6) {
            sMods.style.opacity = 1;
            if (tempMods.search("DT") !== -1 && tempMods.search("HR") !== -1) {
                sMods.innerHTML = "(HD)DT(HR)";
            }
            else if (tempMods.search("NC") !== -1 && tempMods.search("HR") !== -1) {
                sMods.innerHTML = "(HD)NC(HR)";
            }
            else if (tempMods.search("DT") !== -1 && tempMods.search("EZ") !== -1) {
                sMods.innerHTML = "EZDT/NC(HD)(FL)";
            }
            else if (tempMods.search("DT") !== -1 || tempMods.search("NC") !== -1) {
                sMods.innerHTML = "(HD)DT/NC";
            }
            else if (tempMods.search("HR") !== -1) {
                sMods.innerHTML = "(HD)HR";
            }
            else if (tempMods.search("EZ") !== -1) {
                sMods.innerHTML = "EZ(HD)(FL)";
            }
            else if (tempMods.search("HD") !== -1) {
                sMods.innerHTML = "NM/HD/TD";
            }
            else {
                sMods.innerHTML = " ";
            }
        }
        else {
            sMods.style.opacity = 0;
        }
    }
    if (tempCombo !== data.play.combo.current) {
        tempCombo = data.play.combo.current;
        combo.innerHTML = tempCombo;
        animation.combo.update(combo.innerHTML);
    }
    if (tempMaxCombo !== data.play.combo.max) {
        tempMaxCombo = data.play.combo.max;
        CMCombo.innerHTML = " / " + data.play.combo.max + "x";
    }

    let isBreak = tempCombo < tempMaxCombo;

    if (isBreak) {
        CMCombo.style.opacity = 1;
        combo_x.style.display = "none";
    } else {
        CMCombo.style.opacity = 0;
        combo_x.style.display = "inline";
    }

    if (data.play.combo.current < 10) {
        comboCont.style.width = `${35 + (isBreak ? getMaxPxValue(data.play.combo.max) : 0)}px`;
    }
    if (data.play.combo.current >= 10 && data.play.combo.current < 100) {
        comboCont.style.width = `${50 + (isBreak ? getMaxPxValue(data.play.combo.max) : 0)}px`;
    }
    if (data.play.combo.current >= 100 && data.play.combo.current < 1000) {
        comboCont.style.width = `${65 + (isBreak ? getMaxPxValue(data.play.combo.max) : 0)}px`;
    }
    if (data.play.combo.current >= 1000 && data.play.combo.current < 10000) {
        comboCont.style.width = `${90 + (isBreak ? getMaxPxValue(data.play.combo.max) : 0)}px`;
    }
    if (data.play.combo.current >= 10000 && data.play.combo.current < 1000) {
        comboCont.style.width = `${100 + (isBreak ? getMaxPxValue(data.play.combo.max) : 0)}px`;
    }
    
    let isStarted = data.beatmap.time.live >= data.beatmap.time.firstObject

    if (isStarted) {
        pp_text = tempPP + " / " + tempPPfc + "pp";
        ppFC.style.opacity = 1;
        ppFC.style.width = 'auto';
    }
    else {
        pp_text = tempPP + " / pp";
        ppFC.style.opacity = 0;
        ppFC.style.width = '0px';
    }

    if (tempPP !== data.play.pp.current.toFixed(0)) {
        tempPP = data.play.pp.current.toFixed(0);
        pp.innerHTML = tempPP;
        ppFC.innerHTML = tempPPfc;
    }

    if (data.play.pp.current < 10) {
        pp.style.width = "15px";
    }
    if (data.play.pp.current >= 10 && data.play.pp.current < 100) {
        pp.style.width = "30px";
    }
    if (data.play.pp.current >= 100 && data.play.pp.current < 1000) {
        pp.style.width = "45px";
    }
    if (data.play.pp.current >= 1000 && data.play.pp.current < 10000) {
        pp.style.width = "70px";
    }
    if (data.play.pp.current >= 10000 && data.play.pp.current < 1000) {
        pp.style.width = "85px";
    }

    if (pp_text.length == 6) { 
        ppCont.style.width = '75px';
    }
    if (pp_text.length == 7) { 
        ppCont.style.width = '93px';
    }
    if (pp_text.length == 8) { 
        ppCont.style.width = '107px';
    }
    if (pp_text.length == 9) {
        ppCont.style.width = '125px';
    }
    if (pp_text.length == 10) {
        ppCont.style.width = '140px';
    }
    if (pp_text.length == 11) {
        ppCont.style.width = '158px';
    }
    if (pp_text.length == 12) {
        ppCont.style.width = '170px';
    }
    if (pp_text.length == 13) {
        ppCont.style.width = '183px';
    }

    function getMaxPxValue(x) {
        if (x < 10) return 35;
        if (x >= 10 && x < 100) return 60;
        if (x >= 100 && x < 1000) return 73;
        if (x >= 1000 && x < 10000) return 90;
    }

    //   function getTranslateValue(x) {
    //     if (x < 10) return 150;
    //     if (x >= 10 && x < 100) return 150;
    //     if (x >= 100 && x < 1000) return 150;
    //     if (x >= 1000 && x < 10000) return 150;
    //   }

    if (data.state.number == 2) {
        OD = data.beatmap.stats.od.original;
        calculate_od(data.beatmap.stats.od.original);
        if (tempMods.search("HR") !== -1 && data.beatmap.stats.od.converted >= 10) {
            calculate_od(10);
            comboCont.style.transform = `translateX(${10 * 11}px)`;
            ppCont.style.transform = `translateX(${10 * -11}px)`;
            l50.style.width = `${450 - (22 * 10)}px`;
            l100.style.width = `${315 - (18 * 10)}px`;
            l300.style.width = `${180 - (13.5 * 10)}px`;
        }
        else if (tempMods.search("EZ") !== -1) {
            comboCont.style.transform = `translateX(${OD * 5}px)`;
            ppCont.style.transform = `translateX(${OD * -5}px)`;
            l50.style.width = `${450 - (11 * OD)}px`;
            l100.style.width = `${315 - (8.7 * OD)}px`;
            l300.style.width = `${180 - (6.5 * OD)}px`;
        }
        else {
            comboCont.style.transform = `translateX(${OD * 11}px)`;
            ppCont.style.transform = `translateX(${OD * -11}px)`;
            l50.style.width = `${450 - (22 * OD)}px`;
            l100.style.width = `${315 - (18 * OD)}px`;
            l300.style.width = `${180 - (13.5 * OD)}px`;
        }
    }

    URIndex.innerHTML = data.play.unstableRate;
    h100.innerHTML = data.play.hits[100];
    h50.innerHTML = data.play.hits[50];
    h0.innerHTML = data.play.hits[0];
    hsb.innerHTML = data.play.hits.sliderBreaks;

    starsCurrent.innerHTML = data.beatmap.stats.stars.live;
    animation.starsCurrent.update(starsCurrent.innerHTML);
    
    if (cache_beatmap !== data.beatmap.checksum) {
        cache_beatmap == data.beatmap.checksum;

        MapReader(
            `http://127.0.0.1:24050/files/beatmap/${data.folders.beatmap}/${data.files.beatmap}`,
            data.beatmap.time.live
        );
        async function MapReader(path, currentTime) {
            const reader = await fetch(path, { cache: "no-store" });
            const text = await reader.text();
            const matchTimingPoints = text
                .match(/\[TimingPoints\](\r?)\n(-?[0-9]+,-?[0-9]+(\.[0-9]+)?,[0-9]+,[0-9]+,[0-9]+,[0-9]+,(0|1),[0-9]+(\r)?\n)*/gm)
                .shift();

            const timingPointsList = matchTimingPoints.match(/(-?[0-9]+,-?[0-9]+(\.[0-9]+)?,[0-9]+,[0-9]+,[0-9]+,[0-9]+,1,[0-9]+)/g).map((point) => {
                const params = point.split(",");
                return {
                    time: parseInt(params[0]),
                    BPM: 60000 / parseFloat(params[1]),
                };
            });

            if (tempMods.search("DT") !== -1 || tempMods.search("NC") !== -1) {
                BPM.innerText = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM * 1.5 ?? 0.0;
            }
            else if (tempMods.search("HT") !== -1) {
                BPM.innerText = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM * 0.75 ?? 0.0;
            }
            else {
                BPM.innerText = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM ?? 0.0;
            }

        }

    };

    if (data.beatmap.time.live > data.beatmap.time.live) {
        leaderboard.innerHTML = '';
        $("#ourplayer").remove();
        ourplayerSet = 0;
        leaderboardSet = 0;
    }

    if (data.beatmap.time.live >= data.beatmap.time.firstObject + 5000 && data.beatmap.time.live <= data.beatmap.time.firstObject + 11900 && data.state.number == 2) {
        recorder.style.transform = "translateX(-600px)";
        if (data.beatmap.time.live >= data.beatmap.time.firstObject + 5500) recorderName.style.transform = "translateX(-600px)";
    } else {
        recorder.style.transform = "none";
        recorderName.style.transform = "none";
    }

    if (data.beatmap.time.live >= data.beatmap.time.lastObject - 10000 && data.state.number === 2 && !apiGetSet) fetchData();

    if (data.beatmap.time.live >= data.beatmap.time.lastObject + 500 && data.state.number === 2) { rankingPanelBG.style.opacity = 1; keys.style.opacity = 0; }

    if (rankingPanelBG.style.opacity !== 1 && data.state.number === 2 && data.beatmap.time.live >= data.beatmap.time.lastObject + 1000 || data.state.number === 7) {
        if (!rankingPanelSet) setupRankingPanel();
        if (data.resultsScreen.rank !== "")
            if (!isHidden) rankingResult.style.backgroundImage = `url('./static/rankings/${data.resultsScreen.rank}.png')`;
            else if (data.resultsScreen.rank === "S" || data.resultsScreen.rank === "X") rankingResult.style.backgroundImage = `url('./static/rankings/${data.resultsScreen.rank}H.png')`;
            else rankingResult.style.backgroundImage = `url('./static/rankings/${data.resultsScreen.rank}.png')`;
    } else if (!(data.beatmap.time.live >= data.beatmap.time.lastObject - 500 && data.state.number === 2)) rankingPanelBG.style.opacity = 0 && deRankingPanel();

    if (data.state.number == 2) {
        upperPart.style.transform = "none";

        if (leaderboardTab === "1") document.getElementById("leaderboardx").style.opacity = data.settings.leaderboard.visible === true ? 0 : 1;

        setupMapScores(data.beatmap.id, data.play.playerName, countryToggle);

        if (tempSlotLength !== tempMapScores.length) {
            tempSlotLength = tempMapScores.length;
        }

        document.getElementById("leaderboardx").style.transform = "none";

        setTimeout(() => {
            if (!ourplayerSet && leaderboardEnable === "1") {
                ourplayerSet = 1;
                ourplayerContainer = document.createElement("div");
                ourplayerContainer.id = "ourplayer";
                ourplayerContainer.setAttribute("class", "ourplayerContainer");

                minimodsContainerOP = document.createElement("div");
                minimodsContainerOP.id = `minimodsContainerOurPlayer`;
                minimodsContainerOP.setAttribute("class", "minimodsContainer");

                document.getElementById("leaderboardx").appendChild(ourplayerContainer);
                document.getElementById("ourplayer").appendChild(minimodsContainerOP);

                tempMinimodsOP = tempMods;

                minimodsCountOP = tempMinimodsOP.length;

                for (var k = 0; k < minimodsCountOP; k++) {
                    let mods = document.createElement("div");
                    mods.id = tempMinimodsOP.substr(k, 2) + "OurPlayer";
                    mods.setAttribute("class", "minimods");
                    mods.style.backgroundImage = `url('./static/minimods/${tempMinimodsOP.substr(k, 2)}.png')`;
                    mods.style.transform = `translateX(${(k / 2) * 10}px)`;
                    document.getElementById(`minimodsContainerOurPlayer`).appendChild(mods);
                    k++;
                }
            }

            if (!tempUID) tempUID = "8266808";

            ourplayerContainer.innerHTML = `
                    <div id="ourplayerAva" style="background-image: url('https://a.ppy.sh/${tempUID}')" class="leaderboardAvatar"></div>
                    <div class="playerStatsContainer">
                    <div id="ourplayerName" style="width: 180px;">${data.play.playerName}</div>
                    ${grader(
                data.play.hits["300"],
                data.play.hits["100"],
                data.play.hits["50"],
                data.play.hits["0"],
                tempMods.search("HD")
            )}
                    <div id="ourplayerScore" style="font-size: 15px; font-family: Torus; width: 100px;">${new Intl.NumberFormat().format(
                Number(data.play.score)
            )}</div>
                    <div id="ourplayerCombo" style="font-size: 15px; font-family: Torus; width: 50px;">${data.play.combo.max}x</div>
                    <div id="ourplayerAcc" style="font-size: 15px; font-family: Torus; width: 60px;">${data.play.accuracy.toFixed(2)}%</div>
                    ${$("#" + minimodsContainerOP.id).prop("outerHTML")}
                    </div>
                `;
        }, 1000);

        if (document.getElementById("ourplayer"))
            if (playerPosition > 5) {
                leaderboard.style.transform = `translateY(${-(playerPosition - 6) * 75}px)`;
                document.getElementById("ourplayer").style.transform = `none`;
            } else {
                leaderboard.style.transform = "translateY(0)";
                document.getElementById("ourplayer").style.transform = `translateY(-${(6 - playerPosition) * 75}px)`;
            }

        if (tempSlotLength > 0)
            for (var i = 1; i <= tempSlotLength; i++) {
                if (i >= playerPosition && playerPosition !== 0 && document.getElementById(`slot${i}`)) {
                    document.getElementById(`slot${i}`).style.transform = `translateY(75px)`;
                }
            }

        if (data.settings.interfaceVisible == true && data.state.number == 2) {
            upperPart.style.transform = "translateY(-200px)";
        } else {
            smallStats.style.transform = "none";
            upperPart.style.transform = "none";
            lowerPart.style.transform = "none";
            bottom.style.transform = "none";
            URIndex.style.transform = "none";
            URText.style.transform = "none";
            URCont.style.transform = "none";
        }
    }

    if (tempMapScores.length > 0) if (data.play.score >= tempMapScores[playerPosition - 2]) playerPosition--;

    if (data.play.healthBar.smooth > 0) {
        hp.style.clipPath = `polygon(${(1 - data.play.healthBar.smooth / 200) * 40 + 6.3}% 0%, ${(data.play.healthBar.smooth / 200) * 40 + 53.7}% 0%, ${(data.play.healthBar.smooth / 200) * 40 + 53.7
            }% 100%, ${(1 - data.play.healthBar.smooth / 200) * 40 + 6.3}% 100%)`;
    } else {
        hp.style.clipPath = `polygon(6.3% 0, 93.7% 0, 93.7% 100%, 6.3% 100%)`;
    }
};
let config = {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                borderColor: "rgba(255, 255, 255, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                data: [],
                fill: true,
            },
        ],
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: "monotone",
            },
            point: {
                radius: 0,
            },
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    },
};

let configSecond = {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: "2",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                data: [],
                fill: true,
            },
        ],
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: "monotone",
            },
            point: {
                radius: 0,
            },
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    },
};

function brightnessCheck(element, rgb) {
    let brightness = 0.21 * rgb.r + 0.72 * rgb.g + 0.07 * rgb.b;
    if (brightness > 190) {
        element.style.color = "#161616";
        element.style.textShadow = "0 2px 3px rgba(0, 0, 0, 0.5)";
    } else {
        element.style.color = "white";
        element.style.textShadow = "0 2px 5px rgba(0, 0, 0, 0.6);";
    }
}

async function setupUser(name) {
    let data;
    if (api != "") data = await getUserDataSet(name);
    else data = null;
    // const avaImage = await getImage('12351533');
    if (data === null) {
        data = {
            user_id: "HosizoraN",
            username: `${name}`,
            pp_rank: "0",
            pp_raw: "0",
            country: "__",
            pp_country_rank: "0",
        };
    }
    tempUID = data.user_id;

    tempCountry = `${data.country
        .split("")
        .map((char) => 127397 + char.charCodeAt())[0]
        .toString(16)}-${data.country
            .split("")
            .map((char) => 127397 + char.charCodeAt())[1]
            .toString(16)}`;
    tempRanks = data.pp_rank;
    tempcountryRank = data.pp_country_rank;
    tempPlayerPP = data.pp_raw;
    if (tempUID !== "HosizoraN") {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${tempUID}')`;
    } else {
        ava.style.backgroundImage = "url('./static/gamer.png')";
    }

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + tempRanks;

    countryRank.innerHTML = "#" + tempcountryRank;

    playerPP.innerHTML = Math.round(tempPlayerPP) + "pp";

    let avatarColor = await postUserID(tempUID);
    if (avatarColor) {
        avatarColor1 = `${avatarColor.rgb1[0]}, ${avatarColor.rgb1[1]}, ${avatarColor.rgb1[2]}`,
        avatarColor2 = `${avatarColor.rgb2[0]}, ${avatarColor.rgb2[1]}, ${avatarColor.rgb2[2]}`;
        KeyTapColor = `${avatarColor.rgb1[0] + 80}, ${avatarColor.rgb1[1] + 80}, ${avatarColor.rgb1[2] + 80}`

        BarLeft.style.backgroundColor = `rgb(${avatarColor1})`;
        BarLeft.style.boxShadow = `0 0 10px 3px rgb(${avatarColor1})`;
        BarRight.style.backgroundColor = `rgb(${avatarColor2})`;
        BarRight.style.boxShadow = `0 0 10px 3px rgb(${avatarColor2})`;

        smallStats.style.backgroundColor = `rgb(${avatarColor1})`;
        sMods.style.backgroundColor = `rgb(${avatarColor1})`;

        config.data.datasets[0].backgroundColor = `rgb(${avatarColor1}, 0.2)`;
        configSecond.data.datasets[0].backgroundColor = `rgb(${avatarColor1}, 0.7)`;

        comboCont.style.backgroundColor = `rgb(${avatarColor1})`;
        comboCont.style.boxShadow = `0 0 5px 2px rgb(${avatarColor1})`;
        ppCont.style.backgroundColor = `rgb(${avatarColor2})`;
        ppCont.style.boxShadow = `0 0 5px 2px rgb(${avatarColor2})`;

    }
}

async function fetchWebBancho(md5, beatmapId) {
    try {
        const data = (
            await axios.get("/osu-osz2-getscores.php", {
                baseURL: "https://osu.ppy.sh/web",
                headers: {
                    "User-Agent": "osu!",
                    Host: "osu.ppy.sh",
                    "Accept-Encoding": "gzip, deflate",
                },
                params: {
                    s: 0,
                    vv: 4,
                    v: 4,
                    c: md5,
                    m: 0,
                    i: beatmapId,
                    mods: 0,
                    us: uname,
                    ha: pwd,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
}

async function getMapScores2(beatmapID) {
    let rawData = await postDNTT(beatmapID);

    let obj = [];

    // If request is good...
    let res = rawData.split("\n").slice(5);
    res.splice(-1);

    res.forEach((e) => {
        let arr = e.split("|");
        obj.push({
            score_id: arr[0],
            score: arr[2],
            username: arr[1],
            count300: arr[6],
            count100: arr[5],
            count50: arr[4],
            countsliderBreaks: arr[13],
            countmiss: arr[7],
            maxcombo: arr[3],
            countkatu: arr[8],
            countgeki: arr[9],
            perfect: arr[10],
            enabled_mods: arr[11],
            user_id: arr[12],
        });
    });
    console.log(obj);
    return obj;
}

async function setupMapScores(beatmapID, name, countryToggle) {
    if (leaderboardFetch === false) {
        leaderboardFetch = true;

        let data;

        if (countryToggle) data = await getMapScores2(beatmapID);
        else data = await getMapScores(beatmapID);

        if (data) {
            tempSlotLength = data.length;
            playerPosition = data.length + 1;
        } else {
            tempSlotLength = 0;
            playerPosition = 1;
        }

        for (var i = tempSlotLength; i > 0; i--) {
            tempMapScores[i - 1] = parseInt(data[i - 1].score);

            let tempModsLB = (parseInt(data[i - 1].enabled_mods) >>> 0).toString(2).padStart(15, "0");
            let tempModsLiteral = "";

            if (tempModsLB !== "000000000000000")
                for (var j = 14; j >= 0; j--) {
                    if (tempModsLB[j] === "1") {
                        switch (j) {
                            case 0:
                                tempModsLiteral += "PF";
                                break;
                            case 1:
                                tempModsLiteral += "AP";
                                break;
                            case 2:
                                tempModsLiteral += "SO";
                                break;
                            case 3:
                                tempModsLiteral += "AT";
                                break;
                            case 4:
                                tempModsLiteral += "FL";
                                break;
                            case 5:
                                tempModsLiteral += "NC";
                                break;
                            case 6:
                                tempModsLiteral += "HT";
                                break;
                            case 7:
                                tempModsLiteral += "RX";
                                break;
                            case 8:
                                tempModsLiteral += "DT";
                                break;
                            case 9:
                                tempModsLiteral += "SD";
                                break;
                            case 10:
                                tempModsLiteral += "HR";
                                break;
                            case 11:
                                tempModsLiteral += "HD";
                                break;
                            case 12:
                                tempModsLiteral += "TD";
                                break;
                            case 13:
                                tempModsLiteral += "EZ";
                                break;
                            case 14:
                                tempModsLiteral += "NF";
                                break;
                        }
                    }
                }
            else tempModsLiteral = "NM";
            // console.log(tempModsLB)
            // console.log(tempModsLiteral);

            let playerContainer = document.createElement("div");
            playerContainer.id = `slot${i}`;
            playerContainer.setAttribute("class", "playerContainer");
            playerContainer.style.top = `${(i - 1) * 75}px`;

            let playerAvatarLB = `<div id="lb_ava${i}" style="background-image: url('https://a.ppy.sh/${data[i - 1].user_id
                }')" class="leaderboardAvatar"></div>`;

            let playerNameLB = `<div id="lb_name${i}" style="width: 180px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${data[i - 1].username
                }</div>`;

            let playerScoreLB = `<div id="lb_score${i}" style="font-size: 15px; font-family: Torus; width: 100px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${new Intl.NumberFormat().format(
                Number(data[i - 1].score)
            )}</div>`;

            let playerComboLB = `<div id="lb_combo${i}" style="font-size: 15px; font-family: Torus; width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${data[i - 1].maxcombo
                }x</div>`;

            let raw_playerAcc = accuracyCalc(
                parseInt(data[i - 1].count300),
                parseInt(data[i - 1].count100),
                parseInt(data[i - 1].count50),
                parseInt(data[i - 1].countmiss)
            );
            // console.log(raw_playerAcc);
            let playerAccLB = `<div id="lb_acc${i}" style="font-size: 15px; font-family: Torus; width: 60px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${raw_playerAcc}%</div>`;

            let playerGradeLB;
            let lb_grade = grader_text(
                parseInt(data[i - 1].count300),
                parseInt(data[i - 1].count100),
                parseInt(data[i - 1].count50),
                parseInt(data[i - 1].countmiss),
                tempModsLiteral.includes("HD") || tempModsLiteral.includes("FL")
            );

            switch (lb_grade) {
                case "XH":
                    playerGradeLB = `<div id=grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">X</div>`;
                    break;
                case "X":
                    playerGradeLB = `<div id="grade${i}" style="width: 50px; color: #de3950; filter: drop-shadow(0 0 5px #de3950)">X</div>`;
                    break;
                case "S":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #f2d646; filter: drop-shadow(0 0 5px #f2d646)">S</div>`;
                    break;
                case "SH":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">S</div>`;
                    break;
                case "A":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #46f26e; filter: drop-shadow(0 0 5px #46f26e)">A</div>`;
                    break;
                case "B":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #469cf2; filter: drop-shadow(0 0 5px #469cf2)">B</div>`;
                    break;
                case "C":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #9f46f2; filter: drop-shadow(0 0 5px #9f46f2)">C</div>`;
                    break;
                case "D":
                    playerGradeLB = `<div id="grade${i}"  style="width: 50px; color: #ff0000; filter: drop-shadow(0 0 5px #ff0000)">D</div>`;
                    break;
            }

            // playerContainer.appendChild(playerNameLB);
            // playerContainer.appendChild(playerGradeLB);
            // playerContainer.appendChild(playerScoreLB);
            // playerContainer.appendChild(playerComboLB);
            // playerContainer.appendChild(playerAccLB);

            playerContainer.innerHTML = `${playerAvatarLB}
            <div class="playerStatsContainer">${playerNameLB}
            ${playerGradeLB}
            ${playerScoreLB}
            ${playerComboLB}
            ${playerAccLB}<div>
        `;

            let minimodsContainer = document.createElement("div");
            minimodsContainer.id = `minimodsContainerSlot${i}`;
            minimodsContainer.setAttribute("class", "minimodsContainer");
            playerContainer.appendChild(minimodsContainer);
            document.getElementById("leaderboard").appendChild(playerContainer);

            // let tempMinimods = data.gameplay.leaderboard.slots[i - 1].mods;

            let minimodsCount = tempModsLiteral.length;

            for (var k = 0; k < minimodsCount; k++) {
                let mods = document.createElement("div");
                mods.id = tempModsLiteral.substr(k, 2) + i;
                mods.setAttribute("class", "minimods");
                mods.style.backgroundImage = `url('./static/minimods/${tempModsLiteral.substr(k, 2)}.png')`;
                mods.style.transform = `translateX(${(k / 2) * 10}px)`;
                document.getElementById(`minimodsContainerSlot${i}`).appendChild(mods);
                k++;
            }
        }
    }
}

async function getUserDataSet(name) {
    try {
        const data = (
            await axios.get("/get_user", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    u: name,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
}

async function getMapScores(beatmapID) {
    try {
        const data = (
            await axios.get("/get_scores", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    b: beatmapID,
                },
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    }
}
async function accIffc(acc, mods) {
    try {
        let accIffc = null
        const data = await axios.get(`http://127.0.0.1:24050/api/calculate/pp?acc=${acc}&mods=${mods}`).then((response) => {
            accIffc = response.data
        });
        tempPPfc = accIffc.performance.pp.toFixed(0)
        } catch (error) {
            console.error(error);
        }
}
async function postDNTT(beatmap_id) {
    try {
        const data = await axios.get(`https://phubahosi.vercel.app/api/beatmap/${beatmap_id}/global`);
        return JSON.parse(data[0]);
    } catch (error) {
        console.error(error);
    }
}

async function postUserID(id) {
    try {
        let rawData = null;
        const data = await axios.get(`https://phubahosi.vercel.app/api/color/${id}`).then((response) => {
            rawData = response.data
        });
        return rawData;
    } catch (error) {
        console.error(error);
    }
}

accuracyCalc = (h300, h100, h50, h0) => {
    let accuracy = ((h300 + h100 / 3 + h50 / 6) / (h300 + h100 + h50 + h0)) * 100;
    return accuracy.toFixed(2);
};

grader = (h300, h100, h50, h0, isHD) => {
    // console.log(isHD);
    let acc = accuracyCalc(h300, h100, h50, h0);
    let maxCombo = h300 + h100 + h50 + h0;
    switch (true) {
        case acc == 100 || maxCombo === 0:
            if (isHD === -1) {
                return `<div id="gradeOurplayer" style="width: 50px; color: #de3950; filter: drop-shadow(0 0 5px #de3950)">X</div>`;
                break;
            }
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">X</div>`;
            break;
        case acc > 90 && h50 / maxCombo < 0.01 && h0 === 0:
            if (isHD === -1) {
                return `<div id="gradeOurplayer"  style="width: 50px; color: #f2d646; filter: drop-shadow(0 0 5px #f2d646)">S</div>`;
                break;
            }
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">S</div>`;
            break;
        case (acc > 80 && acc <= 90 && h0 === 0) || h300 / maxCombo > 0.9:
            return `<div id="gradeOurplayer"  style="width: 50px; color: #46f26e; filter: drop-shadow(0 0 5px #46f26e)">A</div>`;
            break;
        case (acc > 70 && acc <= 80 && h0 === 0) || h300 / maxCombo > 0.8:
            return `<div id="gradeOurplayer"  style="width: 50px; color: #469cf2; filter: drop-shadow(0 0 5px #469cf2)">B</div>`;
            break;
        case h300 / maxCombo > 0.6 && h300 / maxCombo <= 0.8:
            return `<div id="gradeOurplayer"  style="width: 50px; color: #9f46f2; filter: drop-shadow(0 0 5px #9f46f2)">C</div>`;
            break;
        case h300 / maxCombo <= 0.6:
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ff0000; filter: drop-shadow(0 0 5px #ff0000)">D</div>`;
            break;
    }
};

grader_text = (h300, h100, h50, h0, isHD) => {
    // console.log(isHD);
    let acc = accuracyCalc(h300, h100, h50, h0);
    let maxCombo = h300 + h100 + h50 + h0;
    switch (true) {
        case acc == 100 || maxCombo === 0:
            if (isHD === -1) {
                return `X`;
                break;
            }
            return `XH`;
            break;
        case acc > 90 && h50 / maxCombo < 0.01 && h0 === 0:
            if (isHD === -1) {
                return `S`;
                break;
            }
            return `SH`;
            break;
        case (acc > 80 && acc <= 90 && h0 === 0) || h300 / maxCombo > 0.9:
            return `A`;
            break;
        case (acc > 70 && acc <= 80 && h0 === 0) || h300 / maxCombo > 0.8:
            return `B`;
            break;
        case h300 / maxCombo > 0.6 && h300 / maxCombo <= 0.8:
            return `C`;
            break;
        case h300 / maxCombo <= 0.6:
            return `D`;
            break;
    }
};

setLeaderboardTrue = () => {
    leaderboardFetch = true;
};

async function getUserTop(name) {
    try {
        const data = (
            await axios.get("/get_user_best", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    u: name,
                    limit: 5,
                },
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    }
}

async function getMapDataSet(beatmapID) {
    try {
        const data = (
            await axios.get("/get_beatmaps", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    b: beatmapID,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
}

