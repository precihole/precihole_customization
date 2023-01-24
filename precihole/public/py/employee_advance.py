import frappe

def update_status_after_submit(doc,method):
    workflow_state = frappe.db.get_value('Indent', doc.indent_c,'workflow_state')
    if workflow_state == 'Approved':
        frappe.db.set_value("Indent",doc.indent_c, "workflow_state", "To Receive and Bill")
def update_status_after_cancel(doc,method):
    workflow_state = frappe.db.get_value('Indent', doc.indent_c,'workflow_state')
    if workflow_state == 'To Receive and Bill':
        frappe.db.set_value("Indent",doc.indent_c, "workflow_state", "Approved")