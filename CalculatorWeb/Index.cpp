#include "stdafx.h"  //_____________________________________________ Index.cpp
#include "Index.h"

void Index::Window_Open(Web::HttpConnector& h)
{
	CalculatorDlgDual::Window_Open(*this, &h);
}



void Index::btCalculate_onclick(Web::HttpConnector& h)
{
	CalculatorDlgDual::btCalculate_Click(*this, &h);
}

