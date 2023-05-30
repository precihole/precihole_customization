# Copyright (c) 2023, Precihole and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class RequestforPayment(Document):
	def before_insert(self):
		self.status = 'Draft'
