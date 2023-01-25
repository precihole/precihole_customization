// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Indent", {
// 	before_workflow_action:function(frm) {
//         frappe.confirm('Are you sure you want to proceed?',
//     () => {
//         // action to perform if Yes is selected
//     }, () => {
//         frappe.throw('Are you sure you want to proceed?')
//     })
    
// 	},
// });
frappe.ui.form.on('Indent', {
    refresh:function(frm) {
        if(frm.doc.docstatus == 1){
            $('.grid-add-row').hide()
            $('.grid-remove-rows').hide()
        }
        //created using amend option
        if(frm.doc.__islocal && frm.doc.amended_from){
            frm.set_value("cancel_reason","")
            frm.set_value("hod_approver","")
            frm.set_value("manager_approver","")
            frm.set_value("accepted_by","")
            frm.set_value("rejected_by","")
            frm.set_value("last_status","")
        }

        //Closed Button
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
                //frappe.set_route('Form','Indent',frm.doc.name);
            }, __("Status"));
        }
        //po button only for purchase
        if(frm.doc.workflow_state == 'Approved' && frm.doc.purchase == 1){
            cur_frm.add_custom_button(__("Purchase Order"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Purchase Order'), 
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

        //ea button only for admin and purchase
        if(frm.doc.workflow_state == 'Approved' && (frm.doc.admin == 1 || frm.doc.purchase == 1 || frm.doc.travel == 1)){
            cur_frm.add_custom_button(__("Employee Advance"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Employee Advance'), 
                    () => { 
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
        if(frm.doc.workflow_state == 'To Bill' && (frm.doc.admin == 1 || frm.doc.purchase == 1)){
            cur_frm.add_custom_button(__("Expense Claim"), function() {
                var indent = frm.doc.name 
                frappe.run_serially([ 
                    () => frappe.new_doc('Expense Claim'),
                    () => { 
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
        
        //purpose readonly
        $(document).ready(function(){
            $("[data-fieldname='purpose']").bind("paste",function(e) {
                e.preventDefault();
            });
        });
        // if created using duplicate
        if(frm.doc.__islocal && frm.doc.amended_from == undefined){
            cur_frm.add_child("items", { 
                rate : 0
            })
            frm.set_value("hod_approver","")
            frm.set_value("manager_approver","")
            frm.set_value("accepted_by","")
            frm.set_value("rejected_by","")
            frm.set_value("last_status","")
        }

        // if(frm.doc.workflow_state !== 'Updation Pending'){
        //     var df = frappe.meta.get_docfield("Indent Item","rate", cur_frm.doc.name);
        //     df.allow_on_submit = 0;
        // }
        if(frm.doc.workflow_state == 'Approved' || frm.doc.workflow_state == 'To Receive and Bill'){
            var df = frappe.meta.get_docfield("Indent Item","is_received", cur_frm.doc.name);
            df.read_only = 0;
        }
        frm.refresh();
    }
});
// frappe.ui.form.on('Indent', {
//     after_workflow_action:function(frm) {       
//         frappe.msgprint('After')
//         frm.refresh('items')
//     }
// });
// frappe.ui.form.on('Indent Item', {
// 	rate(frm) {
//         var child = locals[cdt][cdn];
//         child.amount = child.qty * child.rate
//         frm.refresh()
// 	}
// })
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
// frappe.ui.form.on("Indent", {
// 	refresh: function(frm) {
//         if(frm.doc.__islocal && frm.doc.__unsaved){
//             cur_frm.add_child("items", { 
//                 rate : 0
//             })
//             frm.set_value("hod_approver","")
//             frm.set_value("manager_approver","")
//         }
// 	}
// });