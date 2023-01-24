import frappe

def user_master_update(doc, method):
    user=frappe.get_doc({
        "doctype" : 'User Approvers',
        "user" : doc.name
    }).insert(ignore_permissions=True,ignore_mandatory=True)
    user.save()