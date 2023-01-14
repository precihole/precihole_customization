// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Item Code Request", {
// 	refresh(frm) {

// 	},
// });
//===================================================Link Filter============================================================================
frappe.ui.form.on('Item Code Request', {
	onload: function(frm) {
		frm.set_query('expense_account', function() {
			return {
				'filters': {
					'is_group': ['=', 0]
				}
			};
		});
			frm.set_query('income_account', function() {
			return {
				'filters': {
					'is_group': ['=', 0]
				}
			};
		});

	},
});