frappe.ui.form.on('Purchase Order',  {
    onload_post_render: function(frm) {
        setTimeout(() => {
            frm.remove_custom_button('Payment Request', 'Create'); //hide
        }, 1000);
        frm.add_custom_button(__('Request for Payment'), function(){
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
        }, __("Create"));
    }
});