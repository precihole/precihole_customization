// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt

frappe.ui.form.on('Indent', {
    refresh:function(frm) {
        frm.set_query('department', function() {
			return {
				'filters': {
					'is_group': ['=', 0]
				}
			};
		});
        if(frm.doc.purchase == 1 && frm.doc.order_status == 'Partially Ordered' && frm.doc.workflow_state == 'To Receive and Bill'){
            cur_frm.add_custom_button(__("Purchase Order"), function() {
                frappe.run_serially([ 
                    () => frappe.new_doc('Purchase Order'), 
                    () => { 
                        cur_frm.add_child("indent", { 
                            indent_name : frm.doc.name
                        })
                    }
                ], 
                    //() => next action you want to perform
                );
            }, __("Create"));
        }
        if(frm.doc.docstatus == 1){
            $('.grid-add-row').hide() //hide button
            $('.grid-remove-rows').hide()
        }
        if(frm.doc.__islocal && frm.doc.amended_from){ //amend issue
            frm.set_value("cancel_reason","") //set null
            frm.set_value("hod_approver","")
            frm.set_value("manager_approver","")
            frm.set_value("accepted_by","")
            frm.set_value("rejected_by","")
            frm.set_value("last_status","")
        }

        if(frm.doc.workflow_state == 'Closed'){
            cur_frm.add_custom_button(__("Re-open"), function() {
                frm.set_value("workflow_state", frm.doc.last_status)
                frm.save('Update')
            }, __("Status"));
        }
        else if(frm.doc.workflow_state == 'To Receive and Bill' || frm.doc.workflow_state == 'To Bill'){
            cur_frm.add_custom_button(__("Close"), function() {
                frm.set_value("last_status", frm.doc.workflow_state)
                frm.set_value("workflow_state",'Closed')
                frm.save('Update')
            }, __("Status"));
        }
        if(frm.doc.workflow_state == 'Approved' && frm.doc.purchase == 1){ //for purchase == 1
            cur_frm.add_custom_button(__("Purchase Order"), function() {
                frappe.run_serially([ 
                    () => frappe.new_doc('Purchase Order'), 
                    () => { 
                        cur_frm.add_child("indent", { 
                            indent_name : frm.doc.name
                        })
                    }
                ], 
                    //() => next action you want to perform
                );
            }, __("Create"));

        }
        if(frm.doc.workflow_state == 'Approved' && (frm.doc.admin == 1 || frm.doc.purchase == 1 || frm.doc.travel == 1)){ //for all
            cur_frm.add_custom_button(__("Employee Advance"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Employee Advance'), 
                    () => { 
                        if(frm.doc.admin == 1){
                            frappe.call({
                                async: false,
                                method: "frappe.client.get_value",
                                args: {
                                    "doctype": "Precihole Settings",
                                    "filters": {
                                        'name': 'Precihole Settings' // where Clause 
                                    },
                                    "fieldname": ['default_admin_employee'] // fieldname to be fetched
                                },
                                callback: function (res) {
                                    if (res.message != undefined) {
                                        var value = res.message;
                                        cur_frm.set_value('employee', value.default_admin_employee)
                                    }
                                }
                            });
                        }
                        else if(frm.doc.purchase == 1){
                            frappe.call({
                                async: false,
                                method: "frappe.client.get_value",
                                args: {
                                    "doctype": "Precihole Settings",
                                    "filters": {
                                        'name': 'Precihole Settings' // where Clause 
                                    },
                                    "fieldname": ['default_purchase_employee'] // fieldname to be fetched
                                },
                                callback: function (res) {
                                    if (res.message != undefined) {
                                        var value = res.message;
                                        cur_frm.set_value('employee', value.default_purchase_employee)
                                    }
                                }
                            });
                        }
                        cur_frm.set_value('employee',frm.doc.employee)
                        cur_frm.set_value('purpose',frm.doc.purpose)
                        cur_frm.set_value('advance_amount',frm.doc.total_amount)
                        cur_frm.set_value('indent_c',frm.doc.name)
                    }
                ], 
                    //() => next action you want to perform
                );
            }, __("Create"));

        }
        if(frm.doc.workflow_state == 'To Receive and Bill' && frm.doc.travel == 1){
            cur_frm.add_custom_button(__("Employee Advance"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Employee Advance'), 
                    () => {
                        cur_frm.set_value('employee', frm.doc.employee)
                        cur_frm.set_value('purpose', frm.doc.purpose)
                        cur_frm.set_value('advance_amount', frm.doc.total_amount)
                        cur_frm.set_value('indent_c', frm.doc.name)
                    }
                ], 
                    //() => next action you want to perform
                );
            }, __("Create"));

        }
        if(frm.doc.workflow_state == 'To Bill' && (frm.doc.admin == 1 || frm.doc.purchase == 1)){
            cur_frm.add_custom_button(__("Expense Claim"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Expense Claim'),
                    () => {
                        if(frm.doc.admin == 1){
                            frappe.call({
                                async: false,
                                method: "frappe.client.get_value",
                                args: {
                                    "doctype": "Precihole Settings",
                                    "filters": {
                                        'name': 'Precihole Settings' // where Clause 
                                    },
                                    "fieldname": ['default_admin_employee'] // fieldname to be fetched
                                },
                                callback: function (res) {
                                    if (res.message != undefined) {
                                        var value = res.message;
                                        cur_frm.set_value('employee',value.default_admin_employee)
                                    }
                                }
                            });
                        }
                        else if(frm.doc.purchase == 1){
                            frappe.call({
                                async: false,
                                method: "frappe.client.get_value",
                                args: {
                                    "doctype": "Precihole Settings",
                                    "filters": {
                                        'name': 'Precihole Settings' // where Clause 
                                    },
                                    "fieldname": ['default_purchase_employee'] // fieldname to be fetched
                                },
                                callback: function (res) {
                                    if (res.message != undefined) {
                                        var value = res.message;
                                        cur_frm.set_value('employee',value.default_purchase_employee)
                                    }
                                }
                            });
                        }
                        cur_frm.set_value('employee', frm.doc.employee)
                        cur_frm.add_child("indent", {
                            indent_name : indent
                        })
                        cur_frm.refresh()

                    }
                ],
                    //() => next action you want to perform
                );
            }, __("Create"));
            cur_frm.add_custom_button(__("Purchase Invoice"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Purchase Invoice'),
                    () => { 
                        cur_frm.add_child("indent", { 
                            indent_name : indent
                        })
                    }
                ], 
                    //() => next action you want to perform
                );
            }, __("Create"));

        }
        if(frm.doc.workflow_state == 'To Bill' && frm.doc.travel == 1){
            cur_frm.add_custom_button(__("Expense Claim"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Expense Claim'),
                    () => { 
                        cur_frm.set_value('employee', frm.doc.employee)
                        cur_frm.add_child("indent", { 
                            indent_name : indent
                        })
                        cur_frm.refresh()

                    }
                ],
                    //() => next action you want to perform
                );
            }, __("Create"));
        }
    }
});
frappe.ui.form.on('Indent', {
    onload:function(frm) {
        //frm.set_df_property('hod_approver', 'read_only', 1)
        //frm.set_df_property('manager_approver', 'read_only', 1)
        //frm.set_df_property('accepted_by', 'read_only', 1) 
        
        // $(document).ready(function(){
        //     $("[data-fieldname='purpose']").bind("paste",function(e) { //purpose paste disable
        //         e.preventDefault();
        //     });
        // });

        // if created using duplicate
        if(frm.doc.__islocal && frm.doc.amended_from == undefined){
            cur_frm.add_child("items", { 
                rate : 0
            })
            frm.set_value("cancel_reason","")
            frm.set_value("hod_approver","")
            frm.set_value("manager_approver","")
            frm.set_value("accepted_by","")
            frm.set_value("rejected_by","")
            frm.set_value("last_status","")
        }
        if(frm.doc.workflow_state == 'Approved' || frm.doc.workflow_state == 'To Receive and Bill'){
            var df = frappe.meta.get_docfield("Indent Item","is_received", cur_frm.doc.name);
            df.read_only = 0;
        }
        frm.refresh();
    }
});
frappe.ui.form.on('Indent',  {
    purchase: function(frm) {
        if (frm.doc.purchase == 1){
            frm.set_value("admin",0)
            frm.set_value("travel",0)
            frappe.msgprint("Indent will Assign to Purchase")
        }
    } 
});
frappe.ui.form.on('Indent',  {
    admin: function(frm) {
        if (frm.doc.admin == 1){
            frm.set_value("purchase",0)
            frm.set_value("travel",0)
            frappe.msgprint("Indent will Assign to Admin")
        }
    } 
});
frappe.ui.form.on('Indent',  {
    travel: function(frm) {
        if (frm.doc.travel == 1){
            frm.set_value("purchase",0)
            frm.set_value("admin",0)
            frappe.msgprint("Indent will Assign to Accounts")
        }
    } 
});