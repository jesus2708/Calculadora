#pragma once   //_____________________________________________ Index.h  
#include "resource.h"

#include "..\CalculatorDlgDual.h"
class Index: public Web::Page, public CalculatorDlgDual
{
public:
	Index()
	{
	}
	~Index()
	{
	}
private:
	//______ Wintempla GUI manager section begin: DO NOT EDIT AFTER THIS LINE
	Web::Textbox tbxX;
	Web::Label lb1;
	Web::Textbox tbxY;
	Web::Label lb2;
	Web::Textbox tbxResult;
	Web::Button btCalculate;
protected:
	void InitializeGui()
	{
		this->ID=L"Index";
		this->Title=L"Index";
		this->CssFile=L"cyan.css";
		this->JavascriptFile=L"Index.js";
		this->WebSiteIcon=L"WebSiteIcon.png";
		this->tbxX.ID=L"tbxX";
		this->lb1.ID=L"lb1";
		this->tbxY.ID=L"tbxY";
		this->lb2.ID=L"lb2";
		this->tbxResult.ID=L"tbxResult";
		this->btCalculate.ID=L"btCalculate";
		this->lb1.Text=L"+";
		this->lb2.Text=L"=";
		this->btCalculate.Text=L"Calculate";
		this->tbxX.BeginHtml=L"<table><tr><td>";
		this->tbxX.EndHtml=L"</td>";
		this->tbxX.RowCount=1;
		this->tbxX.ColCount=16;
		this->tbxX.MaxTextLength=32;
		this->lb1.BeginHtml=L"<td>";
		this->lb1.EndHtml=L"</td>";
		this->tbxY.BeginHtml=L"<td>";
		this->tbxY.EndHtml=L"</td>";
		this->tbxY.RowCount=1;
		this->tbxY.ColCount=16;
		this->tbxY.MaxTextLength=32;
		this->lb2.BeginHtml=L"<td>";
		this->lb2.EndHtml=L"</td>";
		this->tbxResult.BeginHtml=L"<td>";
		this->tbxResult.EndHtml=L"</td>";
		this->tbxResult.RowCount=1;
		this->tbxResult.ColCount=16;
		this->tbxResult.MaxTextLength=32;
		this->btCalculate.BeginHtml=L"<td>";
		this->btCalculate.EndHtml=L"</td></tr></table>";
		this->AddChild(tbxX);
		this->AddChild(lb1);
		this->AddChild(tbxY);
		this->AddChild(lb2);
		this->AddChild(tbxResult);
		this->AddChild(btCalculate);
		//WintemplaDual:CalculatorDlgDual
		this->ptbxX = &tbxX;
		this->plb1 = &lb1;
		this->ptbxY = &tbxY;
		this->plb2 = &lb2;
		this->ptbxResult = &tbxResult;
		this->pbtCalculate = &btCalculate;
	}
	//_________________________________________________
	void btCalculate_onclick(Web::HttpConnector& h);
	void Window_Open(Web::HttpConnector& h);
	void EventHandler(Web::HttpConnector& h)
	{
		if (btCalculate.IsEvent(h, LEX_HTML_ONCLICK)) {btCalculate_onclick(h);}
	}
};
