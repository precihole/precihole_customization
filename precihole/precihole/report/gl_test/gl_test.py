# Copyright (c) 2022, Precihole and contributors
# For license information, please see license.txt

import frappe



def execute(filters):
	# data = frappe.db.get_all('GL Entry', ['*'],filters=filters,order_by='creation asc')

	# gl_entry = [ dic for dic in data]

	## We can also access `filters`, defined by either the table above or the client script below
	results = frappe.db.get_all('GL Entry', ['*'],filters=filters,order_by='creation asc')
	gl_entry = [ dic for dic in results if dic.is_cancelled == 0 and dic.voucher_type == 'Purchase Invoice']

	if not filters:
		filters = {}
	columns = get_columns(filters)
	warehouse_list = get_warehouse_list(filters)
	add_warehouse_column(columns, warehouse_list)
	return columns, gl_entry	
	
def get_columns(filters):
	"""return columns"""

	columns = [
		("Posting Date"),
		("Account"),
		("Party Type"),
		("Credit Amount"),
	]
	return columns

def get_warehouse_list(filters):
	wh = frappe.qb.DocType("Account")
	query = frappe.qb.from_(wh).select(wh.name).where(wh.is_group == 0)
	#if filters is
	if filters.get("account"):
		query = query.where(wh.name == filters.get("account"))

	return query.run(as_dict=True)

def add_warehouse_column(columns, warehouse_list):

	for wh in warehouse_list:
		columns += [(wh.name)]


	# Finally, define your columns. Many of the usual field definition properties are available here for use.
	# If you wanted to, you could also specify these columns in the child table above.
	columns = [
		{
			'fieldname': 'account',
			'label': ('Account'),
			'fieldtype': 'Link',
			'options':"Account",
			'width': 200
		},
		{
			'fieldname': 'debit',
			'label': ('Debit'),
			'fieldtype': 'Float',
			'width': 100
		},
		{
			'fieldname': 'credit',
			'label': ('Credit'),
			'fieldtype': 'Float',
			'width': 100
		},
		{
			'fieldname': 'voucher_type',
			'label': ('Voucher Type'),
			'fieldtype': 'Data',
			'width': 100
		},
		{
			'fieldname': 'voucher_no',
			'label': ('Voucher No'),
			'fieldtype': 'Data',
			'width': 100
		},
		{
			'fieldname': 'posting_date',
			'label': ('Date'),
			'fieldtype': 'Data',
			'width': 100
		},
		{
			'fieldname': 'remark',
			'label': ('Remark'),
			'fieldtype': 'Data',
			'width': 100
		},
	]


	# ## finally, we assemble it all together
	# data = columns, gl_entry
