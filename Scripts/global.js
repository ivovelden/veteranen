// Document OnContextMenu event.
document.oncontextmenu = function()
{
    //return true;
	var _o = null;
	var _ret = false;

	_o = event.srcElement;
	if(_o != null)
	{
		if(_o.type == "text" && _o.disabled == false)
		{
			_ret = true;
		}
	}

    alert("IVO Veteranen.");
	return _ret;
}

// Load Xml Document.
function loadXMLDoc(xmlFileName, callback)
{
    return new Promise(function (resolve, reject) {
        var req = null;

        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest && !(window.ActiveXObject)) {
            try {
                req = new XMLHttpRequest();
            }
            catch (e) { reject({ msg: e.message }); }
        }
            // branch for IE/Windows ActiveX version
        else if (window.ActiveXObject) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { reject({ msg: e.message }); }
            }
        }

        req.onload = function () {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    resolve(req.responseXML);
                }
                else {
                    reject({ msg: req.statusText });
                }
            }
        };
        req.onerror = function () {
            reject({ msg: xhr.statusText });
        }; req.open("GET", "Data/" + xmlFileName, true);
        req.setRequestHeader("Content-Type", "text/xml");
        req.send();
    });
}


// Get Query String Parameter Value.
function getQueryParamValue(sParam)
{
    var query = window.location.search.substring(1); 
    var vars = query.split("&"); 
    for (var idx = 0; idx < vars.length; idx++)
    { 
        var pair = vars[idx].split("="); 
        if (pair[0] == sParam)
        {
            return pair[1];
        }
    } 
    
    return null;
} 

// Get Mededeling.
function getMededeling(bMarquee)
{
    return new Promise(function (resolve, reject) {
        var oMededeling = null;

        // Today.
        var dtToday = new Date()
        dtToday.setHours(0, 0, 0, 0);

        // Load Mededelingen Xml.
        loadXMLDoc("Mededelingen.xml")
        .then(function (oXml) {

            // Loop through Mededelingen.
            var oXmlMededelingen = oXml.getElementsByTagName("Mededeling");
            for (var idx = 0; idx < oXmlMededelingen.length; idx++) {
                var oXmlMededeling = oXmlMededelingen[idx];
                if (bMarquee) {
                    if (oXmlMededeling.getAttribute("marquee") != "1" && oXmlMededeling.getAttribute("marquee") != "2") continue;
                }
                else {
                    if (oXmlMededeling.getAttribute("marquee") != "0" && oXmlMededeling.getAttribute("marquee") != "2") continue;
                }
                var sDateFr = oXmlMededeling.getAttribute("datumvan").split("-");
                var dDateFr = new Date(parseInt(sDateFr[0], 10), parseInt(sDateFr[1], 10) - 1, parseInt(sDateFr[2], 10));
                var sDateTo = oXmlMededeling.getAttribute("datumtot").split("-");
                var dDateTo = new Date(parseInt(sDateTo[0], 10), parseInt(sDateTo[1], 10) - 1, parseInt(sDateTo[2], 10));
                if (dtToday >= dDateFr && dtToday < dDateTo) {
                    oMededeling = oXmlMededeling;
                    break;
                }
            }

            resolve(oMededeling);
        })
        .catch(function (err) {
            console.error("OOPS, there was an error!", err.msg);
            resolve(null);
        });
    });
}

// Get Volgende Wedstrijd.
function getVolgendeWedstrijd()
{
    return new Promise(function (resolve, reject) {
        var oNextWedstrijd = null;

        // Today.
        var dtToday = new Date()
        dtToday.setHours(0, 0, 0, 0);

        // Load Programma Xml.
        loadXMLDoc("Programma.xml")
        .then(function (oXml) {

            // Loop through Programma/Wedstrijden.
            var oXmlProgrammas = oXml.getElementsByTagName("Wedstrijden");
            for (var idx = 0; idx < oXmlProgrammas.length; idx++) {
                var oXmlProgramma = oXmlProgrammas[idx];

                // Loop through Wedstrijden.
                var oXmlWedstrijden = oXmlProgramma.getElementsByTagName("Wedstrijd");
                for (var idy = 0; idy < oXmlWedstrijden.length; idy++) {
                    var oXmlWedstrijd = oXmlWedstrijden[idy];
                    if (oXmlWedstrijd.getAttribute("marquee") == null || oXmlWedstrijd.getAttribute("marquee") == "1") {
                        var sDate = oXmlWedstrijd.getAttribute("datum").split("-");
                        var dDate = new Date(parseInt(sDate[0], 10), parseInt(sDate[1], 10) - 1, parseInt(sDate[2], 10));
                        if (dDate.setDate(dDate.getDate() + 1) > dtToday) {
                            oNextWedstrijd = oXmlWedstrijd;
                            break;
                        }
                    }
                }
                if (oNextWedstrijd != null) break;
            }

            resolve(oNextWedstrijd);
        })
        .catch(function (err) {
            console.error("OOPS, there was an error!", err.msg);
            resolve(null);
        });
    });
}

function AddLeadingZero(i)
{
    if (i < 10) 
    {
        i = "0" + i;
    }
    return i;
}

// Dagen.
var day_names = new Array ( );
day_names[day_names.length] = "zondag";
day_names[day_names.length] = "maandag";
day_names[day_names.length] = "dinsdag";
day_names[day_names.length] = "woensdag";
day_names[day_names.length] = "donderdag";
day_names[day_names.length] = "vrijdag";
day_names[day_names.length] = "zaterdag";

// Maanden.
var month_names = new Array ( );
month_names[month_names.length] = "januari";
month_names[month_names.length] = "februari";
month_names[month_names.length] = "maart";
month_names[month_names.length] = "april";
month_names[month_names.length] = "mei";
month_names[month_names.length] = "juni";
month_names[month_names.length] = "juli";
month_names[month_names.length] = "augustus";
month_names[month_names.length] = "september";
month_names[month_names.length] = "oktober";
month_names[month_names.length] = "november";
month_names[month_names.length] = "december";

