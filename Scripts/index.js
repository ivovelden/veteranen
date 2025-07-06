// JScript File
//function window.onload()
window.onload = function()
{
    var page = getQueryParamValue("page") != null ? getQueryParamValue("page") : "nieuws";
    switch(page)
    {
        case "nieuws":
            ShowInformation(1, 'nieuws');
            break;    
        case "programma":
            ShowInformation(1, 'programma');
            break;    
        case "programmaaltveteranen":
            ShowInformation(1, 'programmaaltveteranen');
            break;
        case "wedstrijdverslagen":
            ShowInformation(1, 'wedstrijdverslagen');
            break;
        case "koffiemetbacks":
            ShowInformation(1, 'koffiemetbacks');
            break;
        case "bestuur":
            ShowInformation(2, 'bestuur');
            break;    
        case "sponsors":
            ShowInformation(1, 'sponsors');
            break;    
        case "fotoalbum":
            ShowInformation(1, 'fotoalbum');
            break;    
        case "jaaroverzichten":
            ShowInformation(1, 'jaaroverzichten');
            break;    
        case "oprichting":
            ShowInformation(1, 'oprichting');
            break;    
        default:
            ShowInformation(1, 'nieuws');
    }    
    
    // Start Date/Time.
    StartDateTime();
    
    // Update marquee.
    var oElm = document.getElementById("mrqIVOVeteranen");
    if (oElm != null)
    {
        // Mededeling.
        getMededeling(true)
        .then(function (oMededeling) {
            if (oMededeling != null) {
                oElm.innerText = oMededeling.getAttribute("tekst").split("#\n#")[0];
                return;
            }

            // Volgende wedstrijd.
            getVolgendeWedstrijd()
            .then(function (oNextWedstrijd) {
                if (oNextWedstrijd == null) {
                    oElm.innerText = "IVO Veteranen";
                }
                else {
                    var sWedstrijd = oNextWedstrijd.getAttribute("datum").split("-");
                    var dWedstrijd = new Date(parseInt(sWedstrijd[0], 10), parseInt(sWedstrijd[1], 10) - 1, parseInt(sWedstrijd[2], 10));

                    oElm.innerText = "IVO Veteranen - " + day_names[dWedstrijd.getDay()] + " " + dWedstrijd.getDate() + " " + month_names[dWedstrijd.getMonth()];
                    oElm.innerText += " " + oNextWedstrijd.getAttribute("wedstrijd");

                    // Afgelast.
                    if (oNextWedstrijd.getAttribute("afgelast") != null && oNextWedstrijd.getAttribute("afgelast") != "0") {
                        oElm.innerText += " *** AFGELAST *** AFGELAST *** AFGELAST ***";
                    }
                        // Aanvang.
                    else if (oNextWedstrijd.getAttribute("aanvang") != null) {
                        var sAanvang = oNextWedstrijd.getAttribute("aanvang");
                        if (sAanvang.length > 0 && sAanvang != "??:??") {
                            oElm.innerText += " aanvang " + sAanvang + " uur";

                            // Vertrek.
                            if (oNextWedstrijd.getAttribute("vertrek") != null) {
                                var sVertrek = oNextWedstrijd.getAttribute("vertrek");
                                if (sVertrek.length > 0 && sVertrek != "??:??") {
                                    oElm.innerText += " vertrek " + sVertrek + " uur";
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}

var prevSelMnuOption = null;
function ShowInformation(iSection, sPage, sDefault)
{
    var oElmSec1 = document.getElementById("ifrSection1");
    var oElmSec2 = document.getElementById("ifrSection2");

    if (prevSelMnuOption != null)
    {
        prevSelMnuOption.style.textDecoration = "none";
    }


    // Set Iframe.    
    if (iSection == 1)
    {
        if (oElmSec1 != null)
        {
            if (sDefault == null)
                oElmSec1.src = sPage + ".html";
            else
                oElmSec1.src = sPage + ".html?default=" + sDefault;
            oElmSec1.style.display = "";
        }
        if (oElmSec2 != null)
        {
            oElmSec2.src = "";
            oElmSec2.style.display = "none";
        }
    }
    else
    {
        if (oElmSec1 != null)
        {
            oElmSec1.src = "";
            oElmSec1.style.display = "none";
        }
        if (oElmSec2 != null)
        {
            oElmSec2.src = sPage + ".html";
            oElmSec2.style.display = "";
        }
    }

    var oElm = document.getElementById("h2" + sPage);
    if (oElm != null)
    {
        oElm.style.textDecoration = "underline";
        prevSelMnuOption = oElm;
    }
}

function StartDateTime()
{
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
     
    // Add a zero in front of numbers < 10.
    m = AddLeadingZero(m);
    s = AddLeadingZero(s);
    
    // Set Date/Time.
    document.getElementById("tdDate").innerHTML = day_names[today.getDay()].substr(0, 1).toUpperCase() + day_names[today.getDay()].substr(1) + " " + today.getDate() + " " + month_names[today.getMonth()] + " " + today.getFullYear();
    document.getElementById("tdTime").innerHTML = h + ":" + m + ":" + s;
    timer = setTimeout("StartDateTime()", 1000);
}

function OpenPrivacy() {
    if (window.location.hostname === "localhost") {
        window.open(window.location.origin + "//Privacy/AVGIVOVeteranen20180819.pdf");
    }
    else {
        window.open(window.location.href + "Privacy/AVGIVOVeteranen20180819.pdf");
    }
}
