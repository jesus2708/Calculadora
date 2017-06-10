#include "stdafx.h"  //________________________________________ CalculatorDlg.cpp
#include "CalculatorDlg.h"

int APIENTRY wWinMain(HINSTANCE hInstance, HINSTANCE , LPTSTR cmdLine, int cmdShow){
	CalculatorDlg app;
	return app.BeginDialog(IDI_CalculatorDlg, hInstance);
}

void CalculatorDlg::Window_Open(Win::Event& e)
{
	CalculatorDlgDual::Window_Open(*this, NULL);
}

void CalculatorDlg::btCalculate_Click(Win::Event& e)
{
	CalculatorDlgDual::btCalculate_Click(*this, NULL);
}

