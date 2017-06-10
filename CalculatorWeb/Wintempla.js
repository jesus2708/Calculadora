/**************************************************************************
THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
PARTICULAR PURPOSE.  I ACCEPT NO LIABILITY FOR ANY DAMAGE OR LOSS
OF BUSINESS THAT THIS SOFTWARE MAY CAUSE.

Wintempla.js
 
© Copyright 2000 - 2017 Sergio Ledesma.  All Rights Reserved.

THIS CODE IS PROTECTED BY COPYRIGHT LAW AND INTERNATIONAL TREATIES.
UNAUTHORIZED REPRODUCTION OR DISTRIBUTION OF THIS CODE, OR ANY PORTION
OF IT, MAY RESULT IN SEVERE CIVIL AND CRIMINAL PENALTIES, AND WILL BE
PROSECUTED TO THE MAXIMUM EXTENT POSSIBLE UNDER THE LAW.

ESTE CODIGO ESTA PROTEGIDO POR LAS LEYES Y TRATADOS DE DERECHO AUTOR
INTERNACIONALES.  LA REPRODUCCION SIN AUTORIZACION O LA DISTRIBUCION
DE ESTE CODIGO, O CUALQUIER PARTE DE ESTE, RESULTARA EN SEVERA
PENALIDAD CIVIL Y CRIMINAL, Y SERA PERSEGUIDA HASTA SU MAXIMA 
EXTENSION BAJO LO QUE PERMITA LA LEY.
***************************************************************************/

//______________________________________________________________________________ SyncAll
function SyncAll(urlBasic, sourceID, eventID) 
{
	//________________________________________________________ Show Progress Bar
	var webProgressBar = window.document.getElementById("WebProgressBar");
	if (webProgressBar != null) webProgressBar.style.visibility = 'visible'; 
	//________________________________________________________ Get an HTTP Request: xmlHttp
	var xmlHttp = null;
	if (window.XMLHttpRequest != null)
	{
		xmlHttp = new XMLHttpRequest();
	}
	else
	{
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlHttp == null) return;

	xmlHttp.onreadystatechange = function () 
	{
		//xmlHttp.readyState.1  The request has been set up
		//xmlHttp.readyState.2  The request has been sent
		//xmlHttp.readyState.3  The request is in process
		if (xmlHttp.readyState == 0) // xmlHttp.readyState = 0.  The request is not initialized
		{
			alert('xmlHttp: The request is not initialized');
		}
		else if (xmlHttp.readyState == 4) // xmlHttp.readyState = 4. The request is complete
		{
			if (xmlHttp.status == 200) // HTTP code: 200 OK
			{
				xmlHttp.responseXML.preserveWhiteSpace = true;
				//_________________________________________________________________ Hide Progress Bar
				if (webProgressBar != null) webProgressBar.style.visibility = 'hidden'; 
				var control = xmlHttp.responseXML.documentElement.getElementsByTagName("c");
				//alert("RECEIVE\n" + xmlHttp.responseText);
				LoadControls(control);
			}
			else // HTTP code: Error
			{
				alert('Invalid HTTP request\nxmlHttp.readyState=' + xmlHttp.readyState.toString() + '\nxmlHttp.status=' + xmlHttp.status.toString());
			}
		}
	}
		
	//__________________________________________________________________ Prepare the HTTP Request
	var mainForm = window.document.getElementById("formMain");
	if (mainForm == null) return;
	var xmlText = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><gui>";
	var count = mainForm.elements.length;
	var i;
	var createNode = false;
	for (i = 0; i < count; i++) 
	{
		tagName = mainForm.elements[i].tagName.toLowerCase();
		createNode = false;
		//____________________________________________________________________ textarea
		if (tagName == "textarea") 
		{
			createNode = true;
			xmlText += "<c><id>";
			xmlText += mainForm.elements[i].id;
			xmlText += "</id><d>";
			xmlText += ToXml(mainForm.elements[i].value);
			xmlText += "</d>";
		}
		//____________________________________________________________________ select
		else if (tagName == "select") 
		{
			createNode = true;
			xmlText += "<c><id>";
			xmlText += mainForm.elements[i].id;
			xmlText += "</id>";
			try
			{
				selectItems = mainForm.elements[i];
				itemCount = selectItems.options.length;
				for(j = 0; j < itemCount; j++)
				{
					//xmlText += encodeURIComponent(selectItems.options[j].text);
					if (selectItems.options[j].selected == true)
					{
						xmlText += "<d>";
						xmlText += ToXml(selectItems.options[j].value);
						xmlText += "</d>";
					}
				}
			}
			catch(errorInfo)
			{
			}
		}
		//____________________________________________________________________ input
		else if (tagName == "input") 
		{
			tagType = mainForm.elements[i].type.toLowerCase();
			if (tagType == "text" || tagType == "hidden" || tagType == "password") 
			{
				createNode = true;
				xmlText += "<c><id>";
				xmlText += mainForm.elements[i].id;
				xmlText += "</id><d>";
				xmlText += ToXml(mainForm.elements[i].value);
				xmlText += "</d>";
				if (tagType == "text")
				{
					if (mainForm.elements[i].readOnly != null && mainForm.elements[i].readOnly == true)
					{
						xmlText += "<ro>true</ro>";
					}
				}
			}
			else if (tagType == "checkbox") 
			{
				createNode = true;
				xmlText += "<c><id>";
				xmlText += mainForm.elements[i].id;
				xmlText += "</id>";
				if (mainForm.elements[i].checked == true)  xmlText += "<ck>true</ck>";
			}
				else if (tagType == "radio") 
			{
				createNode = true;
				xmlText += "<c><id>";
				xmlText += mainForm.elements[i].id;
				xmlText += "</id>";
				if (mainForm.elements[i].checked == true)  xmlText += "<ck>true</ck>";
				//if (mainForm.elements[i].value != null)
				//{
				//	if (mainForm.elements[i].value.length > 0)
				//	{
				//		xmlText += "<d>";
				//		xmlText += ToXml(mainForm.elements[i].value);
				//		xmlText += "</d>";
				//	}
				//}
			}
			else if (tagType == "hidden") 
			{
				createNode = true;
				xmlText += "<gui><id>";
				xmlText += mainForm.elements[i].id;
				xmlText += "</id><d>";
				xmlText += ToXml(mainForm.elements[i].value);
				xmlText += "</d>";
			}
			else if (tagType == "button") 
			{
				createNode = true;
				xmlText += "<c><id>";
				xmlText += mainForm.elements[i].id;
				xmlText += "</id><d>";
				xmlText += ToXml(mainForm.elements[i].value);
				xmlText += "</d>";
			}
		}
		if (createNode == true)
		{
			var properties = GetElementPropertiesXml(mainForm.elements[i]);
			if (properties != null)
			{
				if (properties.length > 0) xmlText += GetElementPropertiesXml(mainForm.elements[i]);
			}
			xmlText += "</c>";
		}
	}
	xmlText += "</gui>";
	//alert("SEND\n" + xmlText);
	//_________________________________________________ POST
	var urlRequest = "http://";
	urlRequest += urlBasic;
	urlRequest += "?ajax=true&sourceID=";
	urlRequest += sourceID;
	urlRequest += "&eventID=";
	urlRequest += eventID;
	xmlHttp.open("POST", urlRequest, true);
	xmlHttp.setRequestHeader('Content-Type', 'text/xml');
	xmlHttp.setRequestHeader('Content-Length', xmlText.length);
	xmlHttp.setRequestHeader("Connection", "close");
	xmlHttp.send(xmlText);
	//_________________________________________________ GET
	//xmlHttp.open("GET", urlEncodedRequest, true);
	//xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//xmlHttp.setRequestHeader('Content-Length', '0');
	//xmlHttp.setRequestHeader("Connection", "close");
	//xmlHttp.send();
}

function GetElementPropertiesXml(guiElement)
{
	var text;
	//_________________________________________________ Enabled
	if (guiElement.disabled ==null)
	{
		text = "";
	}
	else
	{
		if (guiElement.disabled == true) text = "<en>false</en>";
	}
	if (guiElement.style == null) return text;
	//_______________________________________________ background-color
	if (guiElement.style.backgroundColor != null && guiElement.style.backgroundColor.length > 0)
	{
		text += "<bc>";
		text += guiElement.style.backgroundColor;
		text += "</bc>";
	}
	//_______________________________________________ border-color
	if (guiElement.style.borderColor != null && guiElement.style.borderColor.length > 0)
	{
		text += "<bo>";
		text += guiElement.style.borderColor;
		text += "</bo>";
	}
	//_______________________________________________ color
	if (guiElement.style.color != null && guiElement.style.color.length > 0)
	{
		text += "<co>";
		text += guiElement.style.color;
		text += "</co>";
	}
	//_______________________________________________ border-width
	if (guiElement.style.borderWidth != null && guiElement.style.borderWidth.length > 0)
	{
		text += "<bw>";
		text += guiElement.style.borderWidth;
		text += "</bw>";
	}
	//_______________________________________________ cursor
	if (guiElement.style.cursor != null && guiElement.style.cursor.length > 0)
	{
		text += "<cu>";
		text += guiElement.style.cursor;
		text += "</cu>";
	}
	//_______________________________________________ visibility
	if (guiElement.style.visibility != null && guiElement.style.visibility.length > 0)
	{
		text += "<vi>";
		text += guiElement.style.visibility;
		text += "</vi>";
	}
	return text;
}

function ToXml(input)
{
	var len = input.length;
	if (len == 0) return "";
	var output ="";
	var i;
	for(i = 0; i < len; i++)
	{
		switch(input.charAt(i))
		{
		case '&':
			output += "&amp;";
			break;
		case '<':
			output += "&lt;";
			break;
		case '>':
			output += "&gt;";
			break;
		case '%':
			output += "&#37;";
			break;
		case '\'':
			output += "&apos;";
			break;
		case '\"':
			output += "&quot;";
			break;
		default:
			output += input.charAt(i);
		}
	}
	return output;
}

//__________________________________________________________________ LoadControls
function LoadControls(control)
{
	var count = control.length;
	if (count == 0) return;
	var i, j;
	//_____________________
	var pid = null;
	var ptype = null;
	var pvalue = null;
	var p = null;
	//_____________________
	var controlID = null;
	var controlType = null;
	var controlValue = null;
	var controlP = null;
	//_____________________
	var optionList = null;
	var optionName = null;
	var optionValue = null;
	var optionSelected = null;
	//
	var control;
	var guiControl;
	for (i = 0; i < count; i++) 
	{
		pid = control[i].getElementsByTagName("id");
		ptype = control[i].getElementsByTagName("tp"); //type
		try 
		{
			controlID = pid[0].firstChild.nodeValue;
			controlType = ptype[0].firstChild.nodeValue;	
		}
		catch (errorInfo) 
		{
			continue;
		}
		if (controlType == "MB") //______________________________ MessageBox
		{
			try
			{
				pvalue = control[i].getElementsByTagName("d");
				if (pvalue == null) continue;
				controlValue = pvalue[0].firstChild.nodeValue;
				if (controlValue == null) continue;
				//
				alert(controlValue);
				continue;
			}
			catch(errorInfo){continue;}
		}
		guiControl = window.document.getElementById(controlID);
		if (guiControl == null) continue;
		//__________________________________________________________ Enabled
		try
		{
			p = control[i].getElementsByTagName("en");
			if (p != null)
			{
				controlP = p[0].firstChild.nodeValue;
				if (controlP != null)
				{
					if (controlP == "true")
					{
						guiControl.disabled = false;
					}
					else
					{
						guiControl.disabled = true;
					}
				}
			}
		}
		catch(errorInfo){}
		//________________________________________________________________________ CSS
		//__________________________________________________________ background-color
		try
		{
			p = control[i].getElementsByTagName("bc");
			if (p != null)
			{
				controlP = p[0].firstChild.nodeValue;
				if (controlP != null) guiControl.style.backgroundColor = controlP;
			}
		}
		catch(errorInfo){}
		//__________________________________________________________ border-color
		try
		{
			p = control[i].getElementsByTagName("bo");
			if (p != null)
			{
				controlP = p[0].firstChild.nodeValue;
				if (controlP != null) guiControl.style.borderColor = controlP;
			}
		}
		catch(errorInfo){}
		//__________________________________________________________ color
		try
		{
			p = control[i].getElementsByTagName("co");
			if (p != null)
			{
				controlP= p[0].firstChild.nodeValue;
				if (controlP != null) guiControl.style.color = controlP;
			}
		}
		catch(errorInfo){}
		//__________________________________________________________ border-width
		try
		{
			p = control[i].getElementsByTagName("bw");
			if (p != null)
			{
				controlP= p[0].firstChild.nodeValue;
				if (controlP != null) guiControl.style.borderWidth = controlP;
			}
		}
		catch(errorInfo){}
		//__________________________________________________________ cursor
		try
		{
			p = control[i].getElementsByTagName("cu");
			if (p != null)
			{
				controlP= p[0].firstChild.nodeValue;
				if (controlP != null) guiControl.style.cursor = controlP;
			}
		}
		catch(errorInfo){}
		//__________________________________________________________ visibility
		try
		{
			p = control[i].getElementsByTagName("vi");
			if (p != null)
			{
				controlP = p[0].firstChild.nodeValue;
				if (controlP != null)
				{
					if (controlP == "visible")
					{
						guiControl.style.visibility = "visible";
					}
					else
					{
						guiControl.style.visibility = "hidden";
					}
				}
			}
		}
		catch(errorInfo){}
		//________________________________________________________________________ CONTROLS
		if (controlType == "CB" || controlType == "RB") //_______________________________ CheckBox or RadioButton
		{
			try 
			{
				pvalue = control[i].getElementsByTagName("ck");
				if (pvalue == null) continue;
				controlValue = pvalue[0].firstChild.nodeValue;
				if (controlValue == null) continue;
				guiControl.checked = (controlValue == "true") ? true : false;
			}
			catch (errorInfo) 
			{
				continue;
			}
		}
		else if (controlType == "SE") //______________________________DropDownList, ListBox, ListView
		{
			optionList = control[i].getElementsByTagName("o");
			if (optionList == null) continue; // Error
			optionCount = optionList.length;
			guiControl.options.length = 0; // Remove previous items
			prevOption = null;
			for (j = 0; j < optionCount; j++) 
			{
				optionName = optionList[j].getElementsByTagName("n"); // name
				optionValue = optionList[j].getElementsByTagName("v"); // value
 				optionSelected = optionList[j].getElementsByTagName("s"); // selected
				try 
				{
					newOption = document.createElement('option');
					optionText = optionName[0].firstChild.nodeValue;
					newOption.text = unescape(optionText.replace(/ /g, "%A0"));
					newOption.value = optionValue[0].firstChild.nodeValue;
					newOption.selected = (optionSelected[0].firstChild.nodeValue == "true");
				}
				catch (errorInfo) 
				{
					continue;
				}
				try 
				{
					guiControl.options.add(newOption, j);
				}
				catch (errorInfo) 
				{
				}
			}
		}
		else if (controlType == "TB") //______________________________ Textbox
		{
			//___________________ readOnly
			try
			{
				p = control[i].getElementsByTagName("ro");
				if (p != null)
				{
					controlP = p[0].firstChild.nodeValue;
					if (controlP != null)
					{
						if (controlP == "true")
						{
							guiControl.readOnly = true;
						}
						else
						{
							guiControl.readOnly = false;
						}
					}
				}
			}
			catch(errorInfo){}
			//____________ value
			try 
			{
				pvalue = control[i].getElementsByTagName("d");
				if (pvalue == null) continue; //____________________________ Nothing to do (text did not change)
				controlValue = pvalue[0].firstChild.nodeValue;
				if (controlValue == null) continue;
				if (controlValue == "&nbsp;") //____________________________ Clear text
				{
					guiControl.value = "";
					continue;
				}
				//_____________________________________________________ Update text
				guiControl.value = controlValue;
			}
			catch (errorInfo) 
			{
				continue;
			}
		}
		else if (controlType == "HI") //______________________________ Hidden
		{
			try 
			{
				pvalue = control[i].getElementsByTagName("d");
				if (pvalue == null) continue;
				controlValue = pvalue[0].firstChild.nodeValue;
				if (controlValue == null) continue;
				//
				if (guiControl.value == controlValue) continue;
				guiControl.value = controlValue;
			}
			catch (errorInfo) 
			{
				continue;
			}
		}
		else if (controlType == "TX") //_______________________________ Text (It handles: span, div, p, ... )
		{
			try 
			{
				pvalue = control[i].getElementsByTagName("ih"); //innerHtml
				if (pvalue == null) continue;
				controlValue = pvalue[0].firstChild.nodeValue;
				if (controlValue == null) continue;
				if (controlValue == "&nbsp;")
				{
					guiControl.innerHTML = "";
					guiControl.innerText = "";
					continue;
				}
				//
				if (guiControl.innerHTML == controlValue) continue;
				guiControl.innerText = "";
				guiControl.innerHTML = controlValue;
			}
			catch (errorInfo) 
			{
				continue;
			}
		}
		//else if (controlType == "Button") //_______________________________ Button
		//{
		//}
	}
}


//__________________________________________________________________ LoadCalendar
function LoadCalendar(tbxID, monthsText) 
{
    //____________________________________ Find the current date  
    var dateCurrent = new Date;
    var selectedMonth = dateCurrent.getMonth();
    var selectedYear = dateCurrent.getYear();
    var selectedDay = dateCurrent.getDate();
	var tbxDate = window.opener.document.getElementById(tbxID);
    if (tbxDate != null) 
    {
        if (tbxDate.value.length == 11) 
        {
            selectedDay = GetDayNumber(tbxDate.value);
            selectedMonth = GetMonthNumber(tbxDate.value, monthsText);
            selectedYear = GetYearNumber(tbxDate.value);
            dateCurrent.setMonth(selectedMonth);
            dateCurrent.setDate(selectedDay);
            dateCurrent.setFullYear(selectedYear);
        }
    }
	//__________________________________ Select month
	var ddMonth = window.document.getElementById("DropDownMonth");
	if (ddMonth != null) ddMonth.value = selectedMonth;
	//__________________________________ Select year
	var tbxYear = window.document.getElementById("TextBoxYear");
	if (tbxYear != null) tbxYear.value = selectedYear;
    CalendarUpdateSelection(window, selectedDay, selectedMonth, selectedYear);
}

//__________________________________________________________________ GetYearNumber
function GetYearNumber(strDate) 
{
	var dateLength = strDate.length;
	if (dateLength < 11) return 2014;
	strYear = strDate.substring(7, 11);
	return parseInt(strYear);
}

//__________________________________________________________________ GetMonthNumber
function GetMonthNumber(strDate, monthsText) 
{
	var dateLength = strDate.length;
	if (dateLength < 4) return 1;
	//
	var monthsLength = monthsText.length;
	if (monthsLength <= 0) return 1;
	var text = strDate.substring(0, 3);
	var i;
	var offset;
	for (i = 0; i < 12; i++)
	{
		offset = 3 * i;
		if (monthsText[offset] != text[0]) continue;
		if (monthsText[offset + 1] != text[1]) continue;
		if (monthsText[offset + 2] != text[2]) continue;
		return i;
	}
	return 1;
}

//__________________________________________________________________ GetDayNumber
function GetDayNumber(strDate) 
{
	var dateLength = strDate.length;
	if (dateLength < 6) return 1;
	var strDay = strDate.substring(4, 6);
	return parseInt(strDay);
}

//__________________________________________________________________ CalendarUpdateSelection
function CalendarUpdateSelection(win, selectedDay, selectedMonth, selectedYear)
{
	var dateA = new Date;
	dateA.setMonth(selectedMonth);
	dateA.setYear(selectedYear);
	dateA.setDate(selectedDay);
	//________________________________ We find the first day of the month
	dateA.setDate(1);
	//________________________________ We find the first Sunday on the calendar
	while (dateA.getDay() != 0) 
	{
		dateA.setDate(dateA.getDate() - 1);
	}
	var strId = "";
	var pButton = null;

	var row = 0;
	var column = 0;
	for (row = 0; row < 6; row++) 
	{
        for (column = 0; column < 7; column++) 
        {
			strId = "ButtonCa" + row + column;
			pButton = win.document.getElementById(strId);
			if (pButton != null) 
			{
				pButton.value = dateA.getDate();
				try
				{
					if ((dateA.getDate() == selectedDay) && (dateA.getMonth() == selectedMonth) && (dateA.getFullYear() == selectedYear)) 
					{
						pButton.style.color = "rgb(0, 0, 255)";
						pButton.style.fontWeight = "900";
						pButton.disabled = false;
					}
					else 
					{
						if (dateA.getMonth() == selectedMonth)
						{
							pButton.style.color = "rgb(0, 0, 0)";
							pButton.style.fontWeight = "normal";
							pButton.disabled = false;
						}
						else
						{
							pButton.style.color = "rgb(180, 180, 180)";
							pButton.style.fontWeight = "normal";
							pButton.disabled = true;
						}
					}
				}
				catch(errorInfo)
				{
				}
				dateA.setDate(dateA.getDate() + 1);
			}
		}
	}
}

//__________________________________________________________________ UpdateMonth
function UpdateMonth() 
{
    var tbxYear = window.document.getElementById('TextBoxYear');
    if (tbxYear == null) return;
    var currentYear = parseInt(tbxYear.value);
    //
    var ddMonth = window.document.getElementById('DropDownMonth');
    if (ddMonth == null) return;
    CalendarUpdateSelection(window, 1, ddMonth.value, currentYear);
}

//__________________________________________________________________ UpdateYear
function UpdateYear() 
{
    var tbxYear = window.document.getElementById('TextBoxYear');
    if (tbxYear == null) return;
    if (tbxYear.value.length != 4) return;
    var currentYear = parseInt(tbxYear.value);
    if (currentYear < 1900) return;
    if (currentYear > 8888) return;
    //
    var ddMonth = window.document.getElementById('DropDownMonth');
    if (ddMonth == null) return;
    CalendarUpdateSelection(window, 1, ddMonth.value, currentYear);
}

//__________________________________________________________________ CreateMonthsName
function CreateMonthsName(monthsText)
{
	var data = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	var monthsLengths = monthsText.length;
	if (monthsLengths != 36) return data;
	var i;
	var offset;
	var text = null;
	for (i = 0; i < 12; i++)
	{
		offset = 3 * i;
		text = monthsText.substring(offset, offset + 3);
		data[i] = text;
	}
	return data;
}

//__________________________________________________________________ SelectDay
function SelectDay(buttonID, monthsText, tbxID)
{
	var monthName = CreateMonthsName(monthsText);

	var tbxDate = window.opener.document.getElementById(tbxID);
	if (tbxDate == null) return;
	//_______________________________ month
	var ddMonth = window.document.getElementById('DropDownMonth');
	if (ddMonth == null) return;
	var currentMonth = parseInt(ddMonth.value);
	//_______________________________ year
	var tbxYear = window.document.getElementById('TextBoxYear');
	if (tbxYear == null) return;
	if (tbxYear.value.length != 4) return;
	//_______________________________ date
	var buttonDate= window.document.getElementById(buttonID);
	if (buttonDate == null) return;
	if (buttonDate.value < 1)
	{
		tbxDate.value = monthName[currentMonth] + " 01 " + tbxYear.value;
	}
	else if (buttonDate.value < 10)
	{
		tbxDate.value = monthName[currentMonth] + " 0" + buttonDate.value + " " + tbxYear.value;
	}
	else
	{
		tbxDate.value = monthName[currentMonth] + " " + buttonDate.value + " " + tbxYear.value;
	}
	window.close();
}
