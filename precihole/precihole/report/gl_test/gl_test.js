// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["GL Test"] = {
	"filters": [
		{
			'fieldname': 'account',
			'label': ('Account'),
			'fieldtype': 'Link',
			'options': 'Account',
			'width': 300
		},
	]
};
