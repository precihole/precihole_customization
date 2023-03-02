# Copyright (c) 2022, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Indent(Document):
	def before_insert(doc):
		#frappe.msgprint(frappe.utils.get_url())
		employee = frappe.db.get_value('Employee', {'company_email': frappe.session.user}, 'name')
		if employee:
			expense_approver = frappe.db.get_value('Employee', {'company_email': frappe.session.user}, 'expense_approver')
			employee_name = frappe.db.get_value('Employee', {'company_email': frappe.session.user}, 'employee_name')
			doc.employee = employee
			if not expense_approver:
				frappe.throw('<b>Invalid User: </b>'+'Expense Approver is not set')
			else:
				doc.expense_approver = expense_approver
				doc.employee_name = employee_name
		elif not employee:
			frappe.throw('<b>Invalid User: </b>'+'Employee company email is not set')
		for p in doc.items:
			p.is_received = 0

	def before_save(doc):
		#rate validation stop as per midhat
		# for i in doc.items:
		# 	if i.rate == 0:
		# 		frappe.throw('Rate Cannot be 0')
		if not (doc.purchase or doc.admin or doc.travel):
			frappe.throw('Please select any one option')
		#table calculation
		total = 0
		qty = 0
		for j in doc.items:
			j.amount = j.qty * j.rate
			qty = j.qty + qty
			total = j.amount + total
		doc.total_amount = total
		doc.total_qty = qty
		if doc.required_by < doc.posting_date:
			frappe.throw('Required By date is not before than posting date.')
		if not len(doc.items) > 0:
			frappe.throw('item is mandatory')
		
		#for amount < 2000
		if doc.workflow_state == 'Accept / Reassign' and doc.total_amount < 2000:
			full_name = frappe.db.get_value('User', frappe.session.user, 'full_name')
			doc.hod_approver = full_name
			
		elif doc.workflow_state == 'Management Approval Pending' and doc.total_amount >= 2000:
			full_name = frappe.db.get_value('User', frappe.session.user, 'full_name')
			doc.hod_approver = full_name

		#for amount >= 2000
		elif doc.workflow_state == 'Accept / Reassign' and doc.total_amount >= 2000:			
			full_name = frappe.db.get_value('User', frappe.session.user, 'full_name')
			doc.manager_approver = full_name
		
	def before_submit(doc):
		#accept
		if doc.workflow_state == 'Approved':
			full_name = frappe.db.get_value('User', frappe.session.user, 'full_name')
			doc.accepted_by = full_name
		elif doc.workflow_state == 'Rejected':
		#rejected
			full_name = frappe.db.get_value('User', frappe.session.user, 'full_name')
			doc.rejected_by = full_name

	def on_update_after_submit(doc):			#recevied manually
		is_received_chk=[]
		for j in doc.items:
			is_received_chk.append(j.is_received)
		if is_received_chk.count(1) > 0 and is_received_chk.count(0) > 0 and (doc.workflow_state == 'To Receive and Bill' or doc.workflow_state == 'Approved' or doc.workflow_state == 'Partially Received'):
			frappe.db.set_value('Indent', doc.name , 'receive_status', 'Partially Received')
			frappe.msgprint("Status: "+ frappe.bold('Partially Received'))
			doc.reload()
		elif is_received_chk.count(1) > 0 and is_received_chk.count(0) == 0 and (doc.workflow_state == 'To Receive and Bill' or doc.workflow_state == 'Approved' or doc.workflow_state == 'Partially Received'):
			frappe.db.set_value('Indent', doc.name , 'receive_status', 'Fully Received')
			frappe.db.set_value('Indent', doc.name , 'workflow_state', 'To Bill')
			frappe.msgprint("Status: "+ frappe.bold('Fully Received'))
			doc.reload()
		elif is_received_chk.count(0) > 0 and is_received_chk.count(1) == 0 and (doc.workflow_state == 'To Receive and Bill' or doc.workflow_state == 'Approved' or doc.workflow_state == 'Partially Received'):
			frappe.db.set_value('Indent', doc.name , 'receive_status', 'Not Received')
			doc.reload()

	def before_cancel(doc):
		if not doc.cancel_reason:
			frappe.throw('Remark is Mandatory before Cancel')