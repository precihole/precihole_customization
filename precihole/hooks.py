from . import __version__ as app_version

app_name = "precihole"
app_title = "Precihole"
app_publisher = "Precihole"
app_description = "Precihole"
app_email = "rehan@preciholesports.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/precihole/css/precihole.css"
# app_include_js = "/assets/precihole/js/precihole.js"
doctype_js = {
    "Purchase Order" : "public/js/purchase_order.js",
    "Purchase Invoice" : "public/js/purchase_invoice.js"
}

# include js, css files in header of web template
# web_include_css = "/assets/precihole/css/precihole.css"
# web_include_js = "/assets/precihole/js/precihole.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "precihole/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
#doctype_js = {"Expense Claim" : "public/js/expense_claim.js"}
# doctype_js = {"Purchase Order" : "server_script/purchase_receipt/purchase_receipt.js"}
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "precihole.utils.jinja_methods",
#	"filters": "precihole.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "precihole.install.before_install"
# after_install = "precihole.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "precihole.uninstall.before_uninstall"
# after_uninstall = "precihole.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "precihole.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	# "*": {
	# 	"on_update": "method",
	# 	"on_cancel": "method",
	# 	"on_trash": "method"
	# }
	#indent whole purchase cycle
    "Purchase Order": {
		"on_submit": "precihole.public.py.buying_cycle.update_indent_progress_after_submit",
        "on_cancel": "precihole.public.py.buying_cycle.update_indent_progress_after_cancel"
	},
    "Purchase Receipt": {
		"on_submit": "precihole.public.py.buying_cycle.update_indent_progress_after_submit",
        "on_cancel": "precihole.public.py.buying_cycle.update_indent_progress_after_cancel"
	},
    "Purchase Invoice": {
		"on_submit": "precihole.public.py.buying_cycle.update_indent_progress_after_submit",
        "on_cancel": "precihole.public.py.buying_cycle.update_indent_progress_after_cancel"
	},
	"User": {
		"after_insert": "precihole.public.py.user.user_master_update"
	},
	"Employee Advance": {
		"on_submit": "precihole.public.py.employee_advance.update_status_after_submit",
		"on_cancel": "precihole.public.py.employee_advance.update_status_after_cancel",
	},
    "Expense Claim": {
		"on_submit": "precihole.public.py.expense_claim.update_status_after_submit",
		"on_cancel": "precihole.public.py.expense_claim.update_status_after_cancel"
	},
    "Payment Entry": {
		"on_submit": "pl_accounts.public.py.payment_entry.set_submit_status",
        "on_cancel": "pl_accounts.public.py.payment_entry.set_cancel_status"
	},
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"precihole.tasks.all"
#	],
#	"daily": [
#		"precihole.tasks.daily"
#	],
#	"hourly": [
#		"precihole.tasks.hourly"
#	],
#	"weekly": [
#		"precihole.tasks.weekly"
#	],
#	"monthly": [
#		"precihole.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "precihole.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "precihole.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "precihole.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"precihole.auth.validate"
# ]
fixtures = [
	#exporting workflows
    {"dt": "Workflow", "filters": [["name", "in", ["Expense Claim","Item Code Request","Erpnext Issue","Indent"]]]},
	#exporting Custom Field for Precihole App
	{"dt": "Custom Field", "filters": [["module", "=", "Precihole"]]},
	{"dt": "Property Setter", "filters": [["module", "=", "Precihole"]]},
	#exporting all workflow state
	"Workflow State",
	"Workflow Action Master"
]