/**
  * Utility to enable minor checks & mail using cordys send mail service
  * @author venky
  * @since 1382099869
  * @method
  */
var _nameSpace = {"wsns1":"http://schemas.cordys.com/1.0/email"};
/**
  * Method to remove white spaces in a string
  * @param {String}
  * @returns {String}
  */
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, '');};
/**
  * Sends mail using cordys send mail service
  * @param {{name: string, email: string}} sender Object holding Sender name and email ID
  * @param {{name: string, email: string}[]} receivers Object holding details of all Receivers (to)
  * @param {{name: string, email: string}[]} copies Object holding details of all Receivers to copy to(cc)
  * @param {{subject: string, body: string}} matter Object holding subject and body to email
  * @param {Model} carrier Generic/Common/Specific Model to send email
  * @return {boolean} 
  */
function mail(sender,receivers,copies,matter,carrier)
{
	var request = cordys.loadXMLDocument("<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Body><SendMail xmlns='http://schemas.cordys.com/1.0/email'><to><address><emailAddress></emailAddress><displayName></displayName></address></to><cc><address><displayName></displayName><emailAddress></emailAddress></address></cc><subject></subject><body type='normal'></body><from><displayName></displayName><emailAddress></emailAddress><replyTo></replyTo></from></SendMail></SOAP:Body></SOAP:Envelope>").documentElement;

	cordys.setNodeText(request,".//wsns1:from/wsns1:emailAddress",sender.email,_nameSpace);
	cordys.setNodeText(request,".//wsns1:from/wsns1:displayName",sender.name,_nameSpace);
	cordys.setNodeText(request,".//wsns1:from/wsns1:replyTo",(available(sender.replyTo))?sender.replyTo:sender.email,_nameSpace);

	addReceivers(request,receivers,"to");
	addReceivers(request,copies,"cc");
	
	cordys.setNodeText(request,".//wsns1:subject",matter.subject,_nameSpace);
	cordys.setNodeText(request,".//wsns1:body",matter.body,_nameSpace);

	carrier.setMethodRequest(request.ownerDocument);
	carrier.reset();
	return true;
}
/**
  * Adds receivers (to & cc) to mail request xml
  * @param {xml} request Object holding mail request xml
  * @param {{name: string, email: string}[]} receivers Object holding details of all Receivers (to)
  * @param {string} blockName String indicating the position to addd receivers
  * @return {boolean} 
  */
function addReceivers(request,receivers,blockName)
{
  var blockBase = cordys.selectXMLNode(request,".//wsns1:"+blockName,_nameSpace);
  var blockHold = cordys.selectXMLNode(blockBase,".//wsns1:address",_nameSpace);
  var blockTemplate = blockHold.cloneNode(true); 
  blockHold.parentNode.removeChild(blockHold);

  for (var i = receivers.length - 1; i >= 0; i--) {
    var block = blockTemplate.cloneNode(true);
    cordys.setNodeText(block,".//wsns1:emailAddress",receivers[i].email,_nameSpace);
    cordys.setNodeText(block,".//wsns1:displayName",receivers[i].name,_nameSpace);  
    cordys.appendXMLNode(block,blockBase);
  };
  return true;
}
/**
  * Checks if a variable has any valid value
  * @param {string} testee Variable to be Tested
  * @return {boolean} 
  */
function available(testee){return ((testee.trim().length==0)||(testee==undefined)||(!testee))?false:true;}