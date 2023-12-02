# Copyright (c) 2023, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RequestforPayment(Document):
	def before_insert(self):
		self.status = 'Draft'

@frappe.whitelist()
def get_request_for_payment_flag():
	return frappe.db.get_all('Request for Payment', {'reference_doctype': frappe.form_dict.doctype, 'reference_name': frappe.form_dict.id, 'docstatus': 1}, ['sum(paid_amount) as paid_amount'], pluck='paid_amount')