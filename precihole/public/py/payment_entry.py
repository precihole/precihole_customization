import frappe

def set_submit_status(doc, method):
	if doc.payment_request_c:
		if frappe.get_value('Request for Payment', doc.payment_request_c, 'paid_amount') == doc.paid_amount:
			frappe.db.set_value('Request for Payment', doc.payment_request_c, 'status', 'Paid')
		else:
			frappe.throw('Please ensure that the amount entered matches the requested amount')
def set_cancel_status(doc, method):
	if doc.payment_request_c:
		frappe.db.set_value('Request for Payment', doc.payment_request_c, 'status', 'Initiated')