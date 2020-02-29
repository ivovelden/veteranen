// JScript File

// Window onload function.
window.onload = function() 
{
    var koffiemet = getQueryParamValue("default");

    // Build KoffieMetBacks Table.
    BuildKoffieMetBacksTable(koffiemet);
}

// Select KoffieMetBacks onchange event handler.
function onKMBacksSelected() {
    var koffiemet = document.getElementById("selKMBacks").value;

    ////var options = document.getElementById("selKMBacks").options;
    ////for (var idx = 0; idx < options.length; idx++) {
    ////    if (options[idx].selected)
    ////        options[idx].selected = false;
    ////}
    window.focus();

    ScrollToKoffieMetBack(koffiemet);
}

// Build KoffieMetBacks Table.
function BuildKoffieMetBacksTable(koffiemet) {
    var oElm = document.getElementById("tblKoffieMetBacks");
    if (oElm != null)
    {
        try
        {
            // Get KoffieMetBacks select list.
            var oElmSelect = document.getElementById("selKMBacks");

            // Load tblKoffieMetBacks Xml.
            loadXMLDoc("KoffieMetBacks.xml")
            .then(function (oXml) {

                // Loop through KoffieMetBacks.
                var oXmlNodes = oXml.getElementsByTagName("KoffieMetBack");
                for (var idx = 0; idx < oXmlNodes.length; idx++)
                {
                    var oXmlNode = oXmlNodes[idx];
            
                    // Get KoffieMetBacks Data.
                    var id = (oXmlNode.getAttribute("id") != null) ? oXmlNode.getAttribute("id") : "";
                    var naam = (oXmlNode.getAttribute("naam") != null) ? oXmlNode.getAttribute("naam") : "";
                    var periode = (oXmlNode.getAttribute("periode") != null) ? oXmlNode.getAttribute("periode") : "";
                    var text = "";
                    if (oXmlNode.getElementsByTagName("Tekst").length > 0) {
                        if (oXmlNode.getElementsByTagName("Tekst")[0].text)
                            text = oXmlNode.getElementsByTagName("Tekst")[0].text;
                        else
                            // Safari.
                            text = oXmlNode.getElementsByTagName("Tekst")[0].textContent;
                    }

                    // Add select option.
                    var opt = document.createElement("option");
                    opt.value = id;
                    opt.text = "Koffie met 'backs' - Editie " + periode + " met " + naam;
                    opt.style.fontSize = "26px;"
                    oElmSelect.add(opt);
                    if (id == koffiemet)
                        oElmSelect.value = id;

                    // Creates a empty row.
                    var oRow = oElm.insertRow();
                    if (id != "")
                        oRow.setAttribute("id", "tr" + id);

                    // Data.
                    var oCell = oRow.insertCell(-1);
                    oCell.className = "textonly";
                    oCell.setAttribute("vAlign", "top");

                    var koffieMetHTML = "<strong><span style='font-size: 20px; text-decoration: underline;'>Koffie met ... " + naam + "</span></strong><br/><br/>";
                    koffieMetHTML += text + "<hr><hr><br/>";
                    oCell.innerHTML = koffieMetHTML;

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

            // Scroll to KoffieMetBack.
            ScrollToKoffieMetBack(koffiemet);
        }
        catch(e) {}
    }
}

// Scroll to KoffieMetBack.
function ScrollToKoffieMetBack(koffiemet) {
    if (koffiemet) {
        var row = document.getElementById("tr" + koffiemet);
        if (row) {
            row.scrollIntoView();
            document.getElementById("containerScrollable").style.marginTop = "0px";
            setTimeout(function () { document.getElementById("containerScrollable").style.marginTop = "84px"; }, 20);
        }
    }
}