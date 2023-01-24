import frappe

def execute():
    for user in frappe.db.get_list('User', {'name': ['not in', ['Administrator','Guest']]},{'name'}):
        user=frappe.get_doc({
            "doctype" : 'User Approvers',
            "user" : user.name
        }).insert(ignore_permissions=True,ignore_mandatory=True)
        user.save()