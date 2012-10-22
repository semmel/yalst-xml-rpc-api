/**
 * xmlRpcPayload.js
 *
 * Created by Matthias Seemann on 3.09.2012.
 * Copyright (c) 2012 Visisoft GbR.
 *
 * Licensed under the MIT (http://opensource.org/licenses/mit-license.php)
 */

function createSimpleRequestPayload(config)
{
	return "<?xml version=\"1.0\" ?><methodCall>" +
		"<methodName>"	+ config.method + "</methodName>" +
		"<params><param><value><string>" + config.site + "</string></value></param>" +
		"<param><value><string>" + config.md5 + "</string></value></param></params></methodCall>";
}

function createRequestPayload(config)
{
	if (!document.implementation.createDocument || typeof XMLSerializer == "undefined")
	{
		/// support for outdated browsers
		return createRequestPayload(config);
	}
	else
	{
		var request = document.implementation.createDocument(null, 'methodCall', null);

		var methodName = document.implementation.createDocument(null, "methodName", null);
		methodName.documentElement.appendChild(document.createTextNode(config.method));

		var paramsNode = document.createElement("params");
		paramsNode.appendChild(createParamNode(config.site));
		paramsNode.appendChild(createParamNode(config.md5));

		request.documentElement.appendChild(methodName.documentElement);
		request.documentElement.appendChild(paramsNode);

		return '<?xml version="1.0" ?>' + new XMLSerializer().serializeToString(request);
	}
}

function createParamNode(data)
{
	var param = document.createElement("param");
	var valueNode = document.createElement("value");

	var value = document.createElement("string");
	if ('textContent' in value)
	{
		value.textContent = data;
	}
	else
	{
		value.innerText = data;
	}

	valueNode.appendChild(value);
	param.appendChild(valueNode);

	return param;
}

