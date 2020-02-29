window.onkeydown = function (event) {
    if (!event)
        event = window.event;
    var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;
    switch (code) {
        case 37:
            // Key left.
            ShowPreviousImage();
            break;
        case 39:
            // Key right.
            ShowNextImage();
            break;
    }
    event.preventDefault();
};

// Declare Variables.
var curAlbum = "";
var curFotoNumber = 0;
var maxFotoNumber = 0;

// Set slideShowSpeed (milliseconds)
var slideShowSpeed = 5000;

// Duration of crossfade (seconds)
var crossFadeDuration = 3;

// Timer.
var timerId = 0;

// Play Sound.
var playingSound = true;


//function window.onload()
window.onload = function ()
{
    var defaultAlbum = getQueryParamValue("default");

    // Fotoalbum Select List.
    var oElmSelAlbum = document.getElementById("selAlbum");
    if (oElmSelAlbum != null)
    {
        // Build Fotoalbum Select List.
        BuildFotoalbumSelectList(oElmSelAlbum, defaultAlbum)
        .then(function() {
            // Set Default Album.
            if (oElmSelAlbum.options.length > 0) {
                var defaultOpt = oElmSelAlbum.options[0];
                if (oElmSelAlbum.selectedIndex > 0) {
                    defaultOpt = oElmSelAlbum.options[oElmSelAlbum.selectedIndex];
                }
                curAlbum = defaultOpt.albumFolder;
                maxFotoNumber = defaultOpt.maxFotos;

                // Show Foto Navigator and Fotoalbum.        
                document.getElementById("tdFotoNavigator").style.display = "";
                document.getElementById("tdFotoalbum").style.display = "";

                // Show Album
                ShowNextImage();
            }
            else {
                var option = document.createElement("option");
                option.value = 0;
                option.innerText = "Geen fotoalbums aanwezig";
                oElmSelAlbum.appendChild(option);
                oElmSelAlbum.disabled = true;
            }
        });
    }
}


function imgVolumeControl_onclick()
{
    var elmBGSound = document.getElementById("embedBGSound");

    // Set Image Volume Control.
    var elmVolumeControl = document.getElementById("imgVolumeControl");
    if (playingSound)
    {
        elmVolumeControl.src = "Images/volume_control_on.jpg"
        elmVolumeControl.title = "Muziek aan";
        elmBGSound.volume = -9999;
        playingSound = false;
    }
    else
    {
        elmVolumeControl.src = "Images/volume_control_off.jpg"
        elmVolumeControl.title = "Muziek uit";
        elmBGSound.volume = -603;
        playingSound = true;
    }
}

function BuildFotoalbumSelectList(oElmSelAlbum, defaultAlbum)
{
    return new Promise(function (resolve, reject) {
        // Load Fotoalbums Xml.
        loadXMLDoc("Fotoalbum.xml")
        .then(function (oXml) {

            // Loop through Fotoalbums.
            var oXmlNodes = oXml.getElementsByTagName("Fotoalbum");
            for (var idx = 0; idx < oXmlNodes.length; idx++) {
                var oXmlNode = oXmlNodes[idx];

                if (oXmlNode.getAttribute("omschrijving") != null && oXmlNode.getAttribute("folder") != null) {
                    var option = document.createElement("option");
                    option.value = idx;
                    option.innerText = oXmlNode.getAttribute("omschrijving");
                    option.albumFolder = oXmlNode.getAttribute("folder");
                    option.maxFotos = oXmlNode.getAttribute("aantalfotos") != null ? parseInt(oXmlNode.getAttribute("aantalfotos"), 10) : 0;
                    if (defaultAlbum != null) {
                        if (defaultAlbum == option.albumFolder)
                            option.selected = true;
                    }
                    else if (oXmlNode.getAttribute("default") != null && oXmlNode.getAttribute("default") == "1")
                        option.selected = true;

                    // Add Option to Select List.
                    oElmSelAlbum.appendChild(option);
                }
            }

            resolve();
        })
        .catch(function (err) {
            console.error("OOPS, there was an error!", err.msg);
            resolve();
        });
    });
}


function Album_OnChange()
{
    var oElmSelAlbum = document.getElementById("selAlbum");
    if (oElmSelAlbum)
    {
        curFotoNumber = 0;

        // Get and Set Selected Album.
        var defaultOpt = oElmSelAlbum.options[oElmSelAlbum.selectedIndex];
        curAlbum = defaultOpt.albumFolder;
        maxFotoNumber = defaultOpt.maxFotos;

        // Show Album
        ShowNextImage();
    }
}

function ShowNextImage()
{
    if (curFotoNumber < maxFotoNumber)
    {
        curFotoNumber++;
        document.images.ImgFotoalbum.src = "Fotoalbum/" + curAlbum + "/Veteranen_" + curFotoNumber + ".jpg";
        var oText = document.getElementById("txtMessage");
        if (oText != null)
        {
            oText.value = "Foto " + curFotoNumber + " van " + maxFotoNumber;
        }
    }
}

function ShowPreviousImage()
{
    if (curFotoNumber > 1)
    {
        curFotoNumber--;
        document.images.ImgFotoalbum.src = "Fotoalbum/" + curAlbum + "/Veteranen_" + curFotoNumber + ".jpg";
        var oText = document.getElementById("txtMessage");
        if (oText != null)
        {
            oText.value = "Foto " + curFotoNumber + " van " + maxFotoNumber;
        }
    }
}


function StartSlideShow()
{
    RunSlideShow();
    var oButton = document.getElementById("btnStartStopShow");
    if (oButton != null)
    {
        oButton.value = "Stop slideshow"; 
        oButton.onclick = StopSlideShow; 

        // Disable Next and Previous Images.
        document.getElementById("imgPrevious").style.display = "none";
        document.getElementById("imgNext").style.display = "none";
    }

    // Disable Album Select.
    document.getElementById("selAlbum").disabled = true;
}

function StopSlideShow()
{
    if (timerId)
    {
        clearTimeout(timerId);
        timerId  = 0;
    }
    var oButton = document.getElementById("btnStartStopShow");
    if (oButton != null)
    {
        oButton.value = "Start slideshow"; 
        oButton.onclick = StartSlideShow; 

        // Enable Next and Previous Images.
        document.getElementById("imgPrevious").style.display = "";
        document.getElementById("imgNext").style.display = "";
    }

    // Enable Album Select.
    document.getElementById("selAlbum").disabled = false;
}

function RunSlideShow()
{
    if (document.all)
    {
        ////document.images.ImgFotoalbum.style.filter = "blendTrans(duration=2)"
        document.images.ImgFotoalbum.style.filter = "blendTrans(duration=crossFadeDuration)";
        try {
            document.images.ImgFotoalbum.filters.blendTrans.Apply();
        }
        catch (e) {}
    }
   
    if (curFotoNumber >= maxFotoNumber)
    {
        curFotoNumber = 0;
    }
    ShowNextImage();

    if (document.all)
    {
        try {
            document.images.ImgFotoalbum.filters.blendTrans.Play();
        }
        catch (e) {}
    }

    timerId = setTimeout('RunSlideShow()', slideShowSpeed);
}

/*
======================================================
Script:   JavaScript Cross-Browser SlideShow Script
          With Cross-Fade Effect between Images
          Adjustable Timing and Unlimited Images
Function: Displays images continuously in a slideshow
          presentation format, with a fade effect on
          image transitions.
Browsers: All common browsers: NS3-6, IE 4-6
          Fade effect only in IE; others degrade gracefully
Author:   etLux
======================================================

Step 1.
Put the following script in the head of your page:

<script>
// (C) 2000 www.CodeLifter.com
// http://www.codelifter.com
// Free for all users, but leave in this  header
// NS4-6,IE4-6
// Fade effect only in IE; degrades gracefully

// =======================================
// set the following variables
// =======================================

// Set slideShowSpeed (milliseconds)
var slideShowSpeed = 5000

// Duration of crossfade (seconds)
var crossFadeDuration = 3

// Specify the image files
var Pic = new Array() // don't touch this
// to add more images, just continue
// the pattern, adding to the array below

Pic[0] = 'bowrose1.jpg'
Pic[1] = 'bowgroen1.jpg'
Pic[2] = 'bowblue1.jpg'
Pic[3] = '4.jpg'
Pic[4] = '5.jpg'

// ============================================
// do not edit anything below this line
// ============================================

var t
var j = 0
var p = Pic.length

var preLoad = new Array()
for (i = 0; i < p; i++){
   preLoad[i] = new Image()
   preLoad[i].src = Pic[i]
}

function runSlideShow(){
   if (document.all){
      document.images.SlideShow.style.filter="blendTrans(duration=2)"
      document.images.SlideShow.style.filter="blendTrans(duration=crossFadeDuration)"
      document.images.SlideShow.filters.blendTrans.Apply()      
   }
   document.images.SlideShow.src = preLoad[j].src
   if (document.all){
      document.images.SlideShow.filters.blendTrans.Play()
   }
   j = j + 1
   if (j > (p-1)) j=0
   t = setTimeout('runSlideShow()', slideShowSpeed)
}
</script>
*/

