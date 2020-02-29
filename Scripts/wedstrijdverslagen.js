// JScript File

// Window onload function.
window.onload = function() 
{
    var wedstrijdverslag = getQueryParamValue("default");

    // Build Wedstrijdverslagen Table.
    BuildWedstrijdverslagenTable(wedstrijdverslag);
}


// Build Wedstrijdverslagen Table.
function BuildWedstrijdverslagenTable(wedstrijdverslag)
{
    var oElm = document.getElementById("tblWedstrijdverslagen");
    if (oElm != null)
    {
        try
        {
            // Load Wedstrijdverslagen Xml.
            loadXMLDoc("Wedstrijdverslagen.xml")
            .then(function (oXml) {

                // Loop through Wedstrijdverslagen.
                var oXmlNodes = oXml.getElementsByTagName("Wedstrijdverslag");
                for (var idx = 0; idx < oXmlNodes.length; idx++)
                {
                    var oXmlNode = oXmlNodes[idx];
            
                    // Get Wedstrijdverslag Data.
                    var id = (oXmlNode.getAttribute("id") != null) ? oXmlNode.getAttribute("id") : "";
                    var datum = (oXmlNode.getAttribute("datum") != null) ? oXmlNode.getAttribute("datum") : "";
                    var wedstrijd = (oXmlNode.getAttribute("wedstrijd") != null) ? oXmlNode.getAttribute("wedstrijd") : "";
                    var text = "";
                    if (oXmlNode.getElementsByTagName("Tekst").length > 0) {
                        if (oXmlNode.getElementsByTagName("Tekst")[0].text)
                            text = oXmlNode.getElementsByTagName("Tekst")[0].text;
                        else
                            // Safari.
                            text = oXmlNode.getElementsByTagName("Tekst")[0].textContent;
                    }

                    // Creates a empty row.
                    var oRow = oElm.insertRow();
                    if (id |= "")
                        oRow.setAttribute("id", "tr" + id);

                    // Data.
                    var oCell = oRow.insertCell(-1);
                    oCell.className = "textonly";
                    oCell.setAttribute("vAlign", "top");

                    var verslagHTML = datum + "<br/>";
                    verslagHTML += "<strong><span>" + wedstrijd + "</span></strong><br/><br/>";
                    verslagHTML += text + "<br/><br/><br/>";
                    oCell.innerHTML = verslagHTML;

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

                // Scroll to Wedstrijdverslag.
                if (wedstrijdverslag) {
                    var row = document.getElementById("tr" + wedstrijdverslag);
                    if (row)
                        row.scrollIntoView();
                }
            })
            .catch(function (err) {
                console.error("OOPS, there was an error!", err.msg);
            });
        }
        catch(e) {}
    }
}
