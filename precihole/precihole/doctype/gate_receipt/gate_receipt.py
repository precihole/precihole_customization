# Copyright (c) 2023, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class GateReceipt(Document):
	pass
	def before_save(doc):
		if doc.received_by:
			if not doc.full_name:
				full_name = frappe.db.get_value('User', {'email': doc.received_by}, 'full_name')
				doc.full_name = full_name
		elif doc.goods_taken_out_by:
			if not doc.full_name:
				full_name = frappe.db.get_value('User', {'email': doc.goods_taken_out_by}, 'full_name')
				doc.full_name = full_name
		if doc.stock_entry:
			supplier = frappe.db.get_value("Stock Entry",doc.stock_entry,"supplier") or ''
			if supplier != doc.supplier :
				frappe.throw("Supplier is not matching with the stock entry")