import frappe

# def set_adv_empty(doc,method):
#     doc.set("advances", [])

# def add_adv(doc, method):
#     set_adv_empty(doc, method=None)
#     for i in doc.indent:
#         emp_adv = frappe.db.get_list('Employee Advance',{'indent': i.indent_name},['name', 'posting_date','advance_amount','claimed_amount'])
#         #emp_adv contain list of emp adv for given indent
#         for i in emp_adv:
#             row = doc.append('advances', {})
#             row.employee_advance = i.name
#             row.posting_date = i.posting_date
#             row.advance_paid = i.advance_amount
#             row.unclaimed_amount = i.advance_amount - i.claimed_amount
def update_status_after_submit(doc,method):
    for u in doc.indent:
        if u.indent_name and u.is_partial == 'No':
            receive_status = frappe.db.get_value('Indent', u.indent_name,'receive_status')
            if receive_status == "Fully Received":
                frappe.db.set_value("Indent",u.indent_name, "workflow_state", "Completed")
                frappe.db.set_value("Indent",u.indent_name, "billing_status", "Fully Billed")
        elif u.indent_name and u.is_partial == 'Yes':
                receive_status = frappe.db.get_value('Indent', u.indent_name,'receive_status')
                if receive_status == "Fully Received":
                    frappe.db.set_value("Indent",u.indent_name, "billing_status", "Partially Billed")
def update_status_after_cancel(doc,method):
    for u in doc.indent:
        if u.indent_name and (u.is_partial == 'No' or u.is_partial == 'Yes'):
            expense_claim = frappe.db.get_all('Indent Details',{
                    'indent_name': u.indent_name,
                    'docstatus': 1,
                    'parenttype': "Expense Claim"
                },
                ['parent']
            )
            if expense_claim:
                frappe.db.set_value("Indent",u.indent_name, "workflow_state", "To Bill")
                frappe.db.set_value("Indent",u.indent_name, "billing_status", "Partially Billed")
            elif not expense_claim:
                frappe.db.set_value("Indent",u.indent_name, "workflow_state", "To Bill")
                frappe.db.set_value("Indent",u.indent_name, "billing_status", "Not Billed")