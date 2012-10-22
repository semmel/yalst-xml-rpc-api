/**
 * apiCall.js
 *
 * successfully tested in Chrome 21, IE 10, FF 16 and Opera 12 using jQuery 1.8.0 and Mimic 2.2
 *
 * for Internet Explorer version <= 9.0 and cross-origin requests see
 * http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
 *
 * Get the Mimic XML-RPC library at http://mimic-xmlrpc.sourceforge.net
 *
 * Example configuration for isBusy command:
 *
 * var config = {
			url: 'http://yalst-test.visisoft.de/yalst/api.php',
			method: 'system.isBusy',
			site: '1-1',
			md5: '590a0017f14775be06dcd9afd05694c0'};
 *
 *
 * Created by Matthias Seemann on 30.08.2012.
 * Copyright (c) 2012 Visisoft GbR.
 *
 * Licensed under the MIT (http://opensource.org/licenses/mit-license.php)
 */

function callViaMimic(config, callback)
{
	var request = new XmlRpcRequest(config.url, config.method);
	request.addParam(config.site);
	request.addParam(config.md5);

	var response = request.send();

	var result = response.parseXML();

	if (response.faultValue)
	{
		callback("Error:" + result.faultString.toString());
	}
	else
	{
		var isBusy = result;

		callback("Operator is " + (isBusy ? "" : "not") + " busy.");
	}
}

function callViaJQuery(config, callback)
{
	var xmlPayload = createRequestPayload(config);

	$.ajax({type: 'POST'
		, url: config.url
		, data: xmlPayload
		, dataType: 'xml'
		, headers : {'Content-Type' : 'text/xml'}
		, error: function(responseData, status, error)
		{
			callback("Error:" + error + " (Status:" + status);
		}
		, success: function(responseData, status)
		{
			if (responseData.querySelector('methodResponse fault'))
			{
				callback("XMLRPC-API error:" + extractErrorStringFromRPCAnswer(responseData));
			}
			else
			{
				if (responseData.querySelector('methodResponse params param value boolean').firstChild.nodeValue == "1")
				{
					callback("Operator is busy.");
				}
				else
				{
					callback("Operator is not busy.");
				}
			}
		}
	});
}

function callViaAjax(config, callback)
{
	var xmlPayload = createRequestPayload(config);

	var xhr = new XMLHttpRequest();

	xhr.open('POST', config.url);
	xhr.setRequestHeader('Content-Type','text/xml');

	xhr.onerror = function(error)
	{
		console.log("error:" + error);
		callback(error);
	};
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4)
		{
			return;
		}

		if (xhr.status != 200)
		{
			callback("HTTP status:" + xhr.status);

			return;
		}

		try
		{
			var isBusy = null;
			var ieBrowser = navigator.userAgent.toLowerCase().match(/\bmsie\s([\w.]+)/);
			var type = xhr.getResponseHeader("Content-Type");
			if ((type.indexOf("xml") != -1) && xhr.responseXML && (!ieBrowser || (parseFloat(ieBrowser[1]) >= 10.0)))
			{
				if (xhr.responseXML.querySelector('methodResponse fault'))
				{
					throw new Error("XMLRPC-API error:" + extractErrorStringFromRPCAnswer(xhr.responseXML));
				}
				else
				{
					isBusy = (xhr.responseXML.querySelector('methodResponse params param value boolean').firstChild.nodeValue == "1");
				}
			}
			else
			{
				var faultInfo = xhr.responseText.match(/\bfaultString<\/name>\s*<value>\s*<string>([^<]*)<\/string>/);
				var resultInfo =
					xhr.responseText.match(/methodResponse>\s*<params>\s*<param>\s*<value>\s*<boolean>([^>]*)<\/boolean>/);
				if (faultInfo)
				{
					throw new Error("XMLRPC-API error: " + faultInfo[1]);
				}
				else if (resultInfo)
				{
					isBusy = (resultInfo[1] == "1");
				}
				else
				{
					throw new Error("XMLRPC-API error: Unknown fault");
				}
			}

			callback("Operator is " + (isBusy ? "" : "not") + " busy.");
		}
		catch(ex)
		{
			callback("Exception:" + ex);
		}
	};

	xhr.send(xmlPayload);
}

/// utility functions needed for jQuery and self-made ajax calls

function extractErrorStringFromRPCAnswer(answerDocument)
{
	var errorInfos = answerDocument.querySelectorAll('methodResponse fault value struct member');

	for (var i = 0; i < errorInfos.length; i++)
	{
		if (errorInfos[i].querySelector('name').firstChild.nodeValue == "faultString")
		{
			return errorInfos[i].querySelector('value string').firstChild.nodeValue;
		}
	}
	return "Unknown fault";
}