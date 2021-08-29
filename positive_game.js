var cards, card1, card2;
var places, matched;
var clickEvent;
var time0 = -1, timer, bestRecord;
var timeView, bestView;
var restartButton;
var moveEment, controlPanel;
var images = [[], []];
var timeCount = 0;
var gameCount = 0;
var gamelevel_count = 1;

var random;
var imageLength = 0;
var div;

var imageNumber = 2;
var gameCount_level = 0;
// var falseCounter = 0;

window.onload = appInit;

var level;
var gamelevel;
var tryshow;
var triesLeft;

function imageSet() {
    // images = [[], []];

    triesLeft = imageNumber * 2 - 2;

    var imageRandom = [];//比較用
    var imageNames = [];
    for (var i = 0; i < imageNumber; i++) {
        while (true) {
            random = Math.floor(Math.random() * 30) + 1;
            // console.log("random=" + random);
            // console.log("imageRandom=" + imageRandom);
            if (!(imageRandom.includes(random))) {
                imageRandom.push(random);
                break;
            }
        }
        imageNames.push(random + ".jpg");
    }
    // console.log(imageNames);


    imageLength = imageNames.length;
    for (var i = 0; i < imageLength; i++) {
        var image = new Image();
        image.src = "./positive_game/" + imageNames[i];
        var image2 = image.cloneNode(true);
        images[0].push(image);
        images[1].push(image2);
        // console.log(image);
    }

    level = document.getElementById("level");
    level.textContent = imageNumber - 1;
    // console.log(imageNumber - 1);


    // console.log(images[0].length);
    // console.log(imageLength);
    tryshow = document.getElementById("try");
    tryshow.textContent = triesLeft;
    return imageLength;
}


function appInit() {

    imageLength = imageSet();
    // console.log(imageSet(random));
    // console.log(image[0]);
    // console.log(imageNames.length);

    if (typeof document.ontouchstart == "undefined") {
        clickEvent = "mousedown";
        moveEvent = "mousemove";
    } else {
        clickEvent = "touchstart";
        moveEvent = "touchmove";
    };

    var gamePanel = document.getElementById("gamePanel");
    places = gamePanel.getElementsByTagName("div");
    matched = document.getElementsByClassName("card matched");

    timeView = document.getElementById("time");
    // bestView = document.getElementById("best");

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", replayGame);

    controlPanel = document.getElementById("controlPanel");
    var filePicker = document.getElementById("filePicker");
    var fileButton = document.getElementById("fileButton");

    // fileButton.addEventListener("click",
    //     function () { filePicker.click() },
    //     false);

    filePicker.addEventListener("change", setBackground);

    hideControlPanel();


    initCards(imageLength);
    deal();
    loadSettings();

    // imgae[0].splice(0, imageLength);
    // imgae[1].splice(0, imageLength);

}

function initCards(imageLength, LastimageLength) {

    cards = [];
    var gamePanel = document.getElementById("gamePanel");
    var imageLength2 = imageLength * 2;
    var LastimageLength2 = LastimageLength * 2;

    // console.log(imageLength);
    if (gamePanel.hasChildNodes()) {
        for (var i = 1; i <= LastimageLength2; i++) {
            var removeObj = document.getElementById("gamePanel");
            removeObj.removeChild(removeObj.childNodes.item(0));
        };
    }

    for (var i = 1; i <= imageLength2; i++) {
        div = document.createElement("div");
        gamePanel.appendChild(div);
        cards.push(Math.ceil(i / 2));
        // console.log(cards); cardsには[1,1,2,2,3,3,4,4]
    };
}


function deal() {

    card1 = null;
    card2 = null;

    var shuffled = [];

    // console.log(places.length);
    // console.log(places);
    for (var i = 0; i < places.length; i++) {

        var num = Math.floor(Math.random() * cards.length);
        // console.log("cardslength=" + cards.length);
        // console.log("num=" + num);
        var card = cards[num];
        // console.log("card=" + card);
        shuffled.push(card);

        var set1 = cards.slice(0, num);
        var set2 = cards.slice(num + 1);
        cards = set1.concat(set2);

        places[i].className = "card back";

        if (places[i].firstChild)
            places[i].removeChild(places[i].firstChild);

        places[i].addEventListener(clickEvent, openCard, false);
    };

    // console.log(shuffled);
    cards = shuffled;//[3,1,2,4,5,4,3,2,1]
    shuffled = null;

    restartButton.disabled = true;
    restartButton.textContent = "終了";
    timeView.textContent = "-";
}


function openCard(event) {

    event.preventDefault();
    if (card2 != null) return;

    var index = -1;
    var i = 0;

    Alltimer();
    // console.log("places.length=" + places.length);
    while (i < places.length) {
        if (places[i] == event.target) {
            index = i;
            break;
        }
        i++;
    };

    // console.log("index=" + index);

    event.target.className = "card face";
    var cardset = card1 == null ? 0 : 1;
    // console.log("cardset=" + cardset);
    // console.log("cards[index]-1=" + cards[index]);
    event.target.appendChild(images[cardset][cards[index] - 1]);
    event.target.removeEventListener(clickEvent, openCard);

    if (card1 == null) {
        card1 = index;
    } else {
        if (cards[index] == cards[card1]) {
            card2 = index;
            setTimeout(keepCard, 100)
            tryshow.textContent = triesLeft;
        } else {
            card2 = index;
            setTimeout(flipBack, 400);
            triesLeft = triesLeft - 1;
            tryshow.textContent = triesLeft;
        }
    }

    if (triesLeft == -1) {
        var bunki;
        bunki = confirm("終了です。再度挑戦しますか？");
        if (bunki == true) {
            // console.log("1");
            time0 = -1;
            gameCount_level = 0;
            // console.log("gamecountlevel=" + gameCount_level);
            gamelevel = document.getElementById("genzai");
            gamelevel.textContent = gameCount_level;
            replayGame();
        } else {
            timeCount = timeCount + minutesRecord;
            time0 = 0;
            // alert("time=" + Math.round(timeCount * 10) / 10 + "     count=" + gameCount);
            var displaytime;
            displaytime = Math.round(timeCount * 10) / 10;
            timeshow = document.getElementById("time2");
            timeshow.textContent = displaytime;
            var countshow;
            countshow = document.getElementById("count2");
            countshow.textContent = gameCount;
            // alert("time=" + Math.round(timeCount * 10) / 10 + "     count=" + gameCount);
            $('.googleform').attr('src', 'https://docs.google.com/forms/d/e/1FAIpQLSc8c5gK-bgnKN-0vu4zGU3OfV6_kQHgbuMoO9_cfGX2oUbS5A/viewform?usp=sf_link');
            $('.googleform').attr('height', '13145');
            // $('.googleform').attr('height', '13145');
        }
    }

    if (time0 == -1) {
        var date = new Date();
        time0 = date.getTime();
        // tick();
        // console.log("last =" + numberM);
        restartButton.disabled = false;
    }
}

function replayGame() {
    if (minutesRecord < 10000000) {
        timeCount = timeCount + minutesRecord;
    }
    if (time0 == -1) {

        images = [[], []];
        var LastimageLength = imageLength;
        imageLength = imageSet();
        // appInit();
        // cards = [];
        // console.log(imageLength);
        initCards(imageLength, LastimageLength);

        deal();
    } else {
        if (confirm("ゲームを終了します。よろしいですか。")) {
            // alert("time=" + Math.round(timeCount * 10) / 10 + "     count=" + gameCount);
            var displaytime;
            displaytime = Math.round(timeCount * 10) / 10;
            timeshow = document.getElementById("time2");
            timeshow.textContent = displaytime;
            var countshow;
            countshow = document.getElementById("count2");
            countshow.textContent = gameCount;
            // alert("time=" + Math.round(timeCount * 10) / 10 + "     count=" + gameCount);

            $('.googleform').attr('src', 'https://docs.google.com/forms/d/e/1FAIpQLSc8c5gK-bgnKN-0vu4zGU3OfV6_kQHgbuMoO9_cfGX2oUbS5A/viewform?usp=sf_link');
            $('.googleform').attr('height', '13145');

            clearTimeout(timer);
            time0 = -1;
            deal();
        }
    }
}

function Alltimer() {
    // console.log("time0 alltimer= " + time0);
    clearTimeout(timer);
    var date = new Date();
    var time = date.getTime();
    var newRecord = time - time0;
    // console.log("time=" + time, "time0=" + time0);
    minutesRecord = newRecord / 1000;
    // console.log(newRecord);
    // console.log("タイム=" + minutesRecord);

}

function flipBack() {

    var place1 = places[card1];
    var place2 = places[card2];

    place1.className = "card back";
    place2.className = "card back";

    place1.removeChild(place1.firstChild);
    place2.removeChild(place2.firstChild);

    place1.addEventListener(clickEvent, openCard, false);
    place2.addEventListener(clickEvent, openCard, false);

    card1 = null;
    card2 = null;
}


function initColor() {
    var p = document.getElementById('level');
    p.style.color = '#000000';
    p.style.fontSize = '30px';
    p.style.top = '15px';
    p.style.borderWidth = '50px';
}

function keepCard() {

    var place1 = places[card1];
    var place2 = places[card2];

    place1.className = "card matched";
    place2.className = " card matched";

    place1.removeChild(place1.firstChild);
    place2.removeChild(place2.firstChild);

    card1 = null;
    card2 = null;

    if (matched.length == places.length) {

        gameCount = gameCount + 1;

        gameCount_level = gameCount_level + 1;
        // console.log("gamecount level=" + gameCount_level);


        if (gameCount_level >= 2) {
            imageNumber = imageNumber + 1;
            gameCount_level = 0;
            gamelevel_count = gamelevel_count + 1;
            var p = document.getElementById('level');
            var colorSort;
            colorSort = gamelevel_count % 4;
            // console.log("playerlevel=" + playerlevel);
            // console.log("colorsort=" + colorSort);
            if (colorSort == 1) {
                p.style.color = '#FF0000';
                p.style.fontSize = '50px';
                p.style.top = '2px';
                p.style.borderWidth = '50px';
                setTimeout(initColor, 10000);
            } else if (colorSort == 2) {
                p.style.color = '#0000ff';
                p.style.fontSize = '50px';
                p.style.top = '2px';
                p.style.borderWidth = '50px';
                setTimeout(initColor, 10000);
            } else if (colorSort == 3) {
                p.style.color = '#ffa500';
                p.style.fontSize = '50px';
                p.style.top = '2px';
                p.style.borderWidth = '50px';
                setTimeout(initColor, 10000);
            } else {
                p.style.color = '#008000';
                p.style.fontSize = '50px';
                p.style.top = '2px';
                p.style.borderWidth = '50px';
                setTimeout(initColor, 10000);
            }
        }

        // console.log("gamecount=" + gamelevel_count);

        gamelevel = document.getElementById("genzai");
        gamelevel.textContent = gameCount_level;

        // alert("おめでとうございます!");

        time0 = -1;
        restartButton.disabled = false;
        restartButton.textContent = "リプレイ";
    }
}


function tick() {
    clearTimeout(timer);
    var date = new Date();
    var time = date.getTime();
    var { first, second, third, last } = getTimeString(time - time0);
    // timeView.textContent = getTimeString(time - time0);
    timeView.textContent = first;
    timer = setTimeout(tick, 100);
    // console.log(getTimeString(time - time0))

}


function getTimeString(value) {
    var date = new Date(value);
    var m = fixDigits(date.getUTCMinutes());
    var s = fixDigits(date.getUTCSeconds());
    var ms = fixDigits(Math.floor(date.getUTCMilliseconds() / 10));
    return {
        first: m + ":" + s + "." + ms,
        second: m,//分
        third: s,//秒
        last: ms,//ミリ秒
    };
}


function fixDigits(number) {
    string = number.toString();
    if (string.length == 1) string = "0" + string;
    return string;
}




function loadSettings() {

    var storage = localStorage;
    if (typeof storage == "undefined") return;

    // bestRecord = storage.getItem("BestRecord");
    // if (bestRecord) {
    //     bestRecord = parseInt(bestRecord);
    //     bestView.textContent = getTimeString(bestRecord);
    // }

    var image = storage.getItem("PanelImage");
    if (image) {
        gamePanel.style.backgroundImage = "url('" + image + "')";
    }
}


function saveData(name, data) {
    var storage = localStorage;
    if (typeof storage == "undefined") return;
    storage.setItem(name, data);
}


function setBackground(event) {

    var file = event.target.files[0];
    window.URL = window.URL || window.webkitURL;
    var url = window.URL.createObjectURL(file);
    gamePanel.style.backgroundImage = "url('" + url + "')";

    var canvas = document.createElement("canvas");
    var image = new Image();
    canvas.width = 400;
    canvas.height = 500;
    var context = canvas.getContext("2d");

    image.onload = function () {
        var w = image.naturalWidth;
        // console.log(w);
        var h = image.naturalHeight;
        var offset;
        if (w > h) {
            var width = w / h * canvas.height;
            offset = 0;
            if (width > canvas.width) offset = (canvas.width - width) / 2;
            context.drawImage(image, offset, 0, width, canvas.height);
        } else {
            var height = h / w * canvas.width;
            context.drawImage(image, 0, 0, canvas.width, height);
        }
        saveData("PanelImage", canvas.toDataURL());
    }
    image.src = url;
}


function hideControlPanel(event) {
    controlPanel.style.visibility = "visible";
    document.addEventListener(moveEvent, showControlPanel);
}


function showControlPanel(event) {
    var pageY;
    if (event.type == "touchmove") {
        pageY = event.touches[0].pageY;
    } else {
        pageY = event.pageY;
    }
    if (pageY < 580) return;

    controlPanel.style.visibility = "visible";
    setTimeout(hideControlPanel, 3000);
    document.removeEventListener(moveEvent, showControlPanel);
}

