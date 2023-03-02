import frappe

def update_status_after_submit(doc,method):
    if frappe.db.get_value('Indent', doc.indent_c,'admin') == 1:
        workflow_state = frappe.db.get_value('Indent', doc.indent_c,'workflow_state')
        if workflow_state == 'Approved':
            frappe.db.set_value("Indent",doc.indent_c, "workflow_state", "To Receive and Bill")
def update_status_after_cancel(doc,method):
    workflow_state = frappe.db.get_value('Indent', doc.indent_c,'workflow_state')
    admin = frappe.db.get_value('Indent', doc.indent_c,'admin')
    if admin == 1:
        if workflow_state == 'To Receive and Bill':
            frappe.db.set_value("Indent",doc.indent_c, "workflow_state", "Approved")
        else:
            frappe.throw('Not allow to cancel')