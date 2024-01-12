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
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
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

// PLAYING SCORE
let upperPart = document.getElementById("top");
let score = document.getElementById("score");
let acc = document.getElementById("acc");
let combo = document.getElementById("combo");
let CMCombo = document.getElementById("CMCombo");

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
    console.log("Successfully Connected");
};

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
let tick = [];
for (var t = 0; t < 30; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}
let tempMapID, tempImg, tempMapArtist, tempMapTitle, tempMapDiff, tempMapper, tempRankedStatus;

let tempSR, tempCS, tempAR, tempOD, tempHPDr;

let gameState;
let tempScore;
let tempAcc;
let tempCombo;
let tempMaxCombo;
let interfaceID;

let temp300;
let temp100;
let temp50;
let temp0;
let tempsliderBreaks;
let tempGrade;

let tempPP;
let tempPPfc;

let tempUsername;
let tempUID;
let tempCountry;
let tempRanks;
let tempcountryRank;
let tempPlayerPP;

let tempHP;
let tempMods;
let isHidden;

let rankingPanelSet;
let apiGetSet = false;

let tempTimeCurrent;
let tempTimeFull;
let tempFirstObj;
let tempTimeMP3;
let tempStarsCurrent

let tempStrainBase;
let smoothOffset = 2;
let seek;
let fullTime;

let tempHitErrorArrayLength;
let tempBPM;
let OD = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempTotalAvg = 0;
let tempTotalWeighted = 0;
let tempBool;

let tempURIndex;
let tempSmooth;

let tempSlotLength, tempCurrentPosition;
let leaderboardSet = 0;
let leaderboardFetch;
let ourplayerSet = 0;
let ourplayerContainer;

let minimodsContainerOP, tempMinimodsOP, minimodsCountOP;

let colorSet = 0;
let colorGet = get_bg_color("#nowPlayingContainer");

let tempMapScores = [];
let playerPosition;

let currentErrorValue;

let error_h300 = 80;
let error_h100 = 140;
let error_h50 = 0;

function calculate_od(temp){
    error_h300 = 80 - (6 * temp);
    error_h100 = 140 - (8 * temp);
}

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);

    var ctxSecond = document.getElementById("canvasSecond").getContext("2d");
    window.myLineSecond = new Chart(ctxSecond, configSecond);
};

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    if (!colorSet) {
        colorSet = 1;
        setTimeout(function () {
            colorGet = get_bg_color("#nowPlayingContainer");
        }, 550);
    }

    switch (leaderboardEnable) {
        case "1":
            document.getElementById("leaderboardx").style.opacity = 1;
            break;
        case "0":
            document.getElementById("leaderboardx").style.opacity = 0;
            break;
    }

    if (data.gameplay.name && tempUsername !== data.gameplay.name) {
        tempUsername = data.gameplay.name;
        username.innerHTML = tempUsername;
        setupUser(tempUsername);
    }
    if (tempImg !== data.menu.bm.path.full) {
        tempImg = data.menu.bm.path.full;
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27");
        mapContainer.style.backgroundImage = `url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
        mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/Songs/${
            data.menu.bm.path.full
        }?a=${Math.random(10000)}')`;
        rankingPanelBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/Songs/${
            data.menu.bm.path.full
        }?a=${Math.random(10000)}')`;
        mapContainer.style.backgroundPosition = "50% 50%";
    }

    if (gameState !== data.menu.state) {
        gameState = data.menu.state;
        calculate_od(data.menu.bm.stats.OD);
        if (gameState !== 2) {
            if (gameState !== 7) deRankingPanel();
            upperPart.style.transform = "translateY(-200px)";
            smallStats.style.transform = "translateX(-400px)";
            lowerPart.style.transform = "translateX(-400px)";

            tickPos = 0;
            tempAvg = 0;
            URCont.style.transform ="translateY(200px)";
            l50.style.width = "450px";
            l50.style.transform ="translateX(0)";
            l300.style.width = "180px";
            l300.style.transform = "translateX(0)";
            l100.style.width = "315px";
            l100.style.transform = "translateX(0)";
            comboCont.style.transform = "none";
            ppCont.style.transform = "none";
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
            URCont.style.transform ="none";
        }
    }

    if (tempMapID !== data.menu.bm.id || tempSR !== data.menu.bm.stats.fullSR) {
        colorSet = 0;
        tempMapID = data.menu.bm.id;
        tempMapArtist = data.menu.bm.metadata.artist;
        tempMapTitle = data.menu.bm.metadata.title;
        tempMapDiff = "[" + data.menu.bm.metadata.difficulty + "]";
        tempMapper = data.menu.bm.metadata.mapper;
        tempRankedStatus = data.menu.bm.rankedStatus;

        tempCS = data.menu.bm.stats.CS;
        tempAR = data.menu.bm.stats.AR;
        tempOD = data.menu.bm.stats.OD;
        tempHPDr = data.menu.bm.stats.HP;
        tempSR = data.menu.bm.stats.fullSR;

        tempFirstObj = data.menu.bm.time.firstObj;

        mapName.innerHTML = tempMapArtist + " - " + tempMapTitle;

        mapInfo.innerHTML = `${tempMapDiff}`;

        stats.innerHTML =
            "CS: " +
            tempCS +
            "&emsp;" +
            "AR: " +
            tempAR +
            "&emsp;" +
            "OD: " +
            tempOD +
            "&emsp;" +
            "HP: " +
            tempHPDr +
            "&emsp;" +
            "Star Rating: " +
            tempSR +
            "*";
       }
    if (tempGrade !== data.gameplay.hits.grade.current) {
        tempGrade = data.gameplay.hits.grade.current;
    }
    if (data.gameplay.score == 0) {
    }
    tempBPM = data.menu.bm.stats.BPM.common.toFixed(0);
    BPM.innerText = data.menu.bm.stats.BPM.common.toFixed(0);

    if (tempScore !== data.gameplay.score) {
        tempTotalAvg = 0;
        tempTotalWeighted = 0;
        tempAvg = 0;
        tempScore = data.gameplay.score;
        score.innerHTML = tempScore;
        animation.score.update(score.innerHTML);
    }

    if (tempAcc !== data.gameplay.accuracy) {
        tempAcc = data.gameplay.accuracy;
        acc.innerHTML = tempAcc;
        animation.acc.update(acc.innerHTML);
    }

    if (fullTime !== data.menu.bm.time.mp3) {
        fullTime = data.menu.bm.time.mp3;
        onepart = 490 / fullTime;
    }

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
	if(fullTime !== data.menu.bm.time.mp3){
		fullTime = data.menu.bm.time.mp3;
		onepart = 1400/fullTime;
	}
    if (seek !== data.menu.bm.time.current && fullTime !== undefined && fullTime !== 0) {
        seek = data.menu.bm.time.current;
        progressChart.style.width = onepart * seek / 1.58 +'px';
    }
    if (tempMods !== data.menu.mods.str) {
        document.getElementById("modContainer").innerHTML = "";

        tempMods = data.menu.mods.str;

        if (tempMods.search("HD") !== -1) 
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

        if (OD !== data.menu.bm.stats.OD) {
            if (data.menu.mods.str.indexOf("DT") == -1 || data.menu.mods.str.indexOf("NC") == -1) {
                OD = data.menu.bm.stats.OD;
            } else {
                OD = (500 / 333) * data.menu.bm.stats.OD + -2210 / 333;
            }
            if (data.menu.mods.str.indexOf("HT") == -1) {
                OD = data.menu.bm.stats.OD;
            } else {
                OD = (500 / 667) * data.menu.bm.stats.OD + -2210 / 667;
            }
        }
        if (tempMods.search("NM") !== -1 && tempRankedStatus !== 4 || tempMods.search("NM") !== -1 && tempRankedStatus !== 7 || tempMods.search("NM") !== -1 && tempRankedStatus !== 6 || tempMods.search("SD") !== -1 && tempRankedStatus !== 4 || tempMods.search("SD") !== -1 && tempRankedStatus !== 7 || tempMods.search("SD") !== -1 && tempRankedStatus !== 6 || tempMods.search("PF") !== -1 && tempRankedStatus !== 4 || tempMods.search("PF") !== -1 && tempRankedStatus !== 7 || tempMods.search("PF") !== -1 && tempRankedStatus !== 6 || tempMods.search("FL") !== -1 && tempRankedStatus !== 4 || tempMods.search("FL") !== -1 && tempRankedStatus !== 7 || tempMods.search("FL") !== -1 && tempRankedStatus !== 6){
            sMods.innerHTML = " ";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("DT") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 4 || tempMods.search("DT") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 7 || tempMods.search("DT") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "(HD)DT(HR)";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("NC") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 4 || tempMods.search("NC") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 7 || tempMods.search("NC") !== -1 && tempMods.search("HR") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "(HD)NC(HR)";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("DT") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 4 || tempMods.search("DT") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 7 || tempMods.search("DT") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 6 || tempMods.search("NC") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 4 || tempMods.search("NC") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 7 || tempMods.search("NC") !== -1 && tempMods.search("EZ") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "EZDT/NC(HD)(FL)";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("DT") !== -1 && tempRankedStatus !== 4 || tempMods.search("DT") !== -1 && tempRankedStatus !== 7 || tempMods.search("DT") !== -1 && tempRankedStatus !== 6 || tempMods.search("NC") !== -1 && tempRankedStatus !== 4 || tempMods.search("NC") !== -1 && tempRankedStatus !== 7 || tempMods.search("NC") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "(HD)DT/NC";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("HR") !== -1 && tempRankedStatus !== 4 || tempMods.search("HR") !== -1 && tempRankedStatus !== 7 || tempMods.search("HR") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "(HD)HR";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("EZ") !== -1 && tempRankedStatus !== 4 || tempMods.search("EZ") !== -1 && tempRankedStatus !== 7 || tempMods.search("EZ") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "EZ(HD)(FL)";
            sMods.style.opacity = 1;
        }
        else if (tempMods.search("HD") !== -1 && tempRankedStatus !== 4 || tempMods.search("HD") !== -1 && tempRankedStatus !== 7 || tempMods.search("HD") !== -1 && tempRankedStatus !== 6) {
            sMods.innerHTML = "NM/HD/TD";
            sMods.style.opacity = 1;
        }
        else {
            sMods.style.opacity = 0;
        }
    }
    if (tempCombo !== data.gameplay.combo.current) {
        tempCombo = data.gameplay.combo.current;
        combo.innerHTML = tempCombo;
        animation.combo.update(combo.innerHTML);
    }
    if (tempMaxCombo !== data.gameplay.combo.max) {
        tempMaxCombo = data.gameplay.combo.max;
    }
    if (data.gameplay.combo.max <= data.gameplay.combo.current) {
        CMCombo.innerHTML = "";
        CMCombo.style.opacity = 0;
        CMCombo.style.width = "0px";
        slash.innerHTML = "";
    }
    else if (data.gameplay.hits.sliderBreaks > 0 || data.gameplay.hits[0] > 0 && data.gameplay.combo.max >= data.gameplay.combo.current) {
        CMCombo.innerHTML = tempMaxCombo;
        slash.innerHTML = " / ";
        CMCombo.style.opacity = 1;
        CMCombo.style.width = "auto";
     } else {
        CMCombo.innerHTML = "";
        CMCombo.style.opacity = 0;
        CMCombo.style.width = "0px";
        slash.innerHTML = "";
    }

    if (data.gameplay.hits.hitErrorArray !== null) {
        tempSmooth = smooth(data.gameplay.hits.hitErrorArray, 4);
        OD = data.menu.bm.stats.memoryOD;
        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.9 + tempSmooth[a] * 0.1;
            }
            fullPos = (-11 * OD + 225);
            tickPos = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / 450 * 510;
            currentErrorValue = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1];
            avgHitError.style.transform = `translateX(${(tempAvg / 450) * 450}px)`;
            comboCont.style.transform = `translateX(${OD * 11}px)`;
            ppCont.style.transform = `translateX(${OD * -11}px)`;
            l50.style.width = `${450 - (22 * OD)}px`;
            l100.style.width = `${315 - (18 * OD)}px`;
            l300.style.width = `${180 - (13.5 * OD)}px`;
            if (tempMods.search("HR") !== -1 && tempMods.search("DT") !== -1 && data.menu.bm.stats.OD >= 11 || tempMods.search("HR") !== -1 && tempMods.search("NC") !== -1 && data.menu.bm.stats.OD >= 11) {
                comboCont.style.transform = `translateX(${OD * 13}px)`;
                ppCont.style.transform = `translateX(${OD * -13}px)`;
                l50.style.width = `${450 - (27 * OD)}px`;
                l100.style.width = `${315 - (21.5 * OD)}px`;
                l300.style.width = `${180 - (16.5 * OD)}px`;
            }
            else if (tempMods.search("HR") !== -1 && OD == 10) {
                comboCont.style.transform = `translateX(${OD * 11}px)`;
                ppCont.style.transform = `translateX(${OD * -11}px)`;
                l50.style.width = `${450 - (22 * OD)}px`;
                l100.style.width = `${315 - (18 * OD)}px`;
                l300.style.width = `${180 - (13.5 * OD)}px`;
            }
            else if (tempMods.search("HR") !== -1 && data.menu.bm.stats.OD == 10) {
                comboCont.style.transform = `translateX(${OD * 13}px)`;
                ppCont.style.transform = `translateX(${OD * -13}px)`;
                l50.style.width = `${450 - (27 * OD)}px`;
                l100.style.width = `${315 - (22 * OD)}px`;
                l300.style.width = `${180 - (17 * OD)}px`;
            }
            else if (tempMods.search("HR") !== -1 && data.menu.bm.stats.OD <= 10) {
                comboCont.style.transform = `translateX(${OD * 14}px)`;
                ppCont.style.transform = `translateX(${OD * -14}px)`;
                l50.style.width = `${450 - (30 * OD)}px`;
                l100.style.width = `${315 - (24 * OD)}px`;
                l300.style.width = `${180 - (18 * OD)}px`;
            }
            else if (tempMods.search("EZ") !== -1) {
                comboCont.style.transform = `translateX(${OD * 5}px)`;
                ppCont.style.transform = `translateX(${OD * -5}px)`;
                l50.style.width = `${450 - (11 * OD)}px`;
                l100.style.width = `${315 - (8.7 * OD)}px`;
                l300.style.width = `${180 - (6.5 * OD)}px`;
            }
            for (var c = 0; c < 30; c++) {
                if ((tempHitErrorArrayLength % 30) == ((c + 1) % 30)) {
                    let tick = document.createElement("div");
                    tick.id = `tick${tempHitErrorArrayLength}`;
                    tick.setAttribute("class", "tick");
                    tick.style.opacity = 1;
                    tick.style.transform = `translateX(${tickPos}px)`;
                    document.getElementById("URbar").appendChild(tick);

                    if(currentErrorValue >= -(error_h300) && currentErrorValue <= error_h300){
                        tick.style.backgroundColor = '#6fffff';
                        tick.style.opacity = 0.4
                    }
                    else if(currentErrorValue >= -(error_h100) && currentErrorValue <= error_h100){
                        tick.style.backgroundColor = '#6fff6f';
                        tick.style.opacity = 0.4
                    }
                    else {
                        tick.style.backgroundColor = '#ffc46f';
                        tick.style.opacity = 0.4
                    }

                    function fade() {
                        tick.style.opacity = 0;
                    }
        
                    function remove() {
                        document.getElementById("URbar").removeChild(tick);
                    }
                    setTimeout(fade, 5000);
                    setTimeout(remove, 10000);
                }
            }
        }
    }
    if (tempURIndex !== data.gameplay.hits.unstableRate) {
        tempURIndex = data.gameplay.hits.unstableRate;
        URIndex.innerHTML = tempURIndex;
    }

    if (temp300 !== data.gameplay.hits[300]) {
        temp300 = data.gameplay.hits[300];
    }
    if (temp100 !== data.gameplay.hits[100]) {
        temp100 = data.gameplay.hits[100];
        h100.innerHTML = temp100;
    }
    if (temp50 !== data.gameplay.hits[50]) {
        temp50 = data.gameplay.hits[50];
        h50.innerHTML = temp50;
    }
    if (temp0 !== data.gameplay.hits[0]) {
        temp0 = data.gameplay.hits[0];
        h0.innerHTML = temp0;
    }
    if (tempsliderBreaks !== data.gameplay.hits.sliderBreaks) {
        tempsliderBreaks = data.gameplay.hits.sliderBreaks;
        hsb.innerHTML = tempsliderBreaks;
    }
    if (tempPP !== data.gameplay.pp.current) {
        tempPP = data.gameplay.pp.current;
        pp.innerHTML = tempPP;
    }
    if (tempPPfc !== data.gameplay.pp.fc) {
        tempPPfc = data.gameplay.pp.fc;
        ppFC.innerHTML = tempPPfc;
    }
    if (tempStarsCurrent !== data.menu.bm.stats.SR) {
        tempStarsCurrent = data.menu.bm.stats.SR;
        starsCurrent.innerHTML = tempStarsCurrent;
        animation.starsCurrent.update(starsCurrent.innerHTML);
    }
    if (tempTimeCurrent !== data.menu.bm.time.current) {
        if (tempTimeCurrent > data.menu.bm.time.current) {
             leaderboard.innerHTML = '';
             $("#ourplayer").remove();
             ourplayerSet = 0;
             leaderboardSet = 0;
         }
        tempTimeCurrent = data.menu.bm.time.current;
        tempTimeFull = data.menu.bm.time.full;
        tempTimeMP3 = data.menu.bm.time.mp3;
        interfaceID = data.settings.showInterface;

        if (tempTimeCurrent >= tempFirstObj + 5000 && tempTimeCurrent <= tempFirstObj + 11900 && gameState == 2) {
            recorder.style.transform = "translateX(600px)";
            if (tempTimeCurrent >= tempFirstObj + 5500) recorderName.style.transform = "translateX(600px)";
        } else {
            recorder.style.transform = "none";
            recorderName.style.transform = "none";
        }

        if (tempTimeCurrent >= tempTimeFull - 50000 && gameState === 2 && !apiGetSet) fetchData();

        if (tempTimeCurrent >= tempTimeFull + 200 && gameState === 2 || tempTimeCurrent >= tempTimeMP3 - 2000 && gameState === 2) rankingPanelBG.style.opacity = 1;

        if (rankingPanelBG.style.opacity !== 1 && gameState === 2 && tempTimeCurrent >= tempTimeFull + 700 || gameState === 7) {
            if (!rankingPanelSet) setupRankingPanel();
            if (tempGrade !== "")
                if (!isHidden) rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}.png')`;
                else if (tempGrade === "S" || tempGrade === "SS") rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}H.png')`;
                else rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}.png')`;
        } else if (!(tempTimeCurrent >= tempTimeFull - 500 && gameState === 2)) rankingPanelBG.style.opacity = 0 && deRankingPanel();

        if (gameState == 2) {
            upperPart.style.transform = "none";

            if (leaderboardTab === "1") document.getElementById("leaderboardx").style.opacity = data.gameplay.leaderboard.isVisible === true ? 0 : 1;

            setupMapScores(tempMapID, tempUsername, countryToggle);

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
                    <div id="ourplayerName" style="width: 180px;">${tempUsername}</div>
                    ${grader(
                        data.gameplay.hits["300"],
                        data.gameplay.hits["100"],
                        data.gameplay.hits["50"],
                        data.gameplay.hits["0"],
                        tempMods.search("HD")
                    )}
                    <div id="ourplayerScore" style="font-size: 15px; font-family: Torus; width: 100px;">${new Intl.NumberFormat().format(
                        Number(data.gameplay.score)
                    )}</div>
                    <div id="ourplayerCombo" style="font-size: 15px; font-family: Torus; width: 50px;">${data.gameplay.combo.max}x</div>
                    <div id="ourplayerAcc" style="font-size: 15px; font-family: Torus; width: 60px;">${data.gameplay.accuracy.toFixed(2)}%</div>
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

            if (interfaceID == 1 && gameState == 2) {
                upperPart.style.transform = "translateY(-200px)";
                bottom.style.transform = "translateY(200px)";
                URIndex.style.transform = "translateY(-200px)";
                URText.style.transform = "translateY(-200px)";
                smallStats.style.transform = "translateX(1565px)";
                lowerPart.style.transform = "translateX(1565px)";
                URCont.style.transform = "translateY(200px)";
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
    }

    if (tempMapScores.length > 0) if (tempScore >= tempMapScores[playerPosition - 2]) playerPosition--;

    if (data.gameplay.hp.smooth > 0) {
        hp.style.clipPath = `polygon(${(1 - data.gameplay.hp.smooth / 200) * 40 + 6.3}% 0%, ${(data.gameplay.hp.smooth / 200) * 40 + 53.7}% 0%, ${
            (data.gameplay.hp.smooth / 200) * 40 + 53.7
        }% 100%, ${(1 - data.gameplay.hp.smooth / 200) * 40 + 6.3}% 100%)`;
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
    //const avaImage = await getImage('4223008');
    if (data === null) {
        data = {
            user_id: "Muffinz",
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

    if (tempUID !== "Muffinz") {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${tempUID}')`;
    } else {
        ava.style.backgroundImage = "url('./static/gamer.png')";
    }

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + tempRanks;

    countryRank.innerHTML = "#" + tempcountryRank;

    playerPP.innerHTML = Math.round(tempPlayerPP) + "pp";

    const avatarColor = await postUserID(tempUID);
    if (avatarColor) {
        BarLeft.style.backgroundColor = `hsl(${avatarColor[0]})`;
        BarLeft.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[0]})`;
        BarRight.style.backgroundColor = `hsl(${avatarColor[1]})`;
        BarRight.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;

        smallStats.style.backgroundColor = `hsl(${avatarColor[0]})`;
        sMods.style.backgroundColor = `hsl(${avatarColor[0]})`;

        config.data.datasets[0].backgroundColor = `hsl(${avatarColor[0]}, 0.2)`;
        configSecond.data.datasets[0].backgroundColor = `hsl(${avatarColor[0]}, 0.7)`;
        
        document.getElementById("comboCont").style.backgroundColor = `hsl(${avatarColor[0]})`;
        document.getElementById("comboCont").style.boxShadow = `0 0 5px 2px hsl(${avatarColor[0]})`;
        // document.getElementById("comboBar").style.filter = `drop-shadow(0 0 10px hsl(${avatarColor[0]}))`;
        document.getElementById("ppCont").style.backgroundColor = `hsl(${avatarColor[1]})`;
        document.getElementById("ppCont").style.boxShadow = `0 0 5px 2px hsl(${avatarColor[1]})`;
        // document.getElementById("ppBar").style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;

        // combo.style.borderColor = `hsl(${avatarColor[0]})`;
        // combo.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[0]})`;
        // pp.style.borderColor = `hsl(${avatarColor[1]})`;
        // pp.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;
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
    let rawData = await postNhayCam_1(beatmapID);

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

            let playerAvatarLB = `<div id="lb_ava${i}" style="background-image: url('https://a.ppy.sh/${
                data[i - 1].user_id
            }')" class="leaderboardAvatar"></div>`;

            let playerNameLB = `<div id="lb_name${i}" style="width: 180px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${
                data[i - 1].username
            }</div>`;

            let playerScoreLB = `<div id="lb_score${i}" style="font-size: 15px; font-family: Torus; width: 100px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${new Intl.NumberFormat().format(
                Number(data[i - 1].score)
            )}</div>`;

            let playerComboLB = `<div id="lb_combo${i}" style="font-size: 15px; font-family: Torus; width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${
                data[i - 1].maxcombo
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

async function postNhayCam_1(beatmap_id) {
    try {
        let rawData = null;
        const data = await axios.get(`https://tryz.vercel.app/api/countryRanking/${beatmap_id}`).then((response) => {
            // rawData = response.data.data;
            rawData = response.data;
        });
        return rawData;
    } catch (error) {
        console.error(error);
    }
}

async function postUserID(id) {
    try {
        let imageData = null;
        const dataImageAsBase64 = await axios.get(`http://tryz.vercel.app/api/color/${id}`).then((response) => {
            imageData = response.data.colorData;
        });
        return imageData;
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

