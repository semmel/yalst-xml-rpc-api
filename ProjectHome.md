# Preliminary Information - Do not use the API on a public website #

---

**Important!**
The techniques described in this project should not be used in public accessible web pages until a Public Client API for [yalst](http://yalst.de) is completed. This is because in part the API provides access to sensible data not intended to be used outside the live chat provider infrastructure.

---

This example demonstrates different Javascript clients for the **[yalst](http://yalst.de)** XML-RPC API.

Please see the documentation for explanations and reference of the API.

The web page `APIDemo.html` currently hosts three different flavours of querying the isBusy command of the **[yalst](http://yalst.de)** XML-RPC API:
  * using the [Mimic](http://mimic-xmlrpc.sourceforge.net) XML-RPC Javascript client
  * using jQuery's $.ajax command
  * using a handwritten AJAX request

Most recommended is the **Mimic** based method, since it handles both, the _construction_ of different complicated XML requests and the general _parsing_ of the XML-response. Mimic is dual licensed under the (liberal) MIT and the GPLv3 licenses.

Since Javascript lacks proper XML support both the other methods indeed just _mimic_ XML processing by squeezing DOM methods for XML construction.

At the time of writing [Cross-origin resource sharing (CORS)](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) i.e. accessing the API from a webpage on a domain different from the yalst server's still represents a problem for users of Internet Explorer who can not upgrade to version 10.

Following the steps in [this blog post](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx) you can implement a solution to support CORS down to Internet Explorer 8. However it is not straight forward an requires some experiments to get it eventually right.

Please contact us for our implementation of CORS API calls for IE8 +9.