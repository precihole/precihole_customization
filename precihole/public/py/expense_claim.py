import frappe

def set_adv_empty(doc,method):
    doc.set("advances", [])

def add_adv(doc, method):
    set_adv_empty(doc, method=None)
    for i in doc.indent:
        emp_adv = frappe.db.get_list('Employee Advance',{'indent': i.indent_name},['name', 'posting_date','advance_amount','claimed_amount'])
        #emp_adv contain list of emp adv for given indent
        for i in emp_adv:
            row = doc.append('advances', {})
            row.employee_advance = i.name
            row.posting_date = i.posting_date
            row.advance_paid = i.advance_amount
            row.unclaimed_amount = i.advance_amount - i.claimed_amount