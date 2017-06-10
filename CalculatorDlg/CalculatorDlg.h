#pragma once  //______________________________________ CalculatorDlg.h  
#include "Resource.h"
#include "..\CalculatorDlgDual.h"
class CalculatorDlg: public Win::Dialog, public CalculatorDlgDual
{
public:
	CalculatorDlg()
	{
	}
	~CalculatorDlg()
	{
	}
protected:
	//______ Wintempla GUI manager section begin: DO NOT EDIT AFTER THIS LINE
	Win::Button btCalculate;
	Win::Textbox tbxX;
	Win::Textbox tbxY;
	Win::Textbox tbxResult;
	Win::Label lb1;
	Win::Label lb2;
protected:
	Win::Gdi::Font fontArial009A;
	void GetDialogTemplate(DLGTEMPLATE& dlgTemplate)
	{
		dlgTemplate.cx=Sys::Convert::CentimetersToDlgUnitX(20.24063);
		dlgTemplate.cy=Sys::Convert::CentimetersToDlgUnitY(1.40229);
		dlgTemplate.style = WS_CAPTION | WS_POPUP | WS_SYSMENU | WS_VISIBLE | DS_CENTER | DS_MODALFRAME;
	}
	//_________________________________________________
	void InitializeGui()
	{
		this->Text = L"CalculatorDlg";
		btCalculate.CreateX(NULL, L"Calculate", WS_CHILD | WS_TABSTOP | WS_VISIBLE | BS_PUSHBUTTON | BS_CENTER | BS_VCENTER, 16.13958, 0.52917, 3.91583, 0.68792, hWnd, 1000);
		tbxX.CreateX(WS_EX_CLIENTEDGE, NULL, WS_CHILD | WS_TABSTOP | WS_VISIBLE | ES_AUTOHSCROLL | ES_LEFT | ES_WINNORMALCASE, 1.21708, 0.52917, 3.91583, 0.68792, hWnd, 1001);
		tbxY.CreateX(WS_EX_CLIENTEDGE, NULL, WS_CHILD | WS_TABSTOP | WS_VISIBLE | ES_AUTOHSCROLL | ES_LEFT | ES_WINNORMALCASE, 5.95313, 0.52917, 3.91583, 0.68792, hWnd, 1002);
		tbxResult.CreateX(WS_EX_CLIENTEDGE, NULL, WS_CHILD | WS_TABSTOP | WS_VISIBLE | ES_AUTOHSCROLL | ES_LEFT | ES_WINNORMALCASE, 11.00667, 0.52917, 3.91583, 0.68792, hWnd, 1003);
		lb1.CreateX(NULL, L"+", WS_CHILD | WS_VISIBLE | SS_LEFT | SS_WINNORMAL, 5.18583, 0.60854, 0.71437, 0.60854, hWnd, 1004);
		lb2.CreateX(NULL, L"=", WS_CHILD | WS_VISIBLE | SS_LEFT | SS_WINNORMAL, 9.94833, 0.55563, 0.97896, 0.60854, hWnd, 1005);
		fontArial009A.CreateX(L"Arial", 0.317500, false, false, false, false);
		btCalculate.Font = fontArial009A;
		tbxX.Font = fontArial009A;
		tbxY.Font = fontArial009A;
		tbxResult.Font = fontArial009A;
		lb1.Font = fontArial009A;
		lb2.Font = fontArial009A;
		//WintemplaDual:CalculatorDlgDual
		this->pbtCalculate = &btCalculate;
		this->ptbxX = &tbxX;
		this->ptbxY = &tbxY;
		this->ptbxResult = &tbxResult;
		this->plb1 = &lb1;
		this->plb2 = &lb2;
	}
	//_________________________________________________
	void btCalculate_Click(Win::Event& e);
	void Window_Open(Win::Event& e);
	//_________________________________________________
	bool EventHandler(Win::Event& e)
	{
		if (btCalculate.IsEvent(e, BN_CLICKED)) {btCalculate_Click(e); return true;}
		return false;
	}
};
