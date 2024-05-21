import MetronomeTimer from './MetronomeTimer.js';

let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let TheMainValue = localStorage.getItem("TheMainValue")

var DownOrUp = "D"
var countArrOfPattern = 0
let sound, CurrentChord;
var ChordRun = false;
let video;
let bpm = 70;
let metronomeSound = true;
let StrummingPatternArr;

let RunMetronomeOneTime = 2;
let RunMetronomeOneTimeForShuffle = 3;
let RunMetronomeOneTimeFor16ths = 4;

let MetronomeDefaultby8 = 1;
let MetronomeShuffletby8 = 3;
let Metronome16thsby8 = 2;


let RunMetronomeAfterTimes = 2;
let BarcountClass = 1;
let Barcount = 0;
let bar;
let UpperPattern
let StoreSound, StoreVideoCache;

let HandUp, HandDown;
let ModeArr = [], CutArr = [], BeatArr = []

let BeatIncreaseNumber = 0

// console.log(MetronomeClickArr);


const UpdateBpmRealTime = document.querySelector('#UpdateBpmRealTime');
let RestartVideoBtn = document.querySelector('#RestartVideo');
let PlayPauseVideoBtn = document.querySelector('#PlayPauseVideo');
let InstantPlaySection = document.querySelector('#InstantPlaySection');
// let PlayVideo = document.querySelector('#PlayVideo');



function ShowPagintion(){
    var style = document.createElement('style');
    
    // Add CSS rule to hide scrollbar thumb
    // style.innerHTML = "#DisplayPatternData::-webkit-scrollbar { width: 0px; }";
    
    // Append the style element to the document head
    document.head.appendChild(style);
    let PaginationBtns = document.getElementById("PaginationBtns");
    PaginationBtns.style.display = "none";
    let DisplayPatternData = document.getElementById("DisplayPatternData")
    let content = ""
    let BarEndTo = BarStartFrom + 10

    let NewAppendHtmlArr = BarHTMLContentArr;
    // console.log(NewAppendHtmlArr,'NewAppendHtmlArr');
    if(NewAppendHtmlArr.length ==0 || BarStartFrom<0){
        return
    }

    NewAppendHtmlArr.map(function (val, index) {
        content+=val
    })
    // console.log(content,'content');
    DisplayPatternData.innerHTML = content

    AutoShowPattern()

    if (showSections) {
        ShowSectionNameOnBar()
    }

    if(AdvancedMode){
        InstensitySetOnDOM()
    }
}

function StartVideo() {
    ShowPagintion();
    HandDown = document.getElementById(`HandDown-${VideoType}-default${RandomRightHandVideo}.gif`)
    HandUp = document.getElementById(`HandUp-${VideoType}-default${RandomRightHandVideo}.gif`)

    let SpecificPattern = localStorage.getItem("SpecificPattern");
    if (SpecificPattern) {
        SpecificPattern = JSON.parse(SpecificPattern);
        SpecificPattern = Object.values(SpecificPattern);
        StrummingPatternArr = SpecificPattern
    } else {
        StrummingPatternArr = localStorage.getItem("StrummingPatternArr");
        StrummingPatternArr = JSON.parse(StrummingPatternArr);
        StrummingPatternArr = Object.values(StrummingPatternArr);
    }

    let SpecificPatternIndex = localStorage.getItem("SpecificPatternIndex");
    if (SpecificPatternIndex) {
        SpecificPatternIndex = JSON.parse(SpecificPatternIndex);
        SpecificPatternIndex = Object.values(SpecificPatternIndex);
    }

    if (SpecificPatternIndex) {
        BarcountClass = SpecificPatternIndex[0] + 1

    }

    beatsPerMeasure = document.getElementById("TimeSignatureTopValue").value;
    if (!beatsPerMeasure || beatsPerMeasure <= 0) {
        beatsPerMeasure = 4;
        document.getElementById("TimeSignatureTopValue").value = 4;
    }


    TheMainValue = localStorage.getItem("TheMainValue")

    bpm = document.getElementById("BpmValue").value;
    if (!bpm || bpm <= 0) {
        bpm = 70
        document.getElementById("BpmValue").value = 70
    }
    bpm = parseInt(bpm)

    if (document.getElementById("TimeSignatureBottomValue").value == 4) {

        switch (MetronomeSpeedArr[0]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 3);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    } else {
        switch (MetronomeSpeedArr[0]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 6);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    }

    let isMetronomeChecked = document.getElementById("metronomeSound").checked;
    if (isMetronomeChecked) {
        metronomeSound = true;
    } else {
        metronomeSound = false;
    }
    count = 0;

    ModeArr = localStorage.getItem("ModeArr");

    ModeArr = JSON.parse(ModeArr);
    ModeArr = Object.values(ModeArr);

    BeatArr = localStorage.getItem("BeatArr");

    BeatArr = JSON.parse(BeatArr);
    BeatArr = Object.values(BeatArr);

    CutArr = []
    ModeArr.map(function (val, index) {
        switch (val) {
            case "Default":
                CutArr.push(TheMainValue)
                break;
            case "Shuffle":
                if (document.getElementById("TimeSignatureBottomValue").value == 4) {

                    CutArr.push((TheMainValue / 2) * 3)
                } else {
                    CutArr.push(TheMainValue * 3)

                }
                break;
            case "16ths":
                CutArr.push(TheMainValue * 2)
                break;

            default:
                break;
        }
    })
    CutArr = NumberOfBeatArr
    // console.log(MetronomeClickArr);
    if(PreviewAudioPlay){
        PreviewAudioMetronome.start(); 
    }else{
        Metronome.start();
    }

    console.log(PreviewAudioPlay);
    localStorage.setItem("Metronome", "Start")
}

function PlayVideo() {
    if (!localStorage.getItem("Metronome")) {

        if(PreviewAudioPlay){
            PreviewAudioMetronome.start();
        }else{
            Metronome.start();
        }
        localStorage.setItem("Metronome", "Start")
    }
    // PlayVideo.style.display = "none"
    // PauseVideo.style.display = "inline-block"
}

function PauseVideo() {
    if(PreviewAudioPlay){
        PreviewAudioMetronome.stop();
    }else{
        Metronome.stop();
    }
    localStorage.removeItem("Metronome")
    try {
        // let up = document.getElementById(`${CurrentChord}-default-up.wav`).pause()
        // let down = document.getElementById(`${CurrentChord}-default-down.wav`).pause()
        // up.currentTime = 0;
        // down.currentTime = 0;

        StopSounding(CurrentChord)

    } catch (error) {

    }
}

function RestartVideo() {

    try {
        document.getElementById(`${CurrentChord}.png`).style.display = "none"
    } catch (error) {
        console.log(error);
    }

    beatsPerMeasure = 4;
    count = 0;
    isRunning = false;

    DownOrUp = "D"
    // countArrOfPattern = 0
    sound = "", CurrentChord = "";
    ChordRun = false;
    video = "";
    bpm = 70;
    metronomeSound = true;
    StrummingPatternArr = "";
    RunMetronomeOneTime = 2;
    // RunMetronomeAfterTimes = 2;

    BarcountClass = 1;
    Barcount = 0;
    BeatIncreaseNumber = 0
    try {
        bar.classList.toggle("HightLightBars")
        bar.classList.toggle("animatedBars")
        UpperPattern.classList.toggle("ProgressInBars")
        UpperPattern.classList.toggle("animatedPatternDisplay")
    } catch (error) {

    }


    bar = "";
    UpperPattern = ""

    PauseVideo()
    StartVideo()
}



let play = false

PlayPauseVideoBtn.addEventListener('click', () => {
    if (play) {
        PlayVideo()
        play = false
        PlayPauseVideoBtn.innerHTML = "Pause"

    } else {
        PauseVideo()
        play = true
        PlayPauseVideoBtn.innerHTML = "Play"
    }
})

function smoothScroll() {
    DisplayPatternData.style.scrollBehavior = "revert";
    setTimeout(() => {
        DisplayPatternData.style.scrollBehavior = "smooth";
    }, 500)
}

RestartVideoBtn.addEventListener('click', () => {
    let DisplayPatternData = document.getElementById("DisplayPatternData")
    function isScrollAtStart() {
        return DisplayPatternData.scrollLeft === 0;
    }
    // Add scroll event listener
    DisplayPatternData.addEventListener('scroll', function() {
        if (isScrollAtStart()) {
            BarcountClass = 1
        }
    });
    smoothScroll();
    countArrOfPattern = 0
    RestartVideo()
    play = false
    PlayPauseVideoBtn.innerHTML = "Pause"
})

UpdateBpmRealTime.addEventListener('click', () => {

    bpm = document.getElementById("BpmValue").value;
    if (!bpm || bpm <= 0) {
        bpm = 70
        document.getElementById("BpmValue").value = 70
    }
    bpm = parseInt(bpm)
    localStorage.setItem("BPM", bpm)
    // changeMetronomeInterval(bpm, RunMetronomeAfterTimes);
    // changeMetronomeInterval(bpm, RunMetronomeAfterTimes);
    document.getElementById("UpdateBPMBtn").style.display = "none";
})

InstantPlaySection.addEventListener("click", () => {
    PauseVideo()
    play = false
    PlayPauseVideoBtn.innerHTML = "Pause"

    BarcountClass = InstantStartFrom[1]
    Barcount = InstantStartFrom[0] + 1
    countArrOfPattern = InstantStartFrom[0]
    if (BarcountClass == 0) {
        BarcountClass = 1
        Barcount = 0
    }

    // countArrOfPattern = InstantStartFrom[0]
    BeatIncreaseNumber = InstantStartFrom[0]

    try {
        bar.classList.remove("HightLightBars");
        bar.classList.remove("animatedBars");
        UpperPattern.classList.remove("ProgressInBars")
        UpperPattern.classList.remove("animatedPatternDisplay")
    } catch (error) {
    }
    bar = "";
    UpperPattern = ""
    StartVideo()
})

function changeMetronomeInterval(bpm, speed) {

    let SetUpSpeed;
    switch (speed) {
        case 4:
            SetUpSpeed = 4
            break;
        case 2:
            SetUpSpeed = 2
            break;
        case 1:
            SetUpSpeed = 3
            break;
        case 3:
            SetUpSpeed = 3
            break;
        case 5:
            SetUpSpeed = 5
            break;
        case 6:
            SetUpSpeed = 6
            break;

        default:
            SetUpSpeed = 2
            break;
    }

    if(PreviewAudioPlay){
        PreviewAudioMetronome.timeInterval = 60000 / (bpm * SetUpSpeed)
    }else{
        Metronome.timeInterval = 60000 / (bpm * SetUpSpeed)
    }
}

function CheckMetronomeOn() {
    let isMetronomeChecked = document.getElementById("metronomeSound").checked;
    if (isMetronomeChecked) {
        metronomeSound = true;
    } else {
        metronomeSound = false;
    }
}

function PlayCHordsVideo(chord) {
    let videoLeftHandChrod = document.getElementById(`${chord}-${VideoType}.mp4`);

    try {
        console.log(`Runs`);
        StoreVideoCache.style.display = "none"
    } catch (error) {

    }
    videoLeftHandChrod.style.display = "inline-block"
    StoreVideoCache = videoLeftHandChrod
    // videoLeftHandChrod.load()

    videoLeftHandChrod.play().then(_ => {
    })
        .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            console.log(error);
        });
    videoLeftHandChrod.currentTime = 0;
}


function ChordVideo() {
    var videoLeftHandChrod;


    if (ChordRun) {

        videoLeftHandChrod = document.getElementById(`${CurrentChord}-${VideoType}.mp4`);
        try {
            console.log(`Runs`);
            StoreVideoCache.style.display = "none"
        } catch (error) {

        }
        videoLeftHandChrod.style.display = "inline-block"
        StoreVideoCache = videoLeftHandChrod
        // videoLeftHandChrod.load()
        videoLeftHandChrod.play().then(_ => {
        })
            .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
                console.log(error);
            });
        videoLeftHandChrod.currentTime = 0;
        ChordRun = false;
    }

}


function SetUpAudio(number, audioDuration) {

    let callEle = StrummingPatternArr[number]
    if (!callEle) {
        console.log(`It's end`);
        countArrOfPattern = 0
        BeatIncreaseNumber = 0
        bar.classList.toggle("HightLightBars")
        bar.classList.toggle("animatedBars")
        UpperPattern.classList.toggle("ProgressInBars")
        UpperPattern.classList.toggle("animatedPatternDisplay")
        BarcountClass = 1;
        Barcount = 0;
        return SetUpAudio(0)
    } else {
        StrummingPattern(callEle[0], callEle[1], number, audioDuration)
    }

    if (Barcount < CutArr[BarcountClass - 1]) {

        Barcount++;
    } else {
        document.getElementsByClassName("bars")[BarcountClass].scrollIntoViewIfNeeded()
        try {

            bar.classList.toggle("HightLightBars")
            bar.classList.toggle("animatedBars")
        } catch (error) {

        }
        bar = document.getElementsByClassName("bars")[BarcountClass]
        bar.classList.toggle("HightLightBars")
        bar.classList.toggle("animatedBars")
        BarcountClass++
        Barcount = 1
    }

    if (number == 0) {
        smoothScroll();
        document.getElementsByClassName("bars")[0].scrollIntoViewIfNeeded()
        bar = document.getElementsByClassName("bars")[0]
        bar.classList.toggle("HightLightBars")
        bar.classList.toggle("animatedBars")

        UpperPattern = document.querySelectorAll(".Upper-Pattern")[0]
        UpperPattern.classList.toggle("ProgressInBars")
        UpperPattern.classList.toggle("animatedPatternDisplay")
    } else {
        try {

            UpperPattern.classList.toggle("ProgressInBars")
            UpperPattern.classList.toggle("animatedPatternDisplay")
        } catch (error) {

        }

        UpperPattern = document.querySelectorAll(".Upper-Pattern")[number]
        UpperPattern.classList.toggle("ProgressInBars")
        UpperPattern.classList.toggle("animatedPatternDisplay")
    }



}
let isNCMuted = false
let StoreStroke = ""

function StrummingPattern(pattern, chord, number, audioDuration) {
    console.log(chord,'chord 11111', number, pattern);
    if (pattern == "No") {
        pattern = "E"
    }

    const totalDuration = audioDuration; // Total audio duration in seconds
    const boxWidth = 500; // Width of the box in pixels

    // Calculate the position of the progress line
 
    // if (number >= 0) {
    //     const progressPosition = (number / totalDuration) * boxWidth;
    //     console.log(number === 0,'totalDuration === number');
    //     // Update the progress line's position
    //     const element = document.getElementsByClassName("lineProgress")[0];
    //     element.style.transition = 'transform 0.5s linear';
    //     element.style.transform = `translateX(${progressPosition}px)`;
    //     // alert(number)
    //     // const elemet = document.getElementsByClassName("lineProgress")[0];
    //     // console.log(elemet,'elemet');
    //     // elemet.style.transition = 'transform 0.5s linear'
    //     // elemet.style.transform = `translateX(${number * 5}px)`
    // }
    DownOrUp = pattern

    

    try {
        if (number == 0) {
            if(!PreviewAudioPlay){
        
                PlayCHordsVideo(chord)
            }
        } else {

            let APreviousPattern = StrummingPatternArr[number + 1][1]
            if (APreviousPattern != "Empty") {
                if(!PreviewAudioPlay){
        
                    PlayCHordsVideo(APreviousPattern)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    if (chord == "Empty" || chord == "No" || chord == "NC-muted" || chord == CurrentChord) {


        if (chord == "NC-muted") {
            isNCMuted = true
        }
    } else {

        try {
            if(!PreviewAudioPlay){
        
                let ChordVideo = document.getElementById(`${chord}-${VideoType}.mp4`);
                ChordVideo.currentTime = 2
            }

        } catch (error) {
            console.log(error);
        }

        try {

            if(!PreviewAudioPlay){
                document.getElementById(`${CurrentChord}.png`).style.display = "none"
        
            }
        } catch (error) {
            console.log(error);

        }
        if(!PreviewAudioPlay){
            document.getElementById(`${chord}.png`).style.display = "block"
        
        }

        CurrentChord = chord;
        ChordRun = true;
        console.log(`Chord Change`);


    }
}

// console.log(MetronomeClickArr);
// // console.log(NumberOfBeatArr);
// console.log(MetronomeSpeedArr);

function playClickMetronome() {

    // let time = new Date().getTime()
    // console.log(time);



    try {

        SetUpAudio(countArrOfPattern)

        // ChordVideo()


        if (DownOrUp == "D") {

            sound = document.getElementById(`${AudioIntensity[countArrOfPattern]}`);
            // console.log(sound);
            // console.log(sound);
            video = HandDown
            HandDown.style.display = "inline-block"
            HandUp.style.display = "none"

        } else if (DownOrUp == "U") {

            sound = document.getElementById(`${AudioIntensity[countArrOfPattern]}`);
            // console.log(sound);
            video = HandUp
            HandDown.style.display = "none"
            HandUp.style.display = "inline-block"
        }



        if (DownOrUp == "E") {
            try {
                if (StoreStroke == "D" && StrummingPatternArr[countArrOfPattern + 1][0] == "D") {
                    video = HandUp
                    HandDown.style.display = "none"
                    HandUp.style.display = "inline-block"
                }

                if (StoreStroke == "U" && StrummingPatternArr[countArrOfPattern + 1][0] == "U") {
                    video = HandDown
                    HandDown.style.display = "inline-block"
                    HandUp.style.display = "none"
                }


            } catch (error) {

            }




        } else {

            StoreStroke = DownOrUp
            video.src = video.getAttribute("src")

            sound.play()
            sound.currentTime = 0;

        }

        // if(countArrOfPattern % 2 == 0){
        //     console.log(countArrOfPattern);
        //     if (count == beatsPerMeasure) {
        //         count = 0;
        //     }
        //     const click1 = document.getElementById("Click1.wav")
        //     const click2 = document.getElementById("Click2.wav")
        //     if (count == 0) {
        //         click1.play();
        //         click1.currentTime = 0;
        //     } else {
        //         click2.play();
        //         click2.currentTime = 0;
        //     }

        //     count++
        // }
        
        if (MetronomeClickArr[BeatIncreaseNumber] == "Beat") {
            CheckMetronomeOn()
            if (metronomeSound) {
                if (count == beatsPerMeasure) {
                    count = 0;
                }
                const click1 = document.getElementById("Click1.wav") 
                const click2 = document.getElementById("Click2.wav")
                if (count == 0) {
                    click1.play();
                    click1.currentTime = 0;
                } else {
                    click2.play();
                    click2.currentTime = 0;
                }

                count++
            }
        }


        try {

            if (isNCMuted) {
                console.log(`Stop Sounds`);

                StopSounding(StoreSound)
                isNCMuted = false;
            }
            if (StoreSound) {
                if (CurrentChord == StoreSound) {
                } else {
                    console.log(`Stop Sounds`);

                    StopSounding(StoreSound)
                }

            }
            StoreSound = CurrentChord

        } catch (error) {
            console.log(error);
        }


        BeatIncreaseNumber++

        countArrOfPattern++


    } catch (error) {
        console.log(error);
    }

    if (document.getElementById("TimeSignatureBottomValue").value == 4) {

        switch (MetronomeSpeedArr[BeatIncreaseNumber - 1]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 3);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    } else {
        switch (MetronomeSpeedArr[BeatIncreaseNumber - 1]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 6);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    }


}


function PreviewAudioMetronomeOnly() {

    if (sound === null) {
        let DisplayPatternData = document.getElementById("DisplayPatternData")
        function isScrollAtStart() {
            return DisplayPatternData.scrollLeft === 0;
        }
        // Add scroll event listener
        DisplayPatternData.addEventListener('scroll', function() {
            if (isScrollAtStart()) {
                BarcountClass = 1
            }
        });
        smoothScroll();
        countArrOfPattern = 0;
        Barcount = 0
        bar.classList.remove("HightLightBars");
        bar.classList.remove("animatedBars");
        UpperPattern.classList.remove("ProgressInBars")
        UpperPattern.classList.remove("animatedPatternDisplay")
        return;
    }

    try {

        SetUpAudio(countArrOfPattern, StrummingPatternArr?.length)


        if (DownOrUp == "D") {

            sound = document.getElementById(`${AudioIntensity[countArrOfPattern]}`);
            // console.log(sound);
            // console.log(sound);
            // video = HandDown
            // HandDown.style.display = "inline-block"
            // HandUp.style.display = "none"

        } else if (DownOrUp == "U") {

            sound = document.getElementById(`${AudioIntensity[countArrOfPattern]}`);
            // console.log(sound);
            // video = HandUp
            // HandDown.style.display = "none"
            // HandUp.style.display = "inline-block"
        }



        if (DownOrUp == "E") {
            // try {
            //     if (StoreStroke == "D" && StrummingPatternArr[countArrOfPattern + 1][0] == "D") {
            //         video = HandUp
            //         HandDown.style.display = "none"
            //         HandUp.style.display = "inline-block"
            //     }

            //     if (StoreStroke == "U" && StrummingPatternArr[countArrOfPattern + 1][0] == "U") {
            //         video = HandDown
            //         HandDown.style.display = "inline-block"
            //         HandUp.style.display = "none"
            //     }


            // } catch (error) {

            // }




        } else {

            StoreStroke = DownOrUp
            // video.src = video.getAttribute("src")

            sound.play()
            sound.currentTime = 0;

        }

        if (MetronomeClickArr[BeatIncreaseNumber] == "Beat") {
            CheckMetronomeOn()
            if (metronomeSound) {
                if (count == beatsPerMeasure) {
                    count = 0;
                }
                const click1 = document.getElementById("Click1.wav")
                const click2 = document.getElementById("Click2.wav")
                if (count == 0) {
                    click1.play();
                    click1.currentTime = 0;
                } else {
                    click2.play();
                    click2.currentTime = 0;
                }

                count++
            }
        }


        try {

            if (isNCMuted) {
                console.log(`Stop Sounds`);

                StopSounding(StoreSound)
                isNCMuted = false;
            }
            if (StoreSound) {
                if (CurrentChord == StoreSound) {
                } else {
                    console.log(`Stop Sounds`);

                    StopSounding(StoreSound)
                }

            }
            StoreSound = CurrentChord

        } catch (error) {
            console.log(error);
        }


        BeatIncreaseNumber++

        countArrOfPattern++


    } catch (error) {
        console.log(error);
    }

    if (document.getElementById("TimeSignatureBottomValue").value == 4) {

        switch (MetronomeSpeedArr[BeatIncreaseNumber - 1]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 3);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    } else {
        switch (MetronomeSpeedArr[BeatIncreaseNumber - 1]) {
            case "Default":
                changeMetronomeInterval(bpm, 2);
                break;
            case "Shuffle":
                changeMetronomeInterval(bpm, 6);

                break;
            case "16ths":
                changeMetronomeInterval(bpm, 4);
                break;

            default:
                break;
        }
    }


}

function StopSounding(StoreSound) {
    // return

    let up = document.getElementById(`${StoreSound}-default-up.wav`)
    let down = document.getElementById(`${StoreSound}-default-down.wav`)

    let upArpe = document.getElementById(`${StoreSound}-arpeggiated-up.wav`)
    let downArpe = document.getElementById(`${StoreSound}-arpeggiated-down.wav`)

    let upSoft = document.getElementById(`${StoreSound}-soft-up.wav`)
    let downSoft = document.getElementById(`${StoreSound}-soft-down.wav`)

    let upHard = document.getElementById(`${StoreSound}-hard-up.wav`)
    let downHard = document.getElementById(`${StoreSound}-hard-down.wav`)

    let upShortHard = document.getElementById(`${StoreSound}-short-hard-up.wav`)
    let downShortHard = document.getElementById(`${StoreSound}-short-hard-down.wav`)

    let upShortSoft = document.getElementById(`${StoreSound}-short-soft-up.wav`)
    let downShortSoft = document.getElementById(`${StoreSound}-short-soft-down.wav`)

    let upShortDefault = document.getElementById(`${StoreSound}-short-default-up.wav`)
    let downShortDefault = document.getElementById(`${StoreSound}-short-default-down.wav`)

    let upBass = document.getElementById(`${StoreSound}-Bass-up.wav`)
    let downBass = document.getElementById(`${StoreSound}-Bass-down.wav`)


    if (up) {
        up.pause()
        up.currentTime = 0;
    }

    if (down) {
        down.pause()
        down.currentTime = 0;
    }


    if (upArpe) {
        upArpe.pause()
        upArpe.currentTime = 0;
    }

    if (downArpe) {
        downArpe.pause()
        downArpe.currentTime = 0;
    }


    if (upSoft) {
        upSoft.pause()
        upSoft.currentTime = 0;
    }

    if (downSoft) {
        downSoft.pause()
        downSoft.currentTime = 0;
    }


    if (upHard) {
        upHard.pause()
        upHard.currentTime = 0;
    }

    if (downHard) {
        downHard.pause()
        downHard.currentTime = 0;
    }


    if (upShortSoft) {
        upShortSoft.pause()
        upShortSoft.currentTime = 0;
    }

    if (downShortSoft) {
        downShortSoft.pause()
        downShortSoft.currentTime = 0;
    }


    if (upShortHard) {
        upShortHard.pause()
        upShortHard.currentTime = 0;

    }

    if (downShortHard) {
        downShortHard.pause()
        downShortHard.currentTime = 0;

    }


    if (upShortDefault) {
        upShortDefault.pause()
        upShortDefault.currentTime = 0;

    }


    if (downShortDefault) {
        downShortDefault.pause()
        downShortDefault.currentTime = 0;

    }

    if (upBass) {
        upBass.pause()
        upBass.currentTime = 0;

    }

    if (downBass) {
        downBass.pause()
        downBass.currentTime = 0;

    }


}


const Metronome = new MetronomeTimer(playClickMetronome, bpm, { immediate: true });
const PreviewAudioMetronome = new MetronomeTimer(PreviewAudioMetronomeOnly, bpm, { immediate: true });
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        document.getElementById("BtnWithVideo").style.display = "block"
    }
};