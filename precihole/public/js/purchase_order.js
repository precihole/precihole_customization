frappe.ui.form.on('Purchase Order',  {
    onload_post_render: function(frm) {
        setTimeout(() => {
            frm.remove_custom_button('Payment Request', 'Create'); //hide
        }, 1000);

        if(frm.doc.rounded_total !== frm.doc.advance_paid){
            frm.add_custom_button(__('Request for Payment'), function(){
                frappe.call({
                    method: "precihole.precihole.doctype.request_for_payment.request_for_payment.get_request_for_payment_flag",
                    args: {
                        doctype: frm.doc.doctype,
                        id: frm.doc.name,
                    },
                    callback: function (res) {
                        if(frm.doc.rounded_total == res.message[0]){
                            frappe.throw('Payment request has already been generated for the amount specified in the purchase order.')
                        }
                        else{
                            frappe.run_serially([ 
                                () => frappe.new_doc('Request for Payment'), 
                                () => {
                                    cur_frm.set_value('party_type', 'Supplier')
                                    cur_frm.set_value('party', frm.doc.supplier)
                                    cur_frm.set_value('reference_doctype', frm.doc.doctype)
                                    cur_frm.set_value('reference_name', frm.doc.name)
                                }
                            ], 
                                //() => next action you want to perform
                            );
                        }
                    }
                })
            }, __("Create"));
        }
    }
});