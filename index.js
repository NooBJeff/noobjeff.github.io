/**
 * Created by jeff on 05/01/2017.
 * Subtitle Player
 * todo: re-write script generator
 */

/**
 * User Exceptions
 */

/**
 * Illegal Format Exception
 * @param message
 * @constructor
 */
function IllegalFormatException(message) {
    this.message = message;
    this.name = "IllegalFormatException";
}

/**
 * Illegal State Exception
 * @param message
 * @constructor
 */
function IllegalStateException(message) {
    this.message = message;
    this.name = "IllegalStateException";
}

/*
 *  Helper functions
 */
function ExceptionHandler(err) {
    alert("Something happened, please check your file and try again\nError message:\n" + err.message);
}

function stringIsEmpty(str) {
    return !/\S/.test(str);
}

function muteDefault(e) {
    e.stopPropagation();
    e.preventDefault();
}


/**
 * Change the HTML content to display the script
 * @param {LineOfScript|null} script
 */
function displayScript(script) {
    if (script == null) {
        $('#title').text("");
        $('#subtitle').text("");
        return;
    }

    $('#title').text(script.title);
    $('#subtitle').text(script.subTitle);
}

/**
 * x000: Play button
 * 0x00: Pause button
 * 00x0: Replay button
 * 000x: Reset button
 */
function displayButton(btn_combination) {
    displayButton.PLAY = 8;
    displayButton.PAUSE = 4;
    displayButton.REPLAY = 2;
    displayButton.RESET = 1;

    (displayButton.PLAY & btn_combination) != 0 ? $('#btnPlay').show() : $('#btnPlay').hide();
    (displayButton.PAUSE & btn_combination) != 0 ? $('#btnPause').show() : $('#btnPause').hide();
    (displayButton.REPLAY & btn_combination) != 0 ? $('#btnReplay').show() : $('#btnReplay').hide();
    (displayButton.RESET & btn_combination) != 0 ? $('#btnReset').show() : $('#btnReset').hide();
}

function setSliderCursor(val) {
    $('.slider input').val(val);
}

/**
 * Pad left leading zero
 * @param {int} val: the original number
 * @param {int} length: the result length
 * @returns {string}
 */
function padZero(val, length) {
    var str = "" + val;
    var pad = new Array(length + 1).join('0');
    return pad.substring(0, pad.length - str.length) + str;
}

/**
 * Set HTML time meter
 * @param {Date} date
 */
function setTimeMeter(date) {
    $('#cur_hour').text(padZero(date.getHours(), 2));
    $('#cur_min').text(padZero(date.getMinutes(), 2));
    $('#cur_sec').text(padZero(date.getSeconds(), 2));
    $('#cur_mill').text(padZero(date.getMilliseconds(), 3));
}

/**
 * Set HTML max time meter
 * @param {Date} date
 */
function setMaxTimeMeter(date) {
    $('#max_hour').text(padZero(date.getHours(), 2));
    $('#max_min').text(padZero(date.getMinutes(), 2));
    $('#max_sec').text(padZero(date.getSeconds(), 2));
    $('#max_mill').text(padZero(date.getMilliseconds(), 3));
}

var STATES = {
    noFileLoaded: 0,
    playing: 1,
    paused: 2,
    finished: 3
};


/**
 * Class contains info about close-caption
 * @param {int} id: number of current line
 * @param {int} startTime: the start time of this close caption
 * @param {int} endTime: the end time of this ...
 * @param {string} title: the main title
 * @param {string} subTitle: the sub-title
 * @constructor
 */
function LineOfScript(id, startTime, endTime, title, subTitle) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.title = title;
    this.subTitle = subTitle;

    this.duration = endTime - startTime;

    this.gapTime = 0;
}

/**
 * Script Generator Class
 * @param arrayStrings
 * @constructor
 */
function ScriptGenerator(arrayStrings) {
    var timeMeterZero = new Date(0, 0, 0, 0, 0, 0, 0);
    // re expression used to parse out time (hour:minute:second,millisecond)
    var reTimeStamp = /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/;

    this.raw = arrayStrings;

    /**
     * Parse strings
     * //todo: Should handle more complex situation
     * @return {LineOfScript}
     */
    this.next = function () {
        if (this.raw.length <= 4) {
            return null;
        }

        var id = parseInt(this.raw.shift());
        var timeStamp = this.raw.shift();
        var title = this.raw.shift();
        var subtitle = this.raw.shift();

        // If subtitle is an empty line
        // And next line is not empty
        // Then no subtitle
        if (stringIsEmpty(subtitle) && !stringIsEmpty(this.raw[0])) {
            subtitle = null;
        } else {
            // We got subtitle
            // If next line is not empty
            if (!stringIsEmpty(this.raw.shift())) {
                throw new IllegalFormatException("Illegal File Format");
            }
        }

        // Discard empty line
        // if (stringIsEmpty(title) && stringIsEmpty(subtitle)) {
        //     throw new IllegalFormatException("Empty title and subtitle");
        // }

        // Parse time
        // "hh:mm:ss,sss --> hh:mm:ss,sss"
        var result = reTimeStamp.exec(timeStamp);
        if (result.length != 9) {
            throw new IllegalFormatException("Illegal Time Stamp Format");
        }

        // Convert time values from string to int
        for (var lop = 1; lop <= 9; lop++) {
            result[lop] = parseInt(result[lop]);
        }

        return new LineOfScript(id,
            new Date(0, 0, 0, result[1], result[2], result[3], result[4]) - timeMeterZero,
            new Date(0, 0, 0, result[5], result[6], result[7], result[8]) - timeMeterZero,
            title,
            subtitle);
    };
}

/**
 * Script Player class
 * @constructor
 */
function ScriptPlayer() {
    // store the job ID when using setIntervel
    this.loop_id = 0;

    // Storage values
    this.raw = undefined;
    this.state = STATES.noFileLoaded;

    /**
     * State Machine
     * @param {int} newState
     */
    this.changeState = function (newState) {
        function dispatchMessage(from, to) {
            dispatchMessage.dispatch = {
                // From noFileLoaded
                0: function () {
                    if (to == STATES.paused) {
                        // Display the controllers first
                        $('.controller').show();
                        displayButton(displayButton.PLAY);
                    } else {
                        throw new IllegalStateException(from + " -> " + to);
                    }
                },
                // From playing
                1: function () {
                    if (to == STATES.paused) {
                        displayButton(displayButton.PLAY);
                    } else if (to == STATES.finished) {
                        displayButton(displayButton.REPLAY | displayButton.RESET);
                    } else {
                        throw new IllegalStateException(from + " -> " + to);
                    }
                },
                // From paused
                2: function () {
                    if (to == STATES.playing) {
                        displayButton(displayButton.PAUSE);
                    } else {
                        throw new IllegalStateException(from + " -> " + to);
                    }
                },
                // From finished
                3: function () {
                    if (to == STATES.playing) {
                        displayButton(displayButton.PAUSE);
                    } else if (to == STATES.paused) {
                        displayButton(displayButton.PLAY);
                    } else {
                        throw new IllegalStateException(from + " -> " + to);
                    }
                }
            };

            //console.log("From: " + from + " To: " + to);
            (dispatchMessage.dispatch[from])();
        }

        dispatchMessage(this.state, newState);
        this.state = newState;
    };

    // Player related values
    this.time_cursor = 0;
    this.index_cursor = 0;
    // The time of start, real world time
    this.base_time = 0;

    // Put the time_cursor at a given start time
    this.setCursor = function (milliTime) {
        this.time_cursor = milliTime;
        setSliderCursor(milliTime);
        setTimeMeter(new Date(milliTime));
        // todo: fix this
        this.index_cursor = 0;
    };

    this.scriptAtCursor = function () {
        console.log("Index: " + this.index_cursor + " Time: " + this.time_cursor);
        if (this.index_cursor >= this.raw.length) {
            this.changeState(STATES.finished);

            clearInterval(this.loop_id);
            return;
        }

        var currentScript = this.raw[this.index_cursor];
        if (this.time_cursor < currentScript.startTime) {
            return null;
        }
        if (this.time_cursor <= currentScript.endTime) {
            return currentScript;
        }

        if (this.time_cursor < (currentScript.endTime + currentScript.gapTime)) {
            return null;
        }

        this.index_cursor += 1;
    };

    /**
     * Load array of Scripts
     * @param arrayOfScript
     */
    this.load = function (arrayOfScript) {
        this.raw = arrayOfScript;
        this.changeState(STATES.paused);
        this.setCursor(0);

        // Set max for slider
        $('.slider input').attr('max',
            arrayOfScript[arrayOfScript.length - 1].endTime);
        // Set max value for time meter
        setMaxTimeMeter(new Date(arrayOfScript[arrayOfScript.length - 1].endTime));
    };

    /**
     * Start the loop job
     */
    this.loop = function (speed) {
        this.loop_id = setInterval(function (object) {
            return function () {
                object.time_cursor = new Date() - object.base_time;
                displayScript(object.scriptAtCursor());

                setSliderCursor(object.time_cursor);
                setTimeMeter(new Date(object.time_cursor));
            }
        }(this), speed);
    };

    /**
     * Continue Play the entire script
     */
    this.play = function () {
        this.changeState(STATES.playing);

        // Reset base time based on the time cursor
        this.base_time = new Date() - this.time_cursor;

        //todo: magic number ?
        this.loop(4);
    };

    this.pause = function () {
        this.changeState(STATES.paused);
        clearInterval(this.loop_id);
    };

    this.replay = function () {
        this.setCursor(0);
        this.play();
    };

    this.reset = function () {
        this.setCursor(0);
        this.changeState(STATES.paused);
    };
}

/**
 * Main Entry
 */
function main() {
    var player = new ScriptPlayer();
    var handler = $('#draghandler');
    var slider = $('.slider input');

    ////////////////////
    // Initialization //
    ////////////////////
    $('.controller').hide();
    displayButton();

    ////////////////////////
    //Callback functions //
    ///////////////////////
    // Drag & Drop file
    handler.on('dragover', function (e) {
        muteDefault(e);
        $(this).css('border', '2px solid #0B85A1');
    });
    handler.on('dragleave', function () {
        $(this).css('border', '');
    });
    handler.on('dragenter', muteDefault);
    handler.on('drop', function (e) {
        e.preventDefault();
        $(this).css('border', '2px dotted #0B85A1');

        var file = e.originalEvent.dataTransfer.files;
        fileHandler(file[0]);
    });

    slider.on('change', function (e) {
        // console.log("Final: " + e.currentTarget.value);
        player.setCursor(parseInt(e.currentTarget.value));
    });

    slider.on('input', function (e) {
        setTimeMeter(new Date(parseInt(e.currentTarget.value)));
    });

    // Prevent drag & drop file outside of div
    $(document).on('dragenter', muteDefault);
    $(document).on('dragover', muteDefault);
    $(document).on('drop', muteDefault);

    /**
     * Buttons callback functions
     */
    $('#btnPlay').click(function () {
        player.play();
    });

    $('#btnPause').click(function () {
        player.pause();
    });

    $('#btnReplay').click(function () {
        player.replay();
    });

    $('#btnReset').click(function () {
        player.reset();
    });

    // Read file from user
    function fileHandler(file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var arrayOfStrings = e.target.result.split("\n");
            initScript(arrayOfStrings);
        };

        // Change HTML content
        $("#filename_display").text("Loaded: " + file.name);
        reader.readAsText(file);

        // Read through strings and parse out the info
        function initScript(arrayString) {
            var generator = new ScriptGenerator(arrayString);
            var arrayOfScript = [];

            var cur = null;
            var prev = null;
            try {
                while ((cur = generator.next()) !== null) {
                    if (prev != null) {
                        prev.gapTime = cur.startTime - prev.endTime;
                    }
                    arrayOfScript.push(cur);
                    prev = cur;
                }
            } catch (err) {
                ExceptionHandler(err);
            }

            player.load(arrayOfScript);
        }
    }
}

$(document).ready(main);
