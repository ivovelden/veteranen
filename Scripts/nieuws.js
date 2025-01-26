// JScript File
// Goto Programma function.
function GotoProgramma() {
    window.parent.ShowInformation(1, 'programma');
}

// Goto Wedstrijdverslagen function.
function GotoWedstrijdverslagen(wedstrijdverslag) {
    window.parent.ShowInformation(1, 'wedstrijdverslagen', wedstrijdverslag);
}

// Goto GotoKoffieMetBacks function.
function GotoKoffieMetBacks(koffiemet) {
    window.parent.ShowInformation(1, 'koffiemetbacks', koffiemet);
}

// Goto Album function.
function GotoAlbum(defaultAlbum)
{
    window.parent.ShowInformation(1, 'fotoalbum', defaultAlbum);
}

// Goto Jaaroverzichten function.
function GotoJaaroverzichten() {
    window.parent.ShowInformation(1, 'jaaroverzichten');
}

// Window onload function.
window.onload = function() 
{
    // Update Programma Text.
    var oElm = document.getElementById("h1IVOVeteranen");
    if (oElm != null)
    {
        // Mededeling.
        getMededeling(false)
        .then(function (oMededeling) {
            if (oMededeling != null) {
                var sTextLines = oMededeling.getAttribute("tekst").split("#\\n#");
                for (var idx = 0; idx < sTextLines.length; idx++) {
                    if (idx > 0) {
                        oElm.innerHTML += "<br/>";
                    }
                    oElm.innerHTML += sTextLines[idx];
                }
                return;
            }

            // Volgende wedstrijd.
            getVolgendeWedstrijd()
            .then(function (oNextWedstrijd) {
                if (oNextWedstrijd == null) {
                    oElm.style.display = "none";
                    document.getElementById("pIVOVeteranen").style.display = "none";
                }
                else {
                    var sWedstrijd = oNextWedstrijd.getAttribute("datum").split("-");
                    var dWedstrijd = new Date(parseInt(sWedstrijd[0], 10), parseInt(sWedstrijd[1], 10) - 1, parseInt(sWedstrijd[2], 10));

                    oElm.innerText = day_names[dWedstrijd.getDay()].substr(0, 1).toUpperCase() + day_names[dWedstrijd.getDay()].substr(1) + " " + dWedstrijd.getDate() + " " + month_names[dWedstrijd.getMonth()];
                    oElm.innerText += " " + oNextWedstrijd.getAttribute("wedstrijd");

                    // Afgelast.
                    if (oNextWedstrijd.getAttribute("afgelast") != null && oNextWedstrijd.getAttribute("afgelast") != "0") {
                        if (oNextWedstrijd.getAttribute("afgelast") == "1") {
                            oElm.innerHTML += "<br/>*** AFGELAST ***";
                        }
                        else if (oNextWedstrijd.getAttribute("afgelast") == "2") {
                            oElm.innerHTML += "<br/>*** AFGELAST ***";
                            var sTijd = (oNextWedstrijd.getAttribute("tijd") != null) ? oNextWedstrijd.getAttribute("tijd") : "";
                            ////oElm.innerHTML += "<br/><br/>Aanvang derde helft " + sTijd + " uur bij Café de Sport.<br/><br/>";
                            oElm.innerHTML += "<br/><br/>Derde helft bij Café de Sport.<br/>Aanvang: " + sTijd + " uur<br/><br/>";
                        }
                        else if (oNextWedstrijd.getAttribute("afgelast") == "3") {
                            oElm.innerHTML += "<br/>*** AFGELAST ***";
                            var sTijd = (oNextWedstrijd.getAttribute("tijd") != null) ? oNextWedstrijd.getAttribute("tijd") : "";
                            oElm.innerHTML += "<br/><br/>Trainen (en derde helft) aanvang " + sTijd + " uur.<br/><br/>";
                        }
                        else if (oNextWedstrijd.getAttribute("afgelast") == "4") {
                            oElm.innerHTML += "<br/>*** AFGELAST ***";
                            var sTijd = (oNextWedstrijd.getAttribute("tijd") != null) ? oNextWedstrijd.getAttribute("tijd") : "";
                            oElm.innerHTML += "<br/><br/>Derde helft en afscheidsfeest kantine.<br/>Aanvang: " + sTijd + " uur<br/><br/>";
                        }
                    }
                        // Aanvang.
                    else if (oNextWedstrijd.getAttribute("aanvang") != null) {
                        var sAanvang = oNextWedstrijd.getAttribute("aanvang");
                        if (sAanvang.length > 0 && sAanvang != "??:??") {
                            oElm.innerHTML += "<br/>Aanvang " + sAanvang + " uur";

                            // Vertrek.
                            if (oNextWedstrijd.getAttribute("vertrek") != null) {
                                var sVertrek = oNextWedstrijd.getAttribute("vertrek");
                                if (sVertrek.length > 0 && sVertrek != "??:??") {
                                    oElm.innerHTML += "<br/>Vertrek " + sVertrek + " uur";
                                    if (oNextWedstrijd.getAttribute("fiets") != null && oNextWedstrijd.getAttribute("fiets") == "1") {
                                        oElm.innerHTML += " (met de fiets)";
                                    }
                                    if (oNextWedstrijd.getAttribute("bus") != null && oNextWedstrijd.getAttribute("bus") == "1") {
                                        oElm.innerHTML += " (met de bus)";
                                    }
                                }
                            }
                        }
                    }
                    oElm.style.display = "";
                    document.getElementById("pIVOVeteranen").style.display = "";
                }
            });
        });
    }

    // Build Nieuws Table.
    BuildNieuwsTable();
}


// Build Nieuws Table.
function BuildNieuwsTable()
{
    var oElm = document.getElementById("tblNieuws");
    if (oElm != null)
    {
        try
        {
            // Load Nieuws Xml.
            loadXMLDoc("Nieuws.xml")
            .then(function (oXml) {

                // Loop through Nieuws.
                var oXmlNodes = oXml.getElementsByTagName("Nieuw");
                for (var idx = 0; idx < oXmlNodes.length; idx++)
                {
                    var oXmlNode = oXmlNodes[idx];
            
                    // Get Nieuws Data.
                    var nieuwsTitle = (oXmlNode.getAttribute("titel") != null) ? oXmlNode.getAttribute("titel") : "";
                    var nieuwsNew = (oXmlNode.getAttribute("nieuw") != null && oXmlNode.getAttribute("nieuw") == "1") ? true : false;
                    var nieuwsText = "";
                    if (oXmlNode.getElementsByTagName("Tekst").length > 0) {
                        if (oXmlNode.getElementsByTagName("Tekst")[0].text)
                            nieuwsText = oXmlNode.getElementsByTagName("Tekst")[0].text;
                        else
                            // Safari.
                            nieuwsText = oXmlNode.getElementsByTagName("Tekst")[0].textContent;
                    }

                    // Creates a empty row.
                    var oRow = oElm.insertRow();
                
                    // Arrow Image.
                    var oCell1 = oRow.insertCell(-1);
                    oCell1.setAttribute("width", "50px");
                    oCell1.setAttribute("vAlign", "top");
                    oCell1.innerHTML = "<img alt=\"\" src=\"Images/ArrowRight.gif\" />"
                
                    // Data.
                    var oCell2 = oRow.insertCell(-1);
                    oCell2.className = "textonlynieuws";
                    oCell2.setAttribute("vAlign", "top");

                    var nieuwsHTML = "<strong><span style=\"text-decoration: underline\">" + nieuwsTitle + "</span>";
                    if (nieuwsNew)
                        nieuwsHTML += " (<font color=\"red\">Nieuw</font>)";
                    nieuwsHTML += "</strong><br/><br/>" + nieuwsText + "<br/><br/>";
                    oCell2.innerHTML = nieuwsHTML;

                    // Add the row to the end of the table.
                    try
                    {
                        oElm.firstChild.appendChild(oRow);
                    }
                    catch (e)
                    {
                        oElm.appendChild(oRow);
                    }
                }
            })
            .catch(function (err) {
                console.error("OOPS, there was an error!", err.msg);
            });
        }
        catch(e) {}
    }
}


// Read More OnClick Event Handler.
function ReadMoreOnClickHandler(elm, divReadMoreId) {
    // Get current scroll position.
    var scrollPosition = window.scrollY;

    // Display the Read More div and hide the Read More text.
    let divReadMore = document.getElementById(divReadMoreId);
    divReadMore.style.display = "";
    elm.style.display = "none";

    // Scroll to the current position.
    setTimeout(function () {
        window.scrollTo(0, scrollPosition);
    }, 1);
}