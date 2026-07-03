// ===== Part 1 =====

let debugMode = false;
let debugX = 0;
let debugY = 0;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const letter = document.getElementById("letter");
const timer = document.getElementById("timer");
const wrong = document.getElementById("wrong");
const missCount = document.getElementById("missCount");

const game = document.getElementById("game");
const result = document.getElementById("result");
const resultTime = document.getElementById("resultTime");
const resultMiss = document.getElementById("resultMiss");

const fingerHighlight = document.getElementById("fingerHighlight");
const handsImage = document.getElementById("handsImage");

let index = 0;
let miss = 0;
let started = false;
let startTime = 0;
let animationId = 0;

const fingerPosition = {

    Q:{x:203,y:339},
    A:{x:203,y:339},
    Z:{x:203,y:339},

    W:{x:298,y:234},
    S:{x:298,y:234},
    X:{x:298,y:234},

    E:{x:400,y:193},
    D:{x:400,y:193},
    C:{x:400,y:193},

    R:{x:514,y:236},
    F:{x:514,y:236},
    V:{x:514,y:236},

    T:{x:514,y:236},
    G:{x:514,y:236},
    B:{x:514,y:236},

    Y:{x:1003,y:236},
    H:{x:1003,y:236},
    N:{x:1003,y:236},

    U:{x:1003,y:236},
    J:{x:1003,y:236},
    M:{x:1003,y:236},

    I:{x:1118,y:192},
    K:{x:1118,y:192},

    O:{x:1220,y:234},
    L:{x:1220,y:234},

    P:{x:1313,y:341}

};

function moveFinger(ch){

    const pos = fingerPosition[ch];

    if(!pos){

        fingerHighlight.style.display = "none";
        return;

    }

    const scaleX = handsImage.clientWidth / 1536;
    const scaleY = handsImage.clientHeight / 1024;

    fingerHighlight.style.display = "block";

    fingerHighlight.style.left =
        (pos.x * scaleX) + "px";

    fingerHighlight.style.top =
        (pos.y * scaleY) + "px";

    debugX = pos.x;
    debugY = pos.y;

}

function updateTimer(){

    if(!started) return;

    const elapsed = performance.now() - startTime;

    const sec = Math.floor(elapsed / 1000);
    const ms = Math.floor(elapsed % 1000);

    timer.textContent =
        `${String(sec).padStart(2,"0")}.${String(ms).padStart(3,"0")}`;

    animationId =
        requestAnimationFrame(updateTimer);

}

function resetGame(){

    cancelAnimationFrame(animationId);

    started = false;
    index = 0;
    miss = 0;

    timer.textContent = "00.000";
    missCount.textContent = "0";
    wrong.textContent = "";

    letter.textContent = "A";

    game.hidden = false;
    result.hidden = true;

    requestAnimationFrame(() => {
        moveFinger("A");
    });

}

moveFinger("A");
// ===== Part 2 =====

document.addEventListener("keydown", (e) => {

    // ===== F1でデバッグ切替 =====
    if (e.key === "F1") {

        e.preventDefault();

        debugMode = !debugMode;

        console.clear();

        console.log(debugMode ? "DEBUG ON" : "DEBUG OFF");

        return;

    }

    // ===== デバッグモード =====
    if (debugMode) {

        const step = e.shiftKey ? 10 : 1;

        switch (e.key) {

            case "ArrowLeft":
                debugX -= step;
                break;

            case "ArrowRight":
                debugX += step;
                break;

            case "ArrowUp":
                debugY -= step;
                break;

            case "ArrowDown":
                debugY += step;
                break;

            case "c":
            case "C":

                console.clear();

                console.log(
`${letters[index]}:{x:${debugX},y:${debugY}},`
                );

                navigator.clipboard.writeText(
`${letters[index]}:{x:${debugX},y:${debugY}},`
                );

                return;

            default:
                return;

        }

        const scaleX = handsImage.clientWidth / 1536;
        const scaleY = handsImage.clientHeight / 1024;

        fingerHighlight.style.left =
            (debugX * scaleX) + "px";

        fingerHighlight.style.top =
            (debugY * scaleY) + "px";

        console.clear();

        console.log("文字 :", letters[index]);
        console.log("X :", debugX);
        console.log("Y :", debugY);

        return;

    }

    // ===== リザルト画面 =====

    if (!result.hidden) {

        if (e.key === "Enter") {

            e.preventDefault();

            resetGame();

        }

        return;

    }

    const key = e.key.toUpperCase();

    // ===== ミス =====

    if (key !== letters[index]) {

        miss++;

        missCount.textContent = miss;

        wrong.textContent = "❌";

        setTimeout(() => {

            wrong.textContent = "";

        }, 200);

        return;

    }

    // ===== タイマー開始 =====

    if (!started) {

        started = true;

        startTime = performance.now();

        updateTimer();

    }
        // ===== 次の文字へ =====

    index++;

    // ===== 全部終了 =====

    if (index >= letters.length) {

        started = false;

        cancelAnimationFrame(animationId);

        resultTime.textContent = timer.textContent + " 秒";
        resultMiss.textContent = miss + " 回";

        game.hidden = true;
        result.hidden = false;

        return;

    }

    // ===== 次の文字 =====

    letter.textContent = letters[index];

    moveFinger(letters[index]);

});
