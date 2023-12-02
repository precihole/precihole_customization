// Copyright (c) 2023, Precihole and contributors
// For license information, please see license.txt

frappe.ui.form.on('Request for Payment',  {
	refresh(frm) {
        if (frm.doc.payment_request_type == 'Outward'){
            frm.set_value('party_type', 'Supplier')
        }
        var rounded_total = 0
        // if (frm.doc.docstatus == 0){
        //     cur_frm.add_custom_button(__("Indent"), function() {
        //         new frappe.ui.form.MultiSelectDialog({
        //             doctype: "Indent",
        //             target: cur_frm.doc.name,
        //             setters: {
        //                 posting_date: null
        //             },
        //             add_filters_group: 1,
        //             date_field: "posting_date",
        //             get_query() {
        //                 return {
        //                     filters: { docstatus: ['=', 1], travel: ['!=', 1], workflow_state: ['=', 'Approved']}
        //                 }
        //             },
        //             action(selections) {
        //                 const iterator = selections.values();
        //                 cur_frm.clear_table("references");
        //                 for (const value of iterator) {
        //                     frappe.call({
        //                         async: false,
        //                         method: "frappe.client.get_value",
        //                         args: {
        //                             doctype: "Indent",
        //                             fieldname: 'total_amount',
        //                             filters: {
        //                                 name: value
        //                             }
        //                         },
        //                         callback: function(r) {
        //                             if (r.message) {
        //                                 cur_frm.add_child("references", { 
        //                                     reference_doctype: 'Indent',
        //                                     reference_name: value,
        //                                     amount: r.message.total_amount
        //                                 })
        //                                 rounded_total += r.message.total_amount
        //                             }
        //                         }
        //                     });
        //                 }
        //                 cur_frm.set_value('rounded_total', rounded_total)
        //                 cur_frm.set_value('outstanding_amount', rounded_total)
        //                 cur_frm.set_value('paid_amount', rounded_total)    
        //                 cur_frm.refresh_field("references");
        //                 cur_dialog.hide();
        //             }
        //         });
        //     }, __("Get Items From"));
        // }
		if(frm.doc.party_name){
            frm.set_query('reference_name', function() {
                return {
                    'filters': {
                        //filter for reference_name based on party_name
                        'supplier_name': ['=', frm.doc.party_name],
                        'docstatus': ['=', 1]
                    }
                };
            });
		}
        frappe.db.get_list('Payment Entry', {
            fields: ['name'],
            filters: {
                'payment_request_c': ['=', frm.doc.name],
                'docstatus': ['in', [0,1]]
            }
        }).then(records => {
            if (records.length === 0 && frm.doc.docstatus == 1){
                frm.add_custom_button(__('Create Payment Entry'), function(){
                    var default_bank_account;
                    // Get the default bank account of the current company
                    frappe.call({
                        method: "frappe.client.get_value",
                        args: {
                            doctype: "Company",
                            fieldname: "default_bank_account",
                            filters: {
                                name: frm.doc.company
                            }
                        },
                        callback: function(r) {
                            if (r.message) {
                                default_bank_account = r.message.default_bank_account
                            }
                        }
                    });
                    frappe.run_serially([ 
                        () => frappe.new_doc('Payment Entry'), 
                        () => {
                            cur_frm.set_value('payment_type', 'Pay')
                            cur_frm.set_value('mode_of_payment', frm.doc.mode_of_payment)
                            cur_frm.set_value('party_type', frm.doc.party_type)
                        },
                        () => {
                            setTimeout(() => {
                                cur_frm.set_value('party', frm.doc.party)
                                cur_frm.set_value('paid_from', default_bank_account)
                            }, 1000); // Delay of 1 second
                        },
                        () => {
                            cur_frm.set_value('paid_amount', frm.doc.paid_amount)
                            cur_frm.set_value('received_amount', frm.doc.paid_amount)
                        },
                        () => {
                            setTimeout(() => {
                                cur_frm.add_child("references", { 
                                    reference_doctype: frm.doc.reference_doctype,
                                    reference_name: frm.doc.reference_name,
                                    total_amount: frm.doc.rounded_total,
                                    outstanding_amount: frm.doc.outstanding_amount,
                                    allocated_amount: frm.doc.paid_amount
                                })
                            }, 2000); // Delay of 2 second
                        },
                        () => {
                            setTimeout(() => {
                                cur_frm.refresh_field("references")
                            }, 2000); // Delay of 2 second
                        },
                        () => {
                            cur_frm.set_value('payment_request_c', frm.doc.name)
                        }
                    ], 
                        //() => next action you want to perform
                    );
                }).addClass("btn-primary");
                
            }
        })
        // route to another document
	},
    party: function(frm) {
        frappe.call({
            async: false,
            method: "frappe.client.get_value",
            args: {
                "doctype": frm.doc.party_type,
                "filters": {
                    'name': frm.doc.party // where Clause
                },
                "fieldname": ['supplier_name']
            },
            callback: function (res) {
                if (res.message !== undefined) {
                    var value=res.message;
                    frm.set_value('party_name', value.supplier_name)
                }
            }
        })
    },
	// get transaction details from reference_name
	reference_name: function(frm) {
        if (frm.doc.reference_doctype == "Purchase Order"){
            frappe.call({
                async: false,
                method: "frappe.client.get",
                args: {
                    "doctype": frm.doc.reference_doctype,
                    "filters": {
                        'name': frm.doc.reference_name //where Clause
                    },
                    "fieldname": ['rounded_total','advance_paid']
                },
                callback: function (res) {
                    if (res.message !== undefined) {
                        var value=res.message;
                        frm.set_value('rounded_total', value.rounded_total)
                        frm.set_value('advance_paid', value.advance_paid)
                        frm.set_value('outstanding_amount', value.rounded_total - value.advance_paid)
                        frm.set_value('paid_amount', frm.doc.outstanding_amount)
                    }
                }
            })
        }
        else if(frm.doc.reference_doctype == "Purchase Invoice"){
            frappe.call({
                async: false,
                method: "frappe.client.get",
                args: {
                    "doctype": frm.doc.reference_doctype,
                    "filters": {
                        'name': frm.doc.reference_name //where Clause
                    },
                    "fieldname": ['rounded_total', 'total_advance', 'outstanding_amount']
                },
                callback: function (res) {
                    if (res.message !== undefined) {
                        var value=res.message;
                        frm.set_value('rounded_total', value.rounded_total)
                        frm.set_value('advance_paid', value.total_advance)
                        frm.set_value('outstanding_amount', value.outstanding_amount)
                        frm.set_value('paid_amount', value.outstanding_amount)
                    }
                }
            })
        }
    },

	// outstanding_amount will change
    rounded_total: function(frm) {
        if (frm.doc.reference_doctype == "Purchase Order"){
            frm.set_value('outstanding_amount', frm.doc.rounded_total - frm.doc.advance_paid)
        }
    },

	// rounded_total & outstanding_amount will change
    advance_paid: function(frm) {
        if (frm.doc.reference_doctype == "Purchase Order"){
            frm.set_value('outstanding_amount', frm.doc.rounded_total - frm.doc.advance_paid)
            frm.set_value('rounded_total', frm.doc.advance_paid + frm.doc.outstanding_amount)
        }
    },

	// paid_amount will change
    outstanding_amount: function(frm) {
        frm.set_value('paid_amount', frm.doc.outstanding_amount)
    },

	// paid_amount will change
	paid_percent: function(frm) {
        if(frm.doc.paid_percent > 0 && frm.doc.paid_percent < 100){
            frm.set_value('paid_amount', (frm.doc.outstanding_amount * frm.doc.paid_percent) / 100)
        }
        if (frm.doc.paid_percent > 100){
            if (frm.doc.references[0].reference_doctype != 'Indent'){
                frm.set_value('paid_percent', 0)
                frm.set_value('paid_amount', 0)
                frappe.throw('Percentage value must be less than or equal to 100')
            }
        }
    },

	// paid_percent will change
    paid_amount: function(frm) {
        frm.set_value('paid_percent', (frm.doc.paid_amount / frm.doc.outstanding_amount) * 100)
        if(frm.doc.adjust_percent == 1){
            frm.set_value('adjust_percent', 0)
        }
        if(frm.doc.adjust_amount == 1){
            frm.set_value('adjust_amount', 0)
        }
    },

	adjust_percent: function(frm) {
        if (frm.doc.adjust_percent == 1){
            frm.set_df_property('paid_percent', 'read_only', 0) //read-only
        }
        else{
            frm.set_df_property('paid_percent', 'read_only', 1) //read-only
        }
    },
    adjust_amount: function(frm) {
        if (frm.doc.adjust_amount == 1){
            frm.set_df_property('paid_amount', 'read_only', 0) //read-only
        }
        else{
            frm.set_df_property('paid_amount', 'read_only', 1) //read-only
        }
    },
    before_workflow_action: async (frm) => {
        if (frm.doc.workflow_state == "Approved" && frm.selected_workflow_action == "Reject" && frm.doc.reject_remark == undefined){
            frappe.throw('Reject Remark is mandatory')
        }
    },
});
