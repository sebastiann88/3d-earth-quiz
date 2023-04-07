/**
 * Generated by Verge3D Puzzles v.3.7.1
 * Fri Apr 07 2023 03:42:15 GMT-0400 (Eastern Daylight Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};


    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["SETUP"] = SETUP;
this.procedures["HIDE_overlays"] = HIDE_overlays;
this.procedures["Storedata"] = Storedata;
this.procedures["getscore"] = getscore;
this.procedures["submit"] = submit;
this.procedures["TextChange"] = TextChange;

var PROC = {
    "SETUP": SETUP,
    "HIDE_overlays": HIDE_overlays,
    "Storedata": Storedata,
    "getscore": getscore,
    "submit": submit,
    "TextChange": TextChange,
};

var Question, BTN_Name, Quiz_Start, ANS1, quizData, QNUM, lastClick, ANS2, Q_state, questionCount, ANS3, ANS4, ANS5, percentage, correctCount;

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    if (appInstance.scene) {
        appInstance.scene.traverse(function(obj) {
            if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
                objFound = obj;
                if (runTime) {
                    _pGlob.objCache[objName] = objFound;
                }
            }
        });
    }
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}

// updateTextObject puzzle
function updateTextObj(objSelector, text) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;
        var obj = getObjectByName(objName);
        if (!obj || !obj.geometry || !obj.geometry.cloneWithText)
            continue;
        obj.geometry = obj.geometry.cloneWithText(String(text));
    }
}

// Describe this function...
function SETUP() {
  Quiz_Start = 0;
  HIDE_overlays();
  questionCount = 5;
  /*  Add 1 for welcome text  0-3 equals 4 text msgs */
  QNUM = 0;
  lastClick = 0;
  Q_state = true;
  correctCount = 0;
  quizData = [];
  /* Set True to start  */
  updateTextObj('B_Text', 'Start');
  updateTextObj('Q_Text', 'Ready to start the quiz?');
}

// show and hide puzzles
function changeVis(objSelector, bool) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
        obj.resolveMultiMaterial().forEach(function(objR) {
            objR.visible = bool;
        });
    }
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList, false);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}

// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}

// Describe this function...
function HIDE_overlays() {
  changeVis('Inner Core S', false);
  changeVis('Outer Core S', false);
  changeVis('Lower Mantle S', false);
  changeVis('Upper Mantle S', false);
  changeVis('Crust S', false);
}

// Describe this function...
function Storedata() {
  quizData[QNUM] = lastClick;
}

// Describe this function...
function getscore() {
  ANS1 = quizData[1];
  ANS2 = quizData[2];
  ANS3 = quizData[3];
  ANS4 = quizData[4];
  ANS5 = quizData[5];
  if (ANS1 == 5) {
    correctCount = 1;
  }
  if (ANS2 == 1) {
    correctCount = correctCount + 1;
  }
  if (ANS3 == 4) {
    correctCount = correctCount + 1;
  }
  if (ANS4 == 2) {
    correctCount = correctCount + 1;
  }
  if (ANS5 == 3) {
    correctCount = correctCount + 1;
  }
}

// Describe this function...
function submit() {
  if (Q_state) {
    if (QNUM == 0) {
      Quiz_Start = 1;
      Storedata();
      Question = 'Q1: Select the Crust';
      BTN_Name = '';
      TextChange(Question, BTN_Name);
      QNUM = 1;
      Q_state = false;
      HIDE_overlays();
    } else if (QNUM == 1) {
      Storedata();
      Question = 'Q2: Select the Inner Core';
      BTN_Name = '';
      TextChange(Question, BTN_Name);
      QNUM = QNUM + 1;
      Q_state = false;
      HIDE_overlays();
    } else if (QNUM == 2) {
      Storedata();
      Question = 'Q3: Select the Upper Mantel';
      BTN_Name = '';
      TextChange(Question, BTN_Name);
      QNUM = QNUM + 1;
      Q_state = false;
      HIDE_overlays();
    } else if (QNUM == 3) {
      Storedata();
      Question = 'Q4: Select the Outer Core';
      BTN_Name = '';
      TextChange(Question, BTN_Name);
      QNUM = QNUM + 1;
      Q_state = false;
      HIDE_overlays();
    } else if (QNUM == 4) {
      Storedata();
      Question = 'Q5: Select the Lower Mantel';
      BTN_Name = '';
      TextChange(Question, BTN_Name);
      QNUM = QNUM + 1;
      Q_state = false;
      HIDE_overlays();
    } else if (QNUM == 5) {
      Storedata();
      getscore();
      console.log(quizData);
      percentage = 0;
      Question = ['QUIZ complete!  Your score is: ',(correctCount / questionCount) * 100,'%'].join('');
      BTN_Name = 'Restart';
      TextChange(Question, BTN_Name);
      QNUM = 10;
      Q_state = true;
      HIDE_overlays();
    } else if (QNUM == 10) {
      SETUP();
    }
  }
}

// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}

// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}

// whenHovered puzzle
initObjectPicking(function(intersects, event) {

    var prevHovered = _pGlob.hoveredObject;
    var currHovered = '';

    // the event might happen before hover registration
    _pGlob.objHoverInfo = _pGlob.objHoverInfo || [];

    // search for closest hovered object

    var lastIntersectIndex = Infinity;
    _pGlob.objHoverInfo.forEach(function(el) {
        var maxIntersects = el.xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);

            if (objectsIncludeObj(retrieveObjectNames(el.objSelector), objName) && i <= lastIntersectIndex) {
                currHovered = objName;
                lastIntersectIndex = i;
            }
        }
    });

    if (prevHovered == currHovered) return;

    // first - all "out" callbacks, then - all "over"
    _pGlob.objHoverInfo.forEach(function(el) {
        if (objectsIncludeObj(retrieveObjectNames(el.objSelector), prevHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = prevHovered;
            el.callbacks[1](event);
        }
    });

    _pGlob.objHoverInfo.forEach(function(el) {
        if (objectsIncludeObj(retrieveObjectNames(el.objSelector), currHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = currHovered;
            el.callbacks[0](event);
        }
    });

    _pGlob.hoveredObject = currHovered;
}, 'mousemove', false);

// whenHovered puzzle
function registerOnHover(objSelector, xRay, cbOver, cbOut) {

    _pGlob.objHoverInfo = _pGlob.objHoverInfo || [];

    _pGlob.objHoverInfo.push({
        objSelector: objSelector,
        callbacks: [cbOver, cbOut],
        xRay: xRay
    });
}

// Describe this function...
function TextChange(Question, BTN_Name) {
  updateTextObj('Q_Text', Question);
  updateTextObj('B_Text', BTN_Name);
}


SETUP();

registerOnClick('Inner Core', false, false, [0,1,2], function() {
  if (Quiz_Start == 1) {
    HIDE_overlays();
    changeVis('Inner Core S', true);
    Q_state = true;
    lastClick = 1;
    BTN_Name = 'Submit';
    updateTextObj('B_Text', BTN_Name);
  }
}, function() {});
registerOnClick('Outer Core', false, false, [0,1,2], function() {
  if (Quiz_Start == 1) {
    HIDE_overlays();
    changeVis('Outer Core S', true);
    Q_state = true;
    lastClick = 2;
    BTN_Name = 'Submit';
    updateTextObj('B_Text', BTN_Name);
  }
}, function() {});
registerOnClick('Lower Mantle', false, false, [0,1,2], function() {
  if (Quiz_Start == 1) {
    HIDE_overlays();
    changeVis('Lower Mantle S', true);
    Q_state = true;
    lastClick = 3;
    BTN_Name = 'Submit';
    updateTextObj('B_Text', BTN_Name);
  }
}, function() {});
registerOnClick('Upper Mantle', false, false, [0,1,2], function() {
  if (Quiz_Start == 1) {
    HIDE_overlays();
    changeVis('Upper Mantle S', true);
    Q_state = true;
    lastClick = 4;
    BTN_Name = 'Submit';
    updateTextObj('B_Text', BTN_Name);
  }
}, function() {});
registerOnClick('Crust', false, false, [0,1,2], function() {
  if (Quiz_Start == 1) {
    HIDE_overlays();
    changeVis('Crust S', true);
    Q_state = true;
    lastClick = 5;
    BTN_Name = 'Submit';
    updateTextObj('B_Text', BTN_Name);
  }
}, function() {});

registerOnClick('Message_Plane.001', false, false, [0,1,2], function() {
  submit();
}, function() {});
registerOnClick('B_Text', false, false, [0,1,2], function() {
  submit();
}, function() {});

registerOnHover('Inner Core', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('Outer Core', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('Lower Mantle', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('Upper Mantle', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('Crust', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('Message_Plane.001', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});
registerOnHover('B_Text', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
