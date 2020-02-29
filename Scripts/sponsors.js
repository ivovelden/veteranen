// JScript File
//function window.onload()
window.onload = function()
{
    // Build Sponsors Table.
    BuildSponsorsTable();
}


// Build Sponsors Table.
function BuildSponsorsTable()
{
    var oElmCenterSponsors = document.getElementById("centerSponsors");
    if (oElmCenterSponsors != null)
    {
        try
        {
            // Load Sponsors Xml.
            loadXMLDoc("Sponsors.xml")
            .then(function (oXml) {

                // Loop random through the Sponsors.
                var oXmlSponsors = oXml.getElementsByTagName("Sponsor");

                var arrSponsors = new Array(oXmlSponsors.length);
                for (var idx = 0; idx < oXmlSponsors.length; idx++)
                    arrSponsors[idx] = idx;
                arrSponsors.sort(function () { return 0.5 - Math.random() });

                // Add Sponsors Table.
                var tblSpon = document.createElement("table");
                tblSpon.cellSpacing = 10;
                tblSpon.cellPadding = 0;
                var bodySpon = document.createElement("tbody");

                for (var idx = 0; idx < arrSponsors.length; idx++)
                {
                    var oXmlSponsor = oXmlSponsors[arrSponsors[idx]];

                    // Row.
                    var oSponRow = document.createElement("tr");

                    // Logo Cell.
                    var oSponLogoCell = document.createElement("td");
                    oSponLogoCell.vAlign = "top";
                    // Logo.
                    var oSponImg = document.createElement("img");
                    oSponImg.src = "Images/" + oXmlSponsor.getAttribute("logo");
                    oSponImg.alt = oXmlSponsor.getAttribute("naam");
                    oSponLogoCell.appendChild(oSponImg);

                    oSponRow.appendChild(oSponLogoCell);

                    // NAW Cell.
                    var oSponNAWCell = document.createElement("td");
                    oSponNAWCell.vAlign = "top";
                    oSponNAWCell.style.color = "White";
                    oSponNAWCell.style.paddingLeft = "25";

                    // NAW Text Node.
                    oSponNAWCell.appendChild(document.createTextNode(oXmlSponsor.getAttribute("naam")));
                    oSponNAWCell.appendChild(document.createElement("br"));
                    oSponNAWCell.appendChild(document.createTextNode("Tel: " + oXmlSponsor.getAttribute("telefoon")));
                    oSponNAWCell.appendChild(document.createElement("br"));
                    oSponNAWCell.appendChild(document.createTextNode("Site: "));
                    if (oXmlSponsor.getAttribute("website") && oXmlSponsor.getAttribute("website").length > 0)
                    {
                        var oSponSite = document.createElement("a");
                        oSponSite.href = oXmlSponsor.getAttribute("website");
                        oSponSite.target = "_blank";
                        oSponSite.innerHTML = oXmlSponsor.getAttribute("website");
                        oSponNAWCell.appendChild(oSponSite);
                    }

                    oSponRow.appendChild(oSponNAWCell);
                    bodySpon.appendChild(oSponRow);
                }

                tblSpon.appendChild(bodySpon);
                oElmCenterSponsors.appendChild(tblSpon);
            })
            .catch(function (err) {
                console.error("OOPS, there was an error!", err.msg);
            });
        }
        catch(e) {}
    }
}
