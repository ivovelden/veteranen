// JScript File
var _verslagDate = new Date(2016, 0, 1);

//function window.onload()
window.onload = function()
{
    // Build Programma Table.
    BuildProgrammaTable();
}


// Build Programma Table.
function BuildProgrammaTable()
{
    var oElmDivProgramma = document.getElementById("divProgramma");
    if (oElmDivProgramma != null)
    {
        try
        {
            // Load Programma Xml.
            ////loadXMLDoc("Programma.xml")
            loadXMLDoc(dataFile)
            .then(function (oXml) {

                // Loop through Programma's.
                var oXmlProgrammas = oXml.getElementsByTagName("Wedstrijden");
                for (var idx = 0; idx < oXmlProgrammas.length; idx++)
                {
                    var oXmlProgramma = oXmlProgrammas[idx];

                    // Add Programma Table.
                    var tblPgm  = document.createElement("table");
                    tblPgm.className = "programma";
                    tblPgm.setAttribute("cellspacing", "0");
                    tblPgm.setAttribute("cellpadding", "0");
                    var bodyPgm = document.createElement("tbody");

                    // Row.
                    var oPgmRow = document.createElement("tr");

                    // Cell.
                    var oPgmCell = document.createElement("td");
                    oPgmCell.className = "textonlyrightborder";
                    // Tekst.
                    if (oXmlProgramma.getAttribute("tekst"))
                    {
                        oPgmCell.innerText = oXmlProgramma.getAttribute("tekst");

                        // Document Hyperlink. 
                        if (oXmlProgramma.getAttribute("doc"))
                        {
                            oPgmCell.innerHTML += "  -  <a class='ablue' title='Programma " + oXmlProgramma.getAttribute("doc") + " downloaden' href='Files/Programmas/" + oXmlProgramma.getAttribute("doc") + "' target='_blank'>" + oXmlProgramma.getAttribute("doc") + "</a>";
                        }
                    }
                
                    oPgmRow.appendChild(oPgmCell);
                    bodyPgm.appendChild(oPgmRow);

                    // Add Table Programma to Div Programma.
                    tblPgm.appendChild(bodyPgm);
                    oElmDivProgramma.appendChild(tblPgm);


                    // Add Wedstrijden Table.
                    var tblWedStr  = document.createElement("table");
                    tblWedStr.className = "data";
                    tblWedStr.setAttribute("cellspacing", "0");
                    tblWedStr.setAttribute("cellpadding", "0");
                    var bodyWedStr = document.createElement("tbody");

                    // Row.
                    var oHeaderRow = document.createElement("tr");
                    oHeaderRow.className = "header";
                        
                    // Date.
                    var oCellHeaderDate = document.createElement("td");
                    oCellHeaderDate.className = "header";
                    oCellHeaderDate.width = 112;
                    oCellHeaderDate.innerText = "Datum";
                    oHeaderRow.appendChild(oCellHeaderDate);
                
                    // Wedstrijd.
                    var oCellHeaderWedstrijd = document.createElement("td");
                    oCellHeaderWedstrijd.className = "header";
                    oCellHeaderWedstrijd.width = 403;
                    oCellHeaderWedstrijd.innerText = "Wedstrijd";
                    oHeaderRow.appendChild(oCellHeaderWedstrijd);
                
                    // Uitslag.
                    var oCellHeaderUitslag = document.createElement("td");
                    oCellHeaderUitslag.className = "header";
                    oCellHeaderUitslag.width = 65;
                    oCellHeaderUitslag.setAttribute("align", "center");
                    oCellHeaderUitslag.innerText = "Uitslag";
                    oHeaderRow.appendChild(oCellHeaderUitslag);

                    // Verslag.
                    var oCellHeaderVerslag = document.createElement("td");
                    oCellHeaderVerslag.className = "header";
                    oCellHeaderVerslag.width = 65;
                    oCellHeaderVerslag.setAttribute("align", "center");
                    oCellHeaderVerslag.innerText = "Verslag";
                    oHeaderRow.appendChild(oCellHeaderVerslag);

                    // Add Header Row.
                    bodyWedStr.appendChild(oHeaderRow);

                    // Loop through Wedstrijden.
                    var oXmlWedstrijden = oXmlProgramma.getElementsByTagName("Wedstrijd");
                
                    for (var idy = 0; idy < oXmlWedstrijden.length; idy++)
                    {
                        var oXmlWedstrijd = oXmlWedstrijden[idy];
                        if (oXmlWedstrijd.getAttribute("datum") != null && oXmlWedstrijd.getAttribute("datum") != "")
                        {
                            // Creates a empty row.
                            var oRow = document.createElement("tr");
                            oRow.className = "data";
                        
                            // Date.
                            var oCellDate = document.createElement("td");
                            oCellDate.className = "data";
                            oCellDate.width = 112;
                            var sDate = oXmlWedstrijd.getAttribute("datum").split("-");
                            var dDate = new Date(parseInt(sDate[0], 10), parseInt(sDate[1], 10)-1, parseInt(sDate[2], 10));
                            if (!isNaN(dDate))
                            {
                                oCellDate.innerText = AddLeadingZero(dDate.getDate()).toString() + "-" + AddLeadingZero(dDate.getMonth() + 1).toString() + "-" + dDate.getFullYear().toString();  
                            }
                            else
                            {
                                oCellDate.innerText = sDate[2] + "-" + sDate[1] + "-" + sDate[0];
                            }
                            oRow.appendChild(oCellDate);
                        
                            // Wedstrijd.
                            var oCellWedstrijd = document.createElement("td");
                            oCellWedstrijd.className = "data";
                            oCellWedstrijd.width = 403;
                            if (oXmlWedstrijd.getAttribute("wedstrijd"))
                            {
                                oCellWedstrijd.innerText = oXmlWedstrijd.getAttribute("wedstrijd");
                            }
                            oRow.appendChild(oCellWedstrijd);
                        
                            // Uitslag.
                            var oCellUitslag = document.createElement("td");
                            oCellUitslag.className = "data";
                            oCellUitslag.width = 65;
                            oCellUitslag.setAttribute("align", "center");
                            if (oXmlWedstrijd.getAttribute("uitslag") != null && oXmlWedstrijd.getAttribute("uitslag").length > 0)
                            {
                                oCellUitslag.innerText = oXmlWedstrijd.getAttribute("uitslag");
                            }
                            else
                            {
                                oCellUitslag.style.border = "0";
                            }
                            oRow.appendChild(oCellUitslag);

                            // Verslag.
                            var oCellVerslag = document.createElement("td");
                            oCellVerslag.className = "data";
                            oCellVerslag.width = 65;
                            oCellVerslag.setAttribute("align", "center");
                            if (!isNaN(dDate) &&
                                dDate > _verslagDate &&
                                oXmlWedstrijd.getAttribute("uitslag") != null &&
                                oXmlWedstrijd.getAttribute("uitslag").length > 0) {

                                if (oXmlWedstrijd.getAttribute("verslag") != null && oXmlWedstrijd.getAttribute("verslag") === "1") {
                                    var onClick = "GotoWedstrijdverslagen(&quot;" + sDate[0] + AddLeadingZero(sDate[1]).toString() + AddLeadingZero(sDate[2]).toString() + "&quot;); return false;";
                                    oCellVerslag.innerHTML = "<a class='ablue' title='Ga naar Wedstrijdverslagen.' href='' target='' onclick='" + onClick + "'>verslag</a>";
                                }
                            }
                            else {
                                oCellVerslag.style.borderLeft = "0"
                                oCellVerslag.style.borderTop = "0"
                                oCellVerslag.style.borderBottom = "0"
                            }
                            oRow.appendChild(oCellVerslag);

                            // Add the row to the end of the table.
                            bodyWedStr.appendChild(oRow);
                        }
                        else
                        {
                            // Creates a empty row.
                            var oRow = document.createElement("tr");
                            oRow.className = "data";
                        
                            // Date.
                            var oCellDate = document.createElement("td");
                            oCellDate.className = "empty";
                            oCellDate.width = 112;
                            oCellDate.style.borderLeft = "solid windowtext 1.0pt";
                            oRow.appendChild(oCellDate);
                        
                            // Wedstrijd.
                            var oCellWedstrijd = document.createElement("td");
                            oCellWedstrijd.className = "empty";
                            oCellWedstrijd.width = 403;
                            oRow.appendChild(oCellWedstrijd);
                        
                            // Uitslag.
                            var oCellUitslag = document.createElement("td");
                            oCellUitslag.className = "empty";
                            oCellUitslag.width = 65;
                            oCellUitslag.setAttribute("align", "center");
                            oRow.appendChild(oCellUitslag);

                            // Verslag.
                            var oCellVerslag = document.createElement("td");
                            oCellVerslag.className = "emptyrightborder";
                            oCellVerslag.width = 65;
                            oCellVerslag.setAttribute("align", "center");
                            oRow.appendChild(oCellVerslag);

                            // Add the row to the end of the table.
                            bodyWedStr.appendChild(oRow);
                        }
                    }

                    // Add Table Wedstrijden to Div Programma.
                    tblWedStr.appendChild(bodyWedStr);
                    oElmDivProgramma.appendChild(tblWedStr);
                }
            })
            .catch(function (err) {
                console.error("OOPS, there was an error!", err.msg);
            });
        }
        catch(e) {}
    }
}

// Goto Wedstrijdverslagen function.
function GotoWedstrijdverslagen(wedstrijdverslag) {
    window.parent.ShowInformation(1, 'wedstrijdverslagen', wedstrijdverslag);
}